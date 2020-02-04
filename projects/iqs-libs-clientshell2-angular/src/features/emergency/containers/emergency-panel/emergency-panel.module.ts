import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FlexLayoutModule } from '@angular/flex-layout';
import { MatIconModule, MatInputModule, MatListModule, MatButtonModule } from '@angular/material';
import { TranslateModule } from '@ngx-translate/core';
import { PipEmptyStateModule } from 'pip-webui2-controls';
import { PipScrollableModule } from 'pip-webui2-layouts';

import { EmergencyPanelComponent } from './emergency-panel.component';
import { EmergencyPlanModule } from '../../components/emergency-plan/emergency-plan.module';

@NgModule({
    declarations: [EmergencyPanelComponent],
    exports: [EmergencyPanelComponent],
    imports: [
        // Angular and vendors
        CommonModule,
        FlexLayoutModule,
        MatButtonModule,
        MatIconModule,
        MatInputModule,
        MatListModule,
        TranslateModule,
        // pip-suite2 & pip-webui2
        PipEmptyStateModule,
        PipScrollableModule,
        // iqs-clients2
        EmergencyPlanModule
    ]
})
export class IqsEmergencyPanelModule { }
