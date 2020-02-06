import { Injectable, Inject } from '@angular/core';
import { defaultsDeep, get } from 'lodash';

import { SHELL_MERGED_CONFIG, ShellModuleConfig, defaultShellModuleConfig } from '../tokens';

@Injectable()
export class IqsConfigService {
    constructor(@Inject(SHELL_MERGED_CONFIG) private _config: ShellModuleConfig) { }

    public get config(): ShellModuleConfig { return defaultsDeep(this._config, defaultShellModuleConfig); }

    public get(key: string | string[], defaultValue?: any): any {
        return get(this.config, key, defaultValue);
    }
}
