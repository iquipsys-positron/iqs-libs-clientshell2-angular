import { NgModule, ModuleWithProviders } from '@angular/core';
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';

import { IqsEmergencyComponentsModule } from './components/components.module';
import { IqsEmergencyContainersModule } from './containers/containers.module';
import { IqsEmergencyPanelService } from './services/emergency-panel.service';
import { IqsEmergencyDataService } from './services/emergency.data.service';
import { IqsEmergencyService } from './services/emergency.service';
import { EmergencyEffects } from './store/emergency.effects';
import { emergencyReducer } from './store/emergency.reducer';

@NgModule({
    imports: [
        IqsEmergencyComponentsModule,
        IqsEmergencyContainersModule,
        StoreModule.forFeature('emergency_plans', emergencyReducer),
        EffectsModule.forFeature([EmergencyEffects])
    ],
    exports: [
        IqsEmergencyComponentsModule,
        IqsEmergencyContainersModule
    ],
    providers: [
        IqsEmergencyDataService,
        IqsEmergencyService
    ]
})
export class IqsEmergencyModule {
    static forRoot(): ModuleWithProviders {
        return {
            ngModule: IqsEmergencyModule,
            providers: [
                IqsEmergencyPanelService
            ]
        };
    }
}
