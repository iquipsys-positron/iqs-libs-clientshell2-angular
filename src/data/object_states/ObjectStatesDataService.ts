import {
    IObjectStatesDataService,
    IObjectStatesDataProvider
} from './IObjectStatesDataService';
import { ObjectState } from './ObjectState';
import { DataPage } from '../DataPage';
import { IOrganizationService } from '../../services';

class ObjectStatesDataService implements IObjectStatesDataService {
    private RESOURCE: string = 'object_state';

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

    public readObjectStates(to: string, successCallback?: (data: DataPage<ObjectState>) => void, errorCallback?: (error: any) => void) {
        this.pipRest.getResource(this.RESOURCE).query(
            {
                org_id: this.iqsOrganization.orgId,
                time: to
            },
            (data) => {
                successCallback({ data: data, total: null });
            },
            errorCallback);
    }

    // public readObjectState(id: string, successCallback?: (data: ObjectState) => void, errorCallback?: (error: any) => void): angular.IPromise<any> {
    //      this.pipRest.getResource(this.RESOURCE).get({
    //          object_id: id
    //      }, successCallback, errorCallback);
    // }        
    public readObjectState(object_id: string, successCallback?: (data: ObjectState) => void, errorCallback?: (error: any) => void): any {
        this.pipRest.getResource(this.RESOURCE).get(
            {
                org_id: this.iqsOrganization.orgId
            },
            (data: DataPage<ObjectState>) => {
                if (successCallback) {
                    successCallback(data.data[Number(object_id)]);
                }
            }, errorCallback);
    }
}


class ObjectStatesDataProvider implements IObjectStatesDataProvider {
    private _service: IObjectStatesDataService;

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
            this._service = new ObjectStatesDataService(pipRest, pipFormat, iqsOrganization);
        }

        return this._service;
    }
}

angular
    .module('iqsObjectStates.Data', ['pipRest', 'pipServices', 'iqsObjectStates.Resource'])
    .provider('iqsObjectStatesData', ObjectStatesDataProvider);