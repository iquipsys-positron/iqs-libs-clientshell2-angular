import { NgModule, ModuleWithProviders } from '@angular/core';
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';

import { IqsZonesDataService } from './services/zones.data.service';
import { IqsZonesService } from './services/zones.service';
import { zonesReducer } from './store/zones.reducer';
import { ZonesEffects } from './store/zones.effects';

@NgModule({
    imports: [
        // Angular and vendors
        StoreModule.forFeature('zones', zonesReducer),
        EffectsModule.forFeature([ZonesEffects]),
        // IqsNotificationsContainersModule
    ],
    exports: [
        // IqsNotificationsContainersModule
    ],
    providers: [
        IqsZonesDataService,
        IqsZonesService
    ]
})
export class IqsZonesModule {
    // static forRoot(): ModuleWithProviders {
    //     return {
    //         ngModule: IqsNotificationsModule,
    //         providers: [IqsNotificationsPanelService]
    //     };
    // }
}
