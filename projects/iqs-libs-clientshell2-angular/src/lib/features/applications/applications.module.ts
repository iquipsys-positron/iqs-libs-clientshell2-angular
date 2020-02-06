import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';

import { applicationsReducer } from './store/applications.reducer';
import { ApplicationsEffects } from './store/applications.effects';
import { IqsApplicationsDataService } from './services/applications.data.service';
import { IqsApplicationsService } from './services/applications.service';
import { IqsSettingsModule } from '../settings/index';

@NgModule({
    imports: [
        // Angular and vendors
        CommonModule,
        StoreModule.forFeature('applications', applicationsReducer),
        EffectsModule.forFeature([ApplicationsEffects]),
        // iqs-clients2
        IqsSettingsModule
    ],
    declarations: [],
    providers: [
        IqsApplicationsDataService,
        IqsApplicationsService
    ]
})
export class IqsApplicationsModule { }
