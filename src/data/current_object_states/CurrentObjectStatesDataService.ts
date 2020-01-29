import {
    ICurrentObjectStatesDataService,
    ICurrentObjectStatesDataProvider
} from './ICurrentObjectStatesDataService';
import { ObjectState } from '../object_states';
import { DataPage } from '../DataPage';
import { IOrganizationService } from '../../services';

class CurrentObjectStatesDataService implements ICurrentObjectStatesDataService {
    private RESOURCE: string = 'current_object_state';

    private PAGE_SIZE: number = 100;
    private PAGE_START: number = 0;
    private PAGE_TOTAL: boolean = true;

    constructor(
        private pipRest: pip.rest.IRestService,
        private pipFormat: pip.services.IFormat,
        private iqsOrganization: IOrganizationService
    ) {
        "ngInject";
    }

    public readCurrentObjectStates(successCallback?: (data: DataPage<ObjectState>) => void, errorCallback?: (error: any) => void) {
        this.pipRest.getResource(this.RESOURCE).get(
            {
                org_id: this.iqsOrganization.orgId
            },
            (data) => {
                successCallback(data);
            },
            errorCallback);
    }

    public readCurrentObjectState(object_id: string, successCallback?: (data: ObjectState) => void, errorCallback?: (error: any) => void): any {
        this.pipRest.getResource(this.RESOURCE).get(
            {
                org_id: this.iqsOrganization.orgId,
                state_id: object_id
            },
            (data: ObjectState) => {
                if (successCallback) {
                    successCallback(data);
                }
            },
            errorCallback);
    }
}


class CurrentObjectStatesDataProvider implements ICurrentObjectStatesDataProvider {
    private _service: ICurrentObjectStatesDataService;

    constructor() {
        "ngInject";
    }

    public $get(
        pipRest: pip.rest.IRestService,
        pipFormat: pip.services.IFormat,
        iqsOrganization: IOrganizationService
    ) {
        "ngInject";

        if (this._service == null) {
            this._service = new CurrentObjectStatesDataService(pipRest, pipFormat, iqsOrganization);
        }

        return this._service;
    }

}


angular
    .module('iqsCurrentObjectStates.Data', ['pipRest', 'pipServices', 'iqsCurrentObjectStates.Resource'])
    .provider('iqsCurrentObjectStatesData', CurrentObjectStatesDataProvider);