import { ICurrentDeviceStatesDataService, ICurrentDeviceStatesDataProvider } from './ICurrentDeviceStatesDataService';
import { CurrentDeviceState } from './CurrentDeviceState';
import { DataPage } from '../DataPage';
import { IOrganizationService } from '../../services';

class CurrentDeviceStatesDataService implements ICurrentDeviceStatesDataService {
    private RESOURCE: string = 'curr_device_states';

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

    public readCurrentDeviceStates(successCallback?: (data: DataPage<CurrentDeviceState>) => void, errorCallback?: (error: any) => void): angular.IPromise<any> {
        return this.pipRest.getResource(this.RESOURCE).get(
            {
                org_id: this.iqsOrganization.orgId
            },
            (data: DataPage<CurrentDeviceState>) => {
                successCallback(data);
            },
            errorCallback);
    }

    public readCurrentDeviceState(id: string, successCallback ? : (data: CurrentDeviceState) => void, errorCallback ? : (error: any) => void): angular.IPromise<any> {
        return this.pipRest.getResource(this.RESOURCE).get(
            {
                org_id: this.iqsOrganization.orgId,
                state_id: id
            },
            (data: CurrentDeviceState) => {
                if (successCallback) {
                    successCallback(data);
                }
            },
            errorCallback);
    }
}


class CurrentDeviceStatesDataProvider implements ICurrentDeviceStatesDataProvider {
    private _service: ICurrentDeviceStatesDataService;

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
            this._service = new CurrentDeviceStatesDataService(pipRest, pipFormat, iqsOrganization);
        }

        return this._service;
    }

}


angular
    .module('iqsCurrentDeviceStates.Data', ['pipRest', 'pipServices', 'iqsCurrentDeviceStates.Resource'])
    .provider('iqsCurrentDeviceStatesData', CurrentDeviceStatesDataProvider);