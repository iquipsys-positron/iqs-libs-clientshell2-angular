import { HttpClientModule } from '@angular/common/http';
import { TestBed } from '@angular/core/testing';
import { LocalStorageModule } from 'angular-2-local-storage';
import { cloneDeep, sample } from 'lodash';
import { CookieService } from 'ngx-cookie-service';
import { Subscription } from 'rxjs';

import { IqsApplicationsDataService } from './applications.data.service';
import { IqsApplicationsConfigService } from './applications.config.service';
import { Application, ApplicationTile, ApplicationConfig } from '../models/index';
import { IqsSessionConfigService, SESSION_CONFIG, DEFAULT_SESSION_CONFIG } from '../../session/index';
import { applications, mockApplicationsProvider } from '../../../../mock/src/public_api';

export function createApplicationConfig() {
    return new IqsApplicationsConfigService(<ApplicationConfig>{});
}

describe('[Applications] applications.data.service', () => {

    let service: IqsApplicationsDataService;
    let subs: Subscription;

    beforeEach(() => {
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
                IqsApplicationsDataService,
                mockApplicationsProvider,
                {
                    provide: SESSION_CONFIG,
                    useValue: DEFAULT_SESSION_CONFIG
                },
                {
                    provide: IqsApplicationsConfigService,
                    useFactory: createApplicationConfig
                },
                IqsSessionConfigService
            ],
        })
            .compileComponents();
        service = TestBed.get(IqsApplicationsDataService);
        subs = new Subscription();
    });


    afterEach(() => { subs.unsubscribe(); });

    afterAll(() => {
        localStorage.removeItem('mockApplications');
    });

    it('should read applications', done => {
        subs.add(service.readApplications().subscribe(apps => {
            expect(apps).toEqual(<ApplicationTile[]>applications);
            done();
        }));
    });

    it('should update application', done => {
        const app: ApplicationTile = cloneDeep(applications[0]);
        app.description = { 'en': 'new description', 'ru': 'russian description' };
        subs.add(service.updateApplication(app).subscribe(updated => {
            expect(updated).toEqual(app);
            done();
        }));
    });

    it('shouldn\'t update not existing application', done => {
        const app: ApplicationTile = cloneDeep(applications[0]);
        app.id = 'bad_id';
        app.description = { 'en': 'new description', 'ru': 'russian description' };
        subs.add(service.updateApplication(app).subscribe(
            () => { },
            (error) => { expect(error.code).toEqual('APPLICATION_NOT_FOUND'); done(); }
        ));
    });

    it('should create application', done => {
        const app: ApplicationTile = cloneDeep(applications[0]);
        app.id = 'iqs_test_app';
        app.description = { 'en': 'new description', 'ru': 'russian description' };
        subs.add(service.createApplication(app).subscribe(created => {
            expect(created).toEqual(app);
            done();
        }));
    });

    it('shouldn\'t create existing application', done => {
        const app: ApplicationTile = cloneDeep(applications[0]);
        subs.add(service.createApplication(app).subscribe(
            () => { },
            (error) => { expect(error.code).toEqual('APPLICATION_ALREADY_EXISTS'); done(); }
        ));
    });

    it('should delete application by id', done => {
        const appToDelete = cloneDeep(sample(applications));
        subs.add(service.deleteApplication(appToDelete.id).subscribe(aid => {
            expect(aid).toEqual(appToDelete.id);
            done();
        }));
    });

    it('should delete application by app', done => {
        const appToDelete: Application = cloneDeep(sample(applications));
        subs.add(service.deleteApplication(appToDelete).subscribe(aid => {
            expect(aid).toEqual(appToDelete.id);
            done();
        }));
    });

    it('shouldn\'t delete not existing application', done => {
        const appToDelete: Application = cloneDeep(sample(applications));
        appToDelete.id = 'bad_id';
        subs.add(service.deleteApplication(appToDelete).subscribe(
            () => { },
            (error) => { expect(error.code).toEqual('APPLICATION_NOT_FOUND'); done(); }
        ));
    });

});
