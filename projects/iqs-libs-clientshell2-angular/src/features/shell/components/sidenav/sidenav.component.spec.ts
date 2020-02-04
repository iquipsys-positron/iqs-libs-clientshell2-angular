import { HttpClientModule } from '@angular/common/http';
import { SimpleChange } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterModule } from '@angular/router';
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import { TranslateModule } from '@ngx-translate/core';
import { LocalStorageModule } from 'angular-2-local-storage';
import { CookieService } from 'ngx-cookie-service';
import { PipMediaModule, PipSidenavModule } from 'pip-webui2-layouts';
import { PipNavModule, PipNavService } from 'pip-webui2-nav';

import { IqsSidenavComponent } from './sidenav.component';
import { IqsSidenavModule } from './sidenav.module';
import { ApplicationConfig } from '../../../applications/models/ApplicationConfig';
import { IqsApplicationsConfigService } from '../../../applications/services/applications.config.service';
import { IqsSessionService, SESSION_CONFIG, DEFAULT_SESSION_CONFIG, IqsSessionConfigService } from '../../../session/index';
import { MockSessionService } from '../../../../../mock/src/public_api';
import { IqsSettingsModule } from '../../../settings/settings.module';


declare const viewport;

export function createApplicationConfig() {
    return new IqsApplicationsConfigService(<ApplicationConfig>{});
}

describe('SidenavComponent', () => {

    let component: IqsSidenavComponent;
    let element: HTMLElement;
    let fixture: ComponentFixture<IqsSidenavComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            imports: [
                HttpClientModule,
                EffectsModule.forRoot([]),
                LocalStorageModule.withConfig({
                    prefix: 'iqs-clients2',
                    storageType: 'localStorage'
                }),
                RouterModule.forRoot([]),
                StoreModule.forRoot({}),
                TranslateModule.forRoot(),
                PipMediaModule.forRoot(),
                PipNavModule.forRoot(),
                PipSidenavModule.forRoot(),
                IqsSidenavModule,
                IqsSettingsModule,
            ],
            providers: [
                CookieService,
                IqsSessionConfigService,
                {
                    provide: IqsSessionService,
                    useClass: MockSessionService
                },
                {
                    provide: IqsApplicationsConfigService,
                    useFactory: createApplicationConfig
                },
                {
                    provide: SESSION_CONFIG,
                    useValue: DEFAULT_SESSION_CONFIG
                }
            ]
        })
            .compileComponents();
        fixture = TestBed.createComponent(IqsSidenavComponent);
        component = fixture.componentInstance;
        element = fixture.nativeElement;
        fixture.detectChanges();
    }));

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    xit('should show organizations list on mobile', () => {
        const organizationsList: HTMLElement = element.querySelector('div');
        viewport.set(1024);
        fixture.detectChanges();
        expect(organizationsList.style.display).toEqual('none');
        viewport.set(710);
    });

    it('should send event when organization changes', () => {
        const emitSpy = spyOn(component.changeCurrentOrganization, 'emit');
        component.changeOrganization(null);
        expect(emitSpy).toHaveBeenCalled();
    });

    it('should toogle organizations view', () => {
        component.toggleOrganizationsView();
        expect(component.organizationsOpened$.getValue()).toEqual(true);
        component.toggleOrganizationsView();
        expect(component.organizationsOpened$.getValue()).toEqual(false);
    });

    it('should update favorites', () => {
        const navService: PipNavService = TestBed.get(PipNavService);
        const showNavMenuSpy = spyOn(navService, 'showNavMenu');
        component.ngOnChanges({ groups: new SimpleChange(undefined, [], true), language: new SimpleChange(undefined, 'en', true) });
        expect(showNavMenuSpy).toHaveBeenCalled();
        component.ngOnChanges({});
    });

    it('should call signout', () => {
        const sessionService: MockSessionService = TestBed.get(IqsSessionService);
        const signoutMenuItem: HTMLButtonElement = element.querySelector('pip-nav-menu mat-list-item:last-child');
        const signoutSpy = spyOn(sessionService, 'signout');
        expect(signoutMenuItem).toBeTruthy();
        signoutMenuItem.click();
        expect(signoutSpy).toHaveBeenCalled();
    });

});
