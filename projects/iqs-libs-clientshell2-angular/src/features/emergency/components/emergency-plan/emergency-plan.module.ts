import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FlexLayoutModule } from '@angular/flex-layout';
import { MatListModule, MatIconModule, MatButtonModule } from '@angular/material';
import { TranslateModule } from '@ngx-translate/core';

import { EmergencyPlanComponent } from './emergency-plan.component';

@NgModule({
    declarations: [EmergencyPlanComponent],
    exports: [EmergencyPlanComponent],
    imports: [
        // Angular and vendors
        CommonModule,
        FlexLayoutModule,
        MatButtonModule,
        MatIconModule,
        MatListModule,
        TranslateModule
    ]
})
export class EmergencyPlanModule { }
