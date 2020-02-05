import { Injectable } from '@angular/core';
import { LocalStorageService } from 'angular-2-local-storage';
import { CookieService } from 'ngx-cookie-service';

import { SessionConfig, ISessionConfigLsKeys, defaultSessionConfig } from '../models/index';
import { IqsConfigService } from '../../shell/services/config.service';

@Injectable({
    providedIn: 'root',
})
export class IqsSessionConfigService {

    public constructor(
        private iqsConfig: IqsConfigService,
        private localStorage: LocalStorageService,
        private cookies: CookieService
    ) {
        const lsServerUrlKey = this.iqsConfig.get('session.lsKeys.serverUrl', defaultSessionConfig.lsKeys);
        this.iqsConfig.config.session.serverUrl = this.localStorage.get(lsServerUrlKey)
            || this.cookies.get(lsServerUrlKey) || this.iqsConfig.config.session.serverUrl;
        this.localStorage.set(lsServerUrlKey, this.iqsConfig.get('session.serverUrl'));
    }

    public getConfig(): SessionConfig {
        return this.iqsConfig.config.session;
    }

    public get autorizedUrl(): string {
        return this.iqsConfig.get('session.autorizedUrl');
    }

    public set autorizedUrl(val: string) {
        this.iqsConfig.config.session.autorizedUrl = val;
    }

    public get unautorizedUrl(): string {
        return this.iqsConfig.get('session.unautorizedUrl');
    }

    public set unautorizedUrl(val: string) {
        this.iqsConfig.config.session.unautorizedUrl = val;
    }

    public get serverUrl(): string {
        return this.iqsConfig.get('session.serverUrl');
    }

    public set serverUrl(val: string) {
        this.iqsConfig.config.session.serverUrl = val;
    }

    public get lsKeys(): ISessionConfigLsKeys {
        return this.iqsConfig.get('session.lsKeys');
    }
}
