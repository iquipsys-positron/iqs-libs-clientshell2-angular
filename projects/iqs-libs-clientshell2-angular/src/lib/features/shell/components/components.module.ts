import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { IqsAskDialogModule } from './ask-dialog/ask-dialog.module';
import { IqsSidenavModule } from './sidenav/sidenav.module';
import { IqsNotFoundPageModule } from './not-found-page/not-found-page.module';

const COMPONENTS = [IqsAskDialogModule, IqsSidenavModule, IqsNotFoundPageModule];

@NgModule({
    imports: [
        CommonModule,
        ...COMPONENTS
    ],
    exports: COMPONENTS
})
export class IqsShellComponentsModule { }
