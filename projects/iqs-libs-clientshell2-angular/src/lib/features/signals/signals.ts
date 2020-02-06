import { NgModule, ModuleWithProviders } from '@angular/core';
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';

import { IqsSignalsDataService } from './services/signals.data.service';
import { IqsSignalsSendService } from './services/signals.send.service';

@NgModule({
    imports: [
        // Angular and vendors
        // StoreModule.forFeature('notifications', notificationsReducer),
        // EffectsModule.forFeature([NotificationsEffects]),
        // IqsNotificationsContainersModule
    ],
    exports: [
        // IqsNotificationsContainersModule
    ],
    providers: [
        // IqsControlObjectsDataService,
        // IqsNotificationsService,
        IqsSignalsDataService,
        IqsSignalsSendService
    ]
})
export class IqsSignalsModule {
    // static forRoot(): ModuleWithProviders {
    //     return {
    //         ngModule: IqsNotificationsModule,
    //         providers: [IqsNotificationsPanelService]
    //     };
    // }
}
