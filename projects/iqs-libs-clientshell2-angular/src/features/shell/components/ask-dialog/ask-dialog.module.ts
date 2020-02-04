import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule, MatDialogModule } from '@angular/material';
import { TranslateModule } from '@ngx-translate/core';

import { IqsAskDialogComponent } from './ask-dialog.component';

@NgModule({
    declarations: [IqsAskDialogComponent],
    exports: [IqsAskDialogComponent],
    imports: [
        // Angular and vendors
        CommonModule,
        MatButtonModule,
        MatDialogModule,
        TranslateModule
    ]
})
export class IqsAskDialogModule { }
