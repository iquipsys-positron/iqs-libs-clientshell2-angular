import { HttpClientModule } from '@angular/common/http';
import { async, TestBed, inject } from '@angular/core/testing';
import { LocalStorageModule } from 'angular-2-local-storage';
import { cloneDeep } from 'lodash';
import { CookieService } from 'ngx-cookie-service';
import { Subscription } from 'rxjs';

import { IqsSettingsDataService } from './settings.data.service';
import { Session, User } from '../../session/models/index';
import { IqsSessionConfigService } from '../../session/services/session.config.service';
import { mockSessionProvider, mockSettingsProvider, users, utils, MockSessionService } from '../../../../mock/src/public_api';
import { IqsSessionService } from '../../session/services/session.service';
import { IqsConfigService } from '../../shell/services/config.service';
import { SHELL_MERGED_CONFIG, mockShellModuleConfig } from '../../shell/tokens';

describe('[Settings] settings.data.service with errors', () => {
    let service: IqsSettingsDataService;
    let sessionService: MockSessionService;
    let subs: Subscription;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            imports: [
                HttpClientModule,
                LocalStorageModule.withConfig({
                    prefix: 'iqs-clients2',
                    storageType: 'localStorage'
                })
            ],
            providers: [
                CookieService,
                IqsSessionConfigService,
                IqsConfigService,
                IqsSettingsDataService,
                mockSessionProvider,
                mockSettingsProvider,
                {
                    provide: SHELL_MERGED_CONFIG,
                    useValue: mockShellModuleConfig
                },
                {
                    provide: IqsSessionService,
                    useClass: MockSessionService
                }
            ]
        })
            .compileComponents();
    }));

    beforeEach(inject([IqsSettingsDataService, IqsSessionService],
        (
            settingsDataService: IqsSettingsDataService,
            sessionServiceI: MockSessionService
        ) => {
            service = settingsDataService;
            sessionService = sessionServiceI;
            subs = new Subscription();
        }));

    afterEach(() => {
        subs.unsubscribe();
    });

    it('should create', () => {
        expect(service).toBeTruthy();
    });

    it('should return error on readSettings', done => {
        service.readSettings().subscribe(
            () => { },
            (error) => { expect(error).toBeTruthy(); done(); }
        );
    });

    it('should return error on readSettings if there\'s no user_id', done => {
        sessionService.init(<Session>{});
        service.readSettings().subscribe(
            () => { },
            (error) => { expect(error).toBeTruthy(); done(); }
        );
    });

    it('should return error on readSettings if user_id is invalid', done => {
        sessionService.init(<Session>{ user_id: '00000000000000000000000000000011' });
        service.readSettings().subscribe(
            () => { },
            (error) => { expect(error).toBeTruthy(); done(); }
        );
    });

    it('should return error on createSettings', done => {
        service.createSettings({}).subscribe(
            () => { },
            (error) => { expect(error).toBeTruthy(); done(); }
        );
    });

    it('should return error on createSettings if there\'s no user_id', done => {
        sessionService.init(<Session>{});
        service.createSettings({}).subscribe(
            () => { },
            (error) => { expect(error).toBeTruthy(); done(); }
        );
    });

    it('should return error on createSettings if user_id is invalid', done => {
        sessionService.init(<Session>{ user_id: '00000000000000000000000000000011' });
        service.createSettings({}).subscribe(
            () => { },
            (error) => { expect(error).toBeTruthy(); done(); }
        );
    });

});

describe('[Settings] settings.data.service', () => {
    let service: IqsSettingsDataService;
    let subs: Subscription;
    let user: User;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            imports: [
                HttpClientModule,

                LocalStorageModule.withConfig({
                    prefix: 'iqs-clients2',
                    storageType: 'localStorage'
                })
            ],
            providers: [
                CookieService,
                IqsSessionConfigService,
                IqsConfigService,
                IqsSettingsDataService,
                mockSessionProvider,
                mockSettingsProvider,
                {
                    provide: SHELL_MERGED_CONFIG,
                    useValue: mockShellModuleConfig
                },
                {
                    provide: IqsSessionService,
                    useClass: MockSessionService
                }
            ]
        })
            .compileComponents();
    }));

    beforeEach(inject([IqsSettingsDataService, IqsSessionService],
        (
            settingsDataService: IqsSettingsDataService,
            sessionService: MockSessionService
        ) => {
            user = users[0];
            service = settingsDataService;
            sessionService.init(utils.sessions.create(user));
            subs = new Subscription();
        }));

    afterEach(() => {
        subs.unsubscribe();
    });

    it('should create', () => {
        expect(service).toBeTruthy();
    });

    it('should read user settings', done => {
        service.readSettings().subscribe(settings => { expect(settings).toEqual(user.settings); done(); });
    });

    it('should create user settings', done => {
        const userSettings = cloneDeep(user.settings);
        userSettings['key3'] = 'value_3';
        service.createSettings(userSettings).subscribe(settings => { expect(settings).toEqual(userSettings); done(); });
    });

});
