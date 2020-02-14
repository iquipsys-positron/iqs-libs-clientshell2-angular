import { Injectable } from '@angular/core';
import { get } from 'lodash';

import { ApplicationConfig } from '../models/index';
import { IqsConfigService } from '../../shell/services/config.service';

@Injectable({
    providedIn: 'root',
})
export class IqsApplicationsConfigService {

    public constructor(
        private configService: IqsConfigService
    ) { }

    public get config(): ApplicationConfig {
        return this.configService.config.application;
    }

    public get id(): string {
        return get(this.config, 'id');
    }

    public set id(id: string) {
        this.configService.config.application.id = id;
    }

    public get favoritesGroupName(): string {
        return get(this.config, 'favoritesGroupName');
    }

    public set favoritesGroupName(name: string) {
        this.configService.config.application.favoritesGroupName = name;
    }
}
