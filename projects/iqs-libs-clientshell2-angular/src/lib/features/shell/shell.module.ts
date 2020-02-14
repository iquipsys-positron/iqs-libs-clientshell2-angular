import { HttpClientModule } from '@angular/common/http';
import { ModuleWithProviders } from '@angular/compiler/src/core';
import { NgModule, Injector } from '@angular/core';
import { EffectsModule } from '@ngrx/effects';
import { StoreModule } from '@ngrx/store';
import { TranslateModule } from '@ngx-translate/core';
import { LocalStorageModule } from 'angular-2-local-storage';
import { merge } from 'lodash';
import { CookieService } from 'ngx-cookie-service';
import { PipMediaModule, PipRightnavModule, PipSidenavModule } from 'pip-webui2-layouts';
import { PipNavModule } from 'pip-webui2-nav';
import { PipThemesModule, THEMES_CONFIG, DEFAULT_THEMES_CONFIG, ThemesConfig } from 'pip-webui2-themes';

import { IqsShellRoutingModule } from './shell-routing.module';
import { IqsShellComponentsModule } from './components/index';
import { IqsShellContainerModule } from './containers/index';
import { IqsConfigService } from './services/config.service';
import { IqsShellService } from './services/shell.service';
import { ApplicationConfig, IqsApplicationsConfigService } from '../applications/index';
import { AuthGuard, IqsSessionModule, IqsSessionConfigService } from '../session/index';
import { ShellModuleConfig, SHELL_MODULE_CONFIG, SHELL_RUNTIME_CONFIG, SHELL_MERGED_CONFIG } from './tokens';
import { SessionAuthInterceptorProvider } from '../session/http-interceptors/auth.interceptor';
import { IqsSettingsModule } from '../settings/index';
import { IqsOrganizationsModule } from '../organizations/index';
import { WINDOW_PROVIDERS } from '../../common/services/window.service';

export function createShellMergedConfig(functionConfig: ShellModuleConfig, injector: Injector) {
    const providedConfig = injector.get(SHELL_RUNTIME_CONFIG, {});
    return merge({}, providedConfig, functionConfig);
}

// @dynamic
@NgModule({
    imports: [
        // Angular and vendors
        EffectsModule.forRoot([]),
        HttpClientModule,
        LocalStorageModule.withConfig({
            prefix: 'iqs-clients2',
            storageType: 'localStorage'
        }),
        StoreModule.forRoot({}),
        TranslateModule.forRoot(),
        // pip-suite2 & pip-webui2
        PipNavModule.forRoot(),
        PipMediaModule.forRoot(),
        PipRightnavModule.forRoot(),
        PipSidenavModule.forRoot(),
        PipThemesModule.forRoot(),
        // iqs-clients2
        IqsShellRoutingModule,
        IqsShellComponentsModule,
        IqsShellContainerModule,
        IqsSessionModule,
        IqsSettingsModule,
        IqsOrganizationsModule,
    ]
})
export class IqsShellModule {
    static forRoot(configs?: ShellModuleConfig): ModuleWithProviders {
        return {
            ngModule: IqsShellModule,
            providers: [
                AuthGuard,
                CookieService,
                {
                    provide: SHELL_MODULE_CONFIG,
                    useValue: configs || {}
                },
                {
                    provide: SHELL_MERGED_CONFIG,
                    useFactory: createShellMergedConfig,
                    deps: [SHELL_MODULE_CONFIG, Injector]
                },
                {
                    provide: THEMES_CONFIG,
                    useValue: <ThemesConfig>{
                        defaultThemeName: DEFAULT_THEMES_CONFIG.defaultThemeName,
                        themes: DEFAULT_THEMES_CONFIG.themes,
                        lsKey: 'ngx-theme'
                    }
                },
                IqsSessionConfigService,
                SessionAuthInterceptorProvider,
                IqsConfigService,
                IqsApplicationsConfigService,
                IqsShellService,
                WINDOW_PROVIDERS
            ]
        };
    }
}
