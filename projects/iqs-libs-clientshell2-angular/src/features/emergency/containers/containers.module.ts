import { NgModule } from '@angular/core';

import { IqsEmergencyPanelModule } from './emergency-panel/emergency-panel.module';

@NgModule({
    imports: [IqsEmergencyPanelModule],
    exports: [IqsEmergencyPanelModule]
})
export class IqsEmergencyContainersModule { }
