import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { MatIconModule, MatInputModule, MatListModule } from '@angular/material';
import { TranslateModule } from '@ngx-translate/core';
import { PipSearchInputModule } from 'pip-webui2-controls';
import { PipScrollableModule } from 'pip-webui2-layouts';

import { IqsHelpPanelComponent } from './help-panel.component';
import { HelpListModule } from '../../components/help-list/help-list.module';

@NgModule({
    declarations: [IqsHelpPanelComponent],
    exports: [IqsHelpPanelComponent],
    imports: [
        // Angular and vendors
        CommonModule,
        ReactiveFormsModule,
        MatIconModule,
        MatInputModule,
        TranslateModule,
        // pip-suite2 & pip-webui2
        PipScrollableModule,
        PipSearchInputModule,
        // iqs-clients2
        HelpListModule,
    ]
})
export class IqsHelpPanelModule { }
