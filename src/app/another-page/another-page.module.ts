import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatButtonModule } from '@angular/material';
import { IqsAskDialogModule, IqsAskDialogComponent } from 'iqs-libs-clientshell2-angular';

import { AnotherPageComponent } from './another-page.component';

@NgModule({
    declarations: [AnotherPageComponent],
    entryComponents: [IqsAskDialogComponent],
    imports: [
        // Angular and vendors
        CommonModule,
        MatButtonModule,
        RouterModule,
        // iqs-clients2
        IqsAskDialogModule,
    ]
})
export class AnotherPageModule { }
