import {
    ObjectConfigs,
    IObjectConfigsService
} from '.';

class ObjectConfigsService implements IObjectConfigsService {
    public id: string;
    public type: string;
    public section: number;
    public constructor() { }

    public get(): ObjectConfigs {
        return {
            id: this.id,
            type: this.type,
            section: this.section
        };
    }

    public clean(): void {
        this.id = null;
        this.type = null;
        this.section = null;
    }

}

angular
    .module('iqsObjectConfigs', [])
    .service('iqsObjectConfigs', ObjectConfigsService);