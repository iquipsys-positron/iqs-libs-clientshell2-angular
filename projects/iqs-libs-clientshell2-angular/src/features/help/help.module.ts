import { NgModule, ModuleWithProviders } from '@angular/core';

import { HelpPanelComponentsModule } from './components/components.module';
import { IqsHelpContainersModule } from './containers/containers.module';
import { IqsHelpPanelService } from './services/help-panel.service';

@NgModule({
    imports: [
        HelpPanelComponentsModule,
        IqsHelpContainersModule
    ],
    exports: [
        HelpPanelComponentsModule,
        IqsHelpContainersModule
    ]
})
export class IqsHelpModule {
    static forRoot(): ModuleWithProviders {
        return {
            ngModule: IqsHelpModule,
            providers: [
                IqsHelpPanelService
            ]
        };
    }
}
