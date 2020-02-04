import { HttpClientModule } from '@angular/common/http';
import { TestBed, inject } from '@angular/core/testing';
import { LocalStorageModule } from 'angular-2-local-storage';
import cloneDeep from 'lodash/cloneDeep';
import sample from 'lodash/sample';
import { CookieService } from 'ngx-cookie-service';
import { Subscription } from 'rxjs';

import { IqsSessionConfigService } from '../../session/services/session.config.service';
import { IqsEmergencyDataService } from './emergency.data.service';
import { SESSION_CONFIG } from '../../session/models/index';
import { TEST_ENVIRONMENT } from '../../shell/tokens';
import { IqsOrganizationsService } from '../../organizations/services/organizations.service';
import { EmergencyPlan } from '../models/index';
import { utils, mockEmergencyPlansProvider, resetToCurrentDefault } from '../../../../mock/src/public_api';

describe('[Emergency] emergency.data.service', () => {

    let service: IqsEmergencyDataService;
    let subs: Subscription;
    let expectedPlans: EmergencyPlan[];

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
                IqsSessionConfigService,
                IqsEmergencyDataService,
                mockEmergencyPlansProvider,
                {
                    provide: TEST_ENVIRONMENT,
                    useValue: true
                },
                {
                    provide: IqsOrganizationsService,
                    useValue: {
                        current: {
                            id: '00000000000000000000000000000000'
                        }
                    }
                },
                {
                    provide: SESSION_CONFIG,
                    useValue: undefined
                },
            ],
        })
            .compileComponents();
    });

    beforeEach(inject([IqsEmergencyDataService],
        (
            emergencyData: IqsEmergencyDataService
        ) => {
            localStorage.clear();
            service = emergencyData;
            subs = new Subscription();
            expectedPlans = expectedPlans = utils.emergencyPlans.findByOrganizationId('00000000000000000000000000000000');
        }));

    afterEach(() => {
        subs.unsubscribe();
        resetToCurrentDefault();
    });

    it('should read emergency plans', done => {
        subs.add(service.readEmergencyPlans().subscribe(plans => {
            expect(plans).toBeTruthy();
            expect(plans).toEqual(expectedPlans);
            done();
        }));
    });

    it('should read emergency plans', done => {
        const plansForOrganization = utils.emergencyPlans.findByOrganizationId('00000000000000000000000000000001');
        subs.add(service.readEmergencyPlans({ organization_id: '00000000000000000000000000000001' }).subscribe(plans => {
            expect(plans).toBeTruthy();
            expect(plans).toEqual(plansForOrganization);
            done();
        }));
    });

    it('should read emergency plan by id', done => {
        const plan: EmergencyPlan = sample(expectedPlans);
        subs.add(service.readEmergencyPlan(plan.id).subscribe(res => {
            expect(res).toEqual(plan);
            done();
        }));
    });

    it('should create emergency plan', done => {
        const plan: EmergencyPlan = cloneDeep(sample(expectedPlans));
        delete plan.id;
        subs.add(service.createEmergencyPlan(plan).subscribe(res => {
            expect(res).toEqual(jasmine.objectContaining(plan));
            expect(res.id).toBeTruthy();
            done();
        }));
    });

    it('should update emergency plan', done => {
        const plan: EmergencyPlan = cloneDeep(sample(expectedPlans));
        plan.name = 'test name';
        subs.add(service.updateEmergencyPlan(plan.id, plan).subscribe(res => {
            expect(res.name).toBeTruthy(plan.name);
            done();
        }));
    });

    it('should delete emergency plan', done => {
        const plan: EmergencyPlan = cloneDeep(sample(expectedPlans));
        subs.add(service.deleteEmergencyPlan(plan.id).subscribe(res => {
            expect(res).toBeTruthy(plan.id);
            done();
        }));
    });
});
