import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FlexLayoutModule } from '@angular/flex-layout';
import { MatButtonModule, MatListModule, MatIconModule } from '@angular/material';
import { TranslateModule } from '@ngx-translate/core';
import { MomentModule } from 'ngx-moment';
import { PipEmptyStateModule } from 'pip-webui2-controls';

import { IqsNotificationPanelComponent } from './notification-panel.component';

@NgModule({
    declarations: [IqsNotificationPanelComponent],
    exports: [IqsNotificationPanelComponent],
    imports: [
        // Angular and vendors
        CommonModule,
        FlexLayoutModule,
        MatButtonModule,
        MatListModule,
        MatIconModule,
        MomentModule,
        TranslateModule,
        // pip-suite2 & pip-webui2
        PipEmptyStateModule
    ]
})
export class IqsNotificationPanelModule { }
