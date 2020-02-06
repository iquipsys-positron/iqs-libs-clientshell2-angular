import { NgModule } from '@angular/core';

import { IqsNotificationPanelModule } from './notification-panel/notification-panel.module';

@NgModule({
  imports: [IqsNotificationPanelModule],
  exports: [IqsNotificationPanelModule]
})
export class IqsNotificationsContainersModule { }
