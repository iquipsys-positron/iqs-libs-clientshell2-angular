import { Injectable, Inject } from '@angular/core';
import { LocalStorageService } from 'angular-2-local-storage';
import cloneDeep from 'lodash/cloneDeep';
import merge from 'lodash/merge';
import { CookieService } from 'ngx-cookie-service';

import { SessionConfig, SESSION_CONFIG, ISessionConfigLsKeys } from '../models/index';

export const DEFAULT_SESSION_CONFIG: SessionConfig = {
    autorizedUrl: '/home/index.html',
    unautorizedUrl: '/entry/index.html#/signin',
    serverUrl: '/',
    lsKeys: {
        session: 'session',
        serverUrl: 'serverUrl'
    }
};

@Injectable({
    providedIn: 'root',
})
export class IqsSessionConfigService {
    private _config: SessionConfig;

    // TODO: Actually should be Partial<SessionConfig>, but error thrown during compile, research needed
    public constructor(
        @Inject(SESSION_CONFIG) private config: SessionConfig,
        private localStorage: LocalStorageService,
        private cookies: CookieService,
        // config?: SessionConfig,
    ) {
        this._config = cloneDeep(DEFAULT_SESSION_CONFIG);
        const lsServerUrlKey = this.config && this.config.lsKeys && this.config.lsKeys.serverUrl
            ? this.config.lsKeys.serverUrl
            : this._config.lsKeys.serverUrl;
        this._config.serverUrl = this.localStorage.get(lsServerUrlKey) || this.cookies.get(lsServerUrlKey) || this._config.serverUrl;
        if (this.config) {
            this._config = merge(this._config, config);
        }
        this.localStorage.set(lsServerUrlKey, this._config.serverUrl);
    }

    public getConfig(): SessionConfig {
        return this._config;
    }

    public get autorizedUrl(): string {
        return this._config && this._config.autorizedUrl;
    }

    public set autorizedUrl(val: string) {
        this._config.autorizedUrl = val;
    }

    public get unautorizedUrl(): string {
        return this._config && this._config.unautorizedUrl;
    }

    public set unautorizedUrl(val: string) {
        this._config.unautorizedUrl = val;
    }

    public get serverUrl(): string {
        return this._config && this._config.serverUrl;
    }

    public set serverUrl(val: string) {
        this._config.serverUrl = val;
    }

    public get lsKeys(): ISessionConfigLsKeys {
        return this._config && this._config.lsKeys;
    }
}
