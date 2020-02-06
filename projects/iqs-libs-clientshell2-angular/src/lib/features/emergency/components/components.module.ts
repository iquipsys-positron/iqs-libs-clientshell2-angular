import { NgModule } from '@angular/core';

import { EmergencyPlanModule } from './emergency-plan/emergency-plan.module';

@NgModule({
  imports: [
    // application modules
    EmergencyPlanModule
  ],
  exports: [EmergencyPlanModule]
})
export class IqsEmergencyComponentsModule { }
