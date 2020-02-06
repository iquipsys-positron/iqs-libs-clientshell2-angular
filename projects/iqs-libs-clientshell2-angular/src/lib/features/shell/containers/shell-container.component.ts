import { Component, OnInit, OnDestroy, Inject, ChangeDetectorRef } from '@angular/core';
import { MatDialog } from '@angular/material';
import { TranslateService } from '@ngx-translate/core';
import { LocalStorageService } from 'angular-2-local-storage';
import * as moment_ from 'moment';
import { PipSidenavService, PipRightnavService } from 'pip-webui2-layouts';
import { PipNavService } from 'pip-webui2-nav';
import { PipThemesService } from 'pip-webui2-themes';
import { Subscription, Observable, BehaviorSubject, of } from 'rxjs';
import { distinct } from 'rxjs/operators';

import { shellTranslations } from './shell-container.strings';
import { RightnavState, ShellConfig } from '../models/index';
import { IqsShellService } from '../services/shell.service';
import { IqsSendSignalDialogComponent } from '../components/index';
import { IqsApplicationsService, ApplicationGroup } from '../../applications/index';
import { IqsHelpPanelService } from '../../help/services/help-panel.service';
import { IqsSessionService } from '../../session/services/session.service';
import { Organization } from '../../organizations/index';
import { IqsOrganizationsService } from '../../organizations/services/organizations.service';
import { EntityState } from '../../../common/index';
import { WINDOW, WindowWrapper } from '../../../common/services/window.service';
import { IqsEmergencyService } from '../../emergency/services/emergency.service';
import { IqsEmergencyPanelService } from '../../emergency/services/emergency-panel.service';

const moment = moment_;

@Component({
    // tslint:disable-next-line:component-selector
    selector: 'app-root',
    templateUrl: './shell-container.component.html',
    styleUrls: ['./shell-container.component.scss']
})
export class IqsShellContainerComponent implements OnInit, OnDestroy {

    private subs: Subscription = new Subscription();

    public config$: Observable<ShellConfig>;
    public currentOrganization$: Observable<Organization>;
    public applicationsGroups$: Observable<ApplicationGroup[]>;
    public isAuthorized$: Observable<boolean>;
    public language$: BehaviorSubject<string>;
    public rightnav: {
        state$: Observable<RightnavState>,
        title$: Observable<string>,
        showBack$: Observable<boolean>,
        goBackHandler: Function
    };
    public organizations$: Observable<Organization[]>;
    public organizationsState$: Observable<EntityState>;

    constructor(
        private themeService: PipThemesService,

        private applicationsService: IqsApplicationsService,
        private cd: ChangeDetectorRef,
        private dialog: MatDialog,
        private emergencyService: IqsEmergencyService,
        private sessionService: IqsSessionService,
        private localStorageService: LocalStorageService,
        private navService: PipNavService,
        private rightnavService: PipRightnavService,
        private sidenavService: PipSidenavService,
        private shell: IqsShellService,
        private organizationsService: IqsOrganizationsService,
        private translate: TranslateService,
        @Inject(WINDOW) private window: WindowWrapper,

        private emergencyPanelService: IqsEmergencyPanelService,
        private helpPanelService: IqsHelpPanelService
    ) {
        this.sidenavService.active = true;
        this.config$ = this.shell.config$;
        this.rightnav = {
            state$: this.shell.rightnavState$,
            title$: this.shell.rightnavTitle$,
            showBack$: this.shell.rightnavShowBack$,
            goBackHandler: () => { }
        };
        this.currentOrganization$ = this.organizationsService.current$;
        this.isAuthorized$ = this.sessionService.isAuthorized$;
        this.organizations$ = this.organizationsService.organizations$;
        this.organizationsState$ = this.organizationsService.state$;

        this.sessionService.restore();

        let lng: string = this.localStorageService.get('language');
        if (!lng) {
            // TODO [A1]: compability
            lng = localStorage.getItem('language');
        }
        if (!lng) {
            lng = this.sessionService.session
                && this.sessionService.session['user']
                && this.sessionService.session['user']['language']
                ? this.sessionService.session['user']['language']
                : 'en';
        }
        this.language$ = new BehaviorSubject<string>(lng);

        this.translate.setTranslation('en', shellTranslations.en, true);
        this.translate.setTranslation('ru', shellTranslations.ru, true);
        this.subs.add(this.translate.onLangChange.subscribe(lang => {
            this.localStorageService.set('language', lang.lang);
            moment.locale(lang.lang);
            this.language$.next(lang.lang);
            const session = this.sessionService.session;
            if (session && session.user) {
                session.user.language = lang.lang;
                this.localStorageService.set('session', session);
            }
        }));
        this.translate.use(this.language$.getValue());

        let skipOnce = true;
        this.subs.add(this.sessionService.session$.pipe(distinct()).subscribe(session => {
            if (session && session['user'] && session['user']['language']) {
                if (skipOnce) { skipOnce = true; return; }
                this.language$.next(session['user']['language']);
                this.translate.use(this.language$.getValue());
            }
            skipOnce = false;
        }));

        this.navService.showNavIcon({
            icon: 'menu',
            action: () => {
                this.sidenavService.toggleOpened();
            }
        });

        this.navService.showPrimaryActions({
            actions: [
                {
                    name: 'emergency',
                    icon: 'iqt-emergency',
                    fontSet: 'iqt',
                    click: () => {
                        this.shell.rightnavState = RightnavState.Emergency;
                        this.rightnav.goBackHandler = this.emergencyPanelService.goBack.bind(this.emergencyPanelService);
                        this.cd.detectChanges();
                        this.rightnavService.openFloatingRightnav();
                    }
                },
                {
                    name: 'help',
                    icon: 'help',
                    click: () => {
                        this.shell.rightnavState = RightnavState.Help;
                        this.rightnav.goBackHandler = this.helpPanelService.goBack.bind(this.helpPanelService);
                        this.cd.detectChanges();
                        this.rightnavService.openFloatingRightnav();
                    }
                }
            ]
        });

        this.navService.showSecondaryActions({
            actions: [
                {
                    name: 'send_signal',
                    title: 'APPBAR_SEND_SIGNAL',
                    click: () => {
                        this.shell.showSendSignal();
                    }
                },
                {
                    name: 'usersettings',
                    title: 'APPBAR_USERSETTINGS',
                    click: () => {
                        this.window.location.href = this.window.location.origin + '/settings/index.html#';
                    }
                },
                {
                    name: 'signout',
                    title: 'APPBAR_SIGNOUT',
                    click: () => { this.sessionService.signout(); }
                }
            ]
        });

        this.applicationsGroups$ = this.applicationsService.groups$;
        this.subs.add(this.shell.onSendSignal.subscribe(() => {
            this.dialog.open(IqsSendSignalDialogComponent);
        }));
    }

    ngOnInit() {
        this.emergencyService.init();
        // this.applicationsService.init();
    }

    ngOnDestroy() {
        this.subs.unsubscribe();
    }

    public changeCurrentOrganization(organization: Organization) {
        this.organizationsService.current = organization;
        if (this.sidenavService.opened) {
            this.sidenavService.closeNav();
        }
    }

    public closeRightnav() {
        this.rightnavService.closeFloatingRightnav();
    }
}
