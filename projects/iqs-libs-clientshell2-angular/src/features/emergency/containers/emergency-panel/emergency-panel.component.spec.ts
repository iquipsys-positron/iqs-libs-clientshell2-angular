import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { StoreModule } from '@ngrx/store';
import { TranslateModule } from '@ngx-translate/core';
import { of } from 'rxjs';

import { EmergencyPanelComponent } from './emergency-panel.component';
import { IqsEmergencyPanelModule } from './emergency-panel.module';
import { IqsEmergencyService } from '../../services/emergency.service';
import { IqsEmergencyPanelService } from '../../services/emergency-panel.service';
import { EmergencyPanelState } from '../../models/index';
import { EntityState } from '../../../../common';
import { utils } from '../../../../../mock/src/public_api';

describe('EmergencyPanelComponent', () => {
    let component: EmergencyPanelComponent;
    let fixture: ComponentFixture<EmergencyPanelComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            imports: [
                StoreModule.forRoot([]),
                TranslateModule.forRoot(),

                IqsEmergencyPanelModule
            ],
            providers: [
                {
                    provide: IqsEmergencyService,
                    useValue: {
                        plans$: of(utils.emergencyPlans.findByOrganizationId('00000000000000000000000000000000')),
                        state$: of(EntityState.Data)
                    }
                },
                {
                    provide: IqsEmergencyPanelService,
                    useValue: {
                        currentPlan: null,
                        state: EmergencyPanelState.List
                    }
                }
            ]
        })
            .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(EmergencyPanelComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
