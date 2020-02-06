import { NgModule, ModuleWithProviders } from '@angular/core';
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';

import { IqsNotificationsContainersModule } from './containers/containers.module';
import { IqsNotificationsDataService } from './services/notifications.data.service';
import { IqsNotificationsService } from './services/notifications.service';
import { IqsNotificationsPanelService } from './services/notifications-panel.service';
import { notificationsReducer } from './store/notifications.reducer';
import { NotificationsEffects } from './store/index';

@NgModule({
    imports: [
        // Angular and vendors
        StoreModule.forFeature('notifications', notificationsReducer),
        EffectsModule.forFeature([NotificationsEffects]),
        IqsNotificationsContainersModule
    ],
    exports: [
        IqsNotificationsContainersModule
    ],
    providers: [
        IqsNotificationsDataService,
        IqsNotificationsService,
    ]
})
export class IqsNotificationsModule {
    static forRoot(): ModuleWithProviders {
        return {
            ngModule: IqsNotificationsModule,
            providers: [IqsNotificationsPanelService]
        };
    }
}
