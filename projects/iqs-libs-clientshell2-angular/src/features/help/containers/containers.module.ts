import { NgModule } from '@angular/core';

import { IqsHelpPanelModule } from './help-panel/help-panel.module';

@NgModule({
    imports: [
        IqsHelpPanelModule
    ],
    exports: [
        IqsHelpPanelModule
    ]
})
export class IqsHelpContainersModule { }
