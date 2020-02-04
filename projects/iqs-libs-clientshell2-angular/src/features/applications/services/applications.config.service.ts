import { Injectable } from '@angular/core';
import merge from 'lodash/merge';

import { ApplicationConfig } from '../models/index';

export const APPLICATION_CONFIG_DEFAULT: ApplicationConfig = {
    productName: 'iQuipsys Positron',
    favoritesGroupName: 'favourites',
    defaultFavoritesIds: [
        'iqs_positron_monitoring',
        'iqs_positron_retrospective',
        'iqs_positron_schedule',
        'iqs_positron_incidents'
    ]
};

@Injectable({
    providedIn: 'root',
})
export class IqsApplicationsConfigService {
    private _config: ApplicationConfig;

    // TODO: Actually should be Partial<ApplicationConfig>, but error thrown during compile, research needed
    public constructor(config?: ApplicationConfig) {
        this._config = config ? merge(APPLICATION_CONFIG_DEFAULT, config) : APPLICATION_CONFIG_DEFAULT;
    }

    public get config(): ApplicationConfig {
        return this._config;
    }

    public get favoritesGroupName(): string {
        return this._config.favoritesGroupName;
    }

    public set favoritesGroupName(name: string) {
        if (this._config instanceof ApplicationConfig) {
            this._config.favoritesGroupName = name;
        }
    }
}
