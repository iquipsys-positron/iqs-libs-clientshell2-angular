import { Component, OnInit, Input, OnChanges, SimpleChanges, OnDestroy, Output, EventEmitter } from '@angular/core';
import {
    trigger,
    group,
    state,
    style,
    animate,
    transition,
} from '@angular/animations';
import { TranslateService } from '@ngx-translate/core';
import find from 'lodash/find';
import { PipNavService, NavMenuSection, NavMenuLink } from 'pip-webui2-nav';
import { PipMediaService } from 'pip-webui2-layouts';
import { BehaviorSubject, Observable, combineLatest, Subscription, of } from 'rxjs';
import { map, switchMap, filter } from 'rxjs/operators';

import { IqsApplicationsConfigService } from '../../../applications/services/applications.config.service';
import { ApplicationGroup, ApplicationTile } from '../../../applications/models/index';
import { Organization } from '../../../organizations/models/Organization';
import { IqsSessionService } from '../../../session/services/session.service';
import { IqsSettingsService } from '../../../settings/services/settings.service';
import { SidenavMenuMode } from '../../models/index';
import { getSidenavTranslations } from './sidenav.strings';

@Component({
    selector: 'iqs-sidenav',
    templateUrl: './sidenav.component.html',
    styleUrls: ['./sidenav.component.scss'],
    animations: [
        trigger('slideInOut', [
            state('in', style({
                'opacity': '1', 'visibility': 'visible'
            })),
            state('void', style({
                'max-height': '0px', 'opacity': '0', 'visibility': 'hidden'
            })),
            transition('in => void', [group([
                animate('80ms ease-in-out', style({
                    'opacity': '0'
                })),
                animate('100ms ease-in-out', style({
                    'max-height': '0px'
                })),
                animate('150ms ease-in-out', style({
                    'visibility': 'hidden'
                }))
            ]
            )]),
            transition('void => in', [group([
                animate('1ms 150ms ease-in-out', style({
                    'visibility': 'visible'
                })),
                animate('100ms 150ms ease-in-out', style({
                    'max-height': '*'
                })),
                animate('150ms 150ms ease-in-out', style({
                    'opacity': '1'
                }))
            ]
            )])
        ]),
        trigger('zoomInOut', [
            state('in', style({
                'opacity': '1', 'visibility': 'visible', 'display': 'inline'
            })),
            state('void', style({
                'max-height': '0px', 'opacity': '0', 'visibility': 'hidden'
            })),
            transition('in => void', [group([
                animate('80ms ease-in-out', style({
                    'opacity': '0'
                })),
                animate('100ms ease-in-out', style({
                    'max-height': '0px',
                    'transform': 'scale(0.7)'
                })),
                animate('150ms ease-in-out', style({
                    'visibility': 'hidden'
                }))
            ]
            )]),
            transition('void => in', [group([
                animate('1ms 150ms ease-in-out', style({
                    'visibility': 'visible'
                })),
                animate('100ms 150ms ease-in-out', style({
                    'max-height': '*',
                })),
                animate('150ms 150ms ease-in-out', style({
                    'opacity': '1'
                }))
            ]
            )])
        ]),
    ]
})
export class IqsSidenavComponent implements OnInit, OnChanges, OnDestroy {

    private subs: Subscription;
    private menuMode$: Observable<SidenavMenuMode>;
    private menuMode: SidenavMenuMode;

    public organizationsOpened$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
    public organizationsMode$: Observable<boolean>;

    private sections: any = {
        home: {
            name: 'home',
            links: [
                {
                    name: 'SIDEBAR_HOME',
                    title: 'SIDEBAR_HOME',
                    icon: 'home',
                    tooltipText: 'SIDEBAR_HOME_TOOLTIP',
                    href: '/home/index.html'
                }
            ]
        }
    };

    @Input() groups: ApplicationGroup[];
    @Input() language: string;
    @Input() organizations: Organization[];
    @Input() currentOrganization: Organization;

    @Output() changeCurrentOrganization = new EventEmitter<Organization>();

    constructor(
        private applicationsConfigService: IqsApplicationsConfigService,
        private media: PipMediaService,
        private navService: PipNavService,
        private sessionService: IqsSessionService,
        private settingsService: IqsSettingsService,
        // private organizationsService: OrganizationsService,
        private translate: TranslateService
    ) {
        this.subs = new Subscription();
        this.sections.signout = {
            name: 'so',
            links: [
                {
                    name: 'SIDEBAR_SIGNOUT',
                    title: 'SIDEBAR_SIGNOUT',
                    fontSet: 'webui',
                    icon: 'webui-exit',
                    tooltipText: 'SIDEBAR_SIGNOUT_TOOLTIP',
                    click: () => { this.sessionService.signout(); }
                }
            ]
        };

        const translations = getSidenavTranslations(this.applicationsConfigService.favoritesGroupName);
        this.translate.setTranslation('en', translations.en, true);
        this.translate.setTranslation('ru', translations.ru, true);

        this.organizationsMode$ = combineLatest(
            this.organizationsOpened$,
            this.media.asObservableMain()
        ).pipe(
            map(([isOpened, mc]) => {
                return isOpened && mc.aliases.includes('lt-md');
            })
        );

        this.menuMode$ = this.settingsService.settings$.pipe(
            filter(settings => settings !== null),
            switchMap(settings => {
                return of(settings['menu_mode'] || SidenavMenuMode.Favorites);
            })
        );
        this.subs.add(this.menuMode$.subscribe(mode => {
            this.menuMode = mode;
            this.changeMenuItems();
        }));
    }

    ngOnInit() {
        this.navService.showNavMenu({
            sections: [this.sections.home, this.sections.signout]
        });
    }

    ngOnDestroy() { this.subs.unsubscribe(); }

    ngOnChanges(changes: SimpleChanges) {
        if (changes.hasOwnProperty('language') || changes.hasOwnProperty('groups')) {
            this.language = changes.hasOwnProperty('language') ? changes.language.currentValue : this.language;
            this.groups = changes.hasOwnProperty('groups') ? changes.groups.currentValue : this.groups;
            this.changeMenuItems();
        }
    }

    private createDefaultFavorites(): NavMenuSection {
        const allApplications = [];
        for (const g of this.groups) {
            if (g.name === this.applicationsConfigService.favoritesGroupName) { continue; }
            allApplications.push(...g.applications);
        }
        const section: NavMenuSection = {
            name: this.applicationsConfigService.favoritesGroupName,
            icon: 'star_rate',
            links: []
        };
        for (const id of this.applicationsConfigService.config.defaultFavoritesIds) {
            const app = find(allApplications, ['id', id]);
            if (app) { section.links.push(this.convertApplicationTileToLink(app)); }
        }
        return section;
    }

    private convertApplicationTileToLink(app: ApplicationTile): NavMenuLink {
        const link: NavMenuLink = {
            name: app.id,
            title: app.name[this.language],
            href: app.url,
        };
        if (app.icon && app.icon.includes('-')) {
            link.fontSet = app.icon.split('-')[0];
            link.icon = app.icon;
        } else {
            link.icon = app.icon;
        }
        return link;
    }

    private convertApplicationGroupToSection(g: ApplicationGroup, collapsable: boolean = false): NavMenuSection {
        const section: NavMenuSection = {
            name: g.name,
            icon: g.name === this.applicationsConfigService.favoritesGroupName ? 'star_rate' : 'menu',
            links: []
        };
        if (collapsable) {
            section.title = g.name;
            section.isCollapsable = collapsable;
        }
        for (const app of g.applications) {
            section.links.push(this.convertApplicationTileToLink(app));
        }
        return section;
    }

    private changeMenuItems() {
        if (!this.groups || !this.language) { return; }
        const sections: NavMenuSection[] = [];
        if (this.menuMode === SidenavMenuMode.Favorites) {
            const fg = find(this.groups, ['name', this.applicationsConfigService.favoritesGroupName]);
            if (fg && fg.applications.length) {
                sections.push(this.convertApplicationGroupToSection(fg));
            } else {
                sections.push(this.createDefaultFavorites());
            }
        } else {
            for (const g of this.groups) {
                if (g && g.applications.length) {
                    sections.push(this.convertApplicationGroupToSection(g, true));
                }
            }
        }
        this.navService.showNavMenu({
            sections: [this.sections.home, ...sections, this.sections.signout]
        });
    }

    public toggleOrganizationsView() {
        this.organizationsOpened$.next(!this.organizationsOpened$.getValue());
    }

    public changeOrganization(organization: Organization) {
        this.organizationsOpened$.next(false);
        this.changeCurrentOrganization.emit(organization);
    }
}
