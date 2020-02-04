import { HttpClientModule } from '@angular/common/http';
import { ModuleWithProviders } from '@angular/compiler/src/core';
import { NgModule } from '@angular/core';
import { EffectsModule } from '@ngrx/effects';
import { StoreModule } from '@ngrx/store';
import { TranslateModule } from '@ngx-translate/core';
import { LocalStorageModule } from 'angular-2-local-storage';
import merge from 'lodash/merge';
import { CookieService } from 'ngx-cookie-service';
import { PipMediaModule, PipRightnavModule, PipSidenavModule } from 'pip-webui2-layouts';
import { PipNavModule } from 'pip-webui2-nav';
import { PipThemesModule, THEMES_CONFIG, DEFAULT_THEMES_CONFIG, ThemesConfig } from 'pip-webui2-themes';

import { IqsShellRoutingModule } from './shell-routing.module';
import { IqsShellComponentsModule } from './components/index';
import { IqsShellContainerModule } from './containers/index';
import { SHELL_CONFIG, defaultShellConfig } from './models/index';
import { IqsShellService } from './services/shell.service';
import { ApplicationConfig, IqsApplicationsConfigService } from '../applications/index';
import { AuthGuard, IqsSessionModule, SESSION_CONFIG, IqsSessionConfigService, DEFAULT_SESSION_CONFIG } from '../session/index';
import { ShellModuleConfig, FR_CONFIGS, TEST_ENVIRONMENT } from './tokens';
import { SessionAuthInterceptorProvider } from '../session/http-interceptors/auth.interceptor';
import { IqsSettingsModule } from '../settings/index';
import { IqsOrganizationsModule } from '../organizations/index';
import { WINDOW_PROVIDERS } from '../../common/services/window.service';

const applicationConfig: ApplicationConfig = <ApplicationConfig>{
    favoritesGroupName: 'favourites'
};

export function createShellConfig(forRootConfigs: ShellModuleConfig) {
    return forRootConfigs && forRootConfigs.shell ? merge({}, defaultShellConfig, forRootConfigs.shell) : defaultShellConfig;
}

export function createApplicationConfig() {
    return new IqsApplicationsConfigService(applicationConfig);
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
                    provide: TEST_ENVIRONMENT,
                    useValue: false
                },
                {
                    provide: FR_CONFIGS,
                    useValue: configs
                },
                {
                    provide: SESSION_CONFIG,
                    useValue: configs && configs.session || DEFAULT_SESSION_CONFIG
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
                {
                    provide: IqsApplicationsConfigService,
                    useFactory: createApplicationConfig
                },
                IqsShellService,
                {
                    provide: SHELL_CONFIG,
                    useFactory: createShellConfig,
                    deps: [FR_CONFIGS]
                },
                WINDOW_PROVIDERS
            ]
        };
    }
}
