import { IncidentsUpdateType, IIncidentsConfigService } from './IIncidentsConfigService';

class IncidentsConfigService implements IIncidentsConfigService {
    private _updateType: IncidentsUpdateType = IncidentsUpdateType.Counter;

    public constructor() { }

    public get updateType(): IncidentsUpdateType {
        return this._updateType;
    }

    public set updateType(type: IncidentsUpdateType) {
        this._updateType = type;
    }
}

angular
    .module('iqsIncidentsConfig', [])
    .service('iqsIncidentsConfig', IncidentsConfigService);