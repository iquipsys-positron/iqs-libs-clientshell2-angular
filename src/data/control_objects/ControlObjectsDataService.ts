import {
    IControlObjectsDataService,
    IControlObjectsDataProvider
} from './IControlObjectsDataService';
import { ControlObject } from './ControlObject';
import { DataPage } from '../DataPage';
import { IOrganizationService } from '../../services';

class ControlObjectsDataSerrvice implements IControlObjectsDataService {
    private RESOURCE: string = 'control_objects';

    private PAGE_SIZE: number = 100;
    private PAGE_START: number = 0;
    private PAGE_TOTAL: boolean = true;

    constructor(private pipRest: pip.rest.IRestService, private pipFormat: pip.services.IFormat,
        private iqsOrganization: IOrganizationService) {
        "ngInject";
    }

    public readControlObjects(params: any, successCallback?: (data: DataPage<ControlObject>) => void, errorCallback?: (error: any) => void): any {
        params = params || {};
        params.org_id = params.org_id ? params.org_id : this.iqsOrganization.orgId;

        this.pipRest.getResource(this.RESOURCE).get(
            params,
            (items: DataPage<ControlObject>) => {
                if (params.type) {
                    if (successCallback) {
                        successCallback(items);
                    }
                }

                if (successCallback) {
                    successCallback(items);
                }

            },
            errorCallback);


    }

    // public readControlObject(id: string, successCallback?: (data: ControlObject) => void, errorCallback?: (error: any) => void): angular.IPromise<any> {
    // return this.pipRest.getResource(this.RESOURCE).get({
    //     event_id: id
    // }, successCallback, errorCallback);
    // }        
    public readControlObject(id: string, successCallback?: (data: ControlObject) => void, errorCallback?: (error: any) => void): any {

    }

    public updateControlObject(id: string, data: ControlObject, successCallback?: (data: ControlObject) => void, errorCallback?: (error: any) => void) {
        data.org_id = data.org_id ? data.org_id : this.iqsOrganization.orgId;
        this.pipRest.getResource(this.RESOURCE).update(
            {
                object_id: id,
                org_id: data.org_id
            },
            data, (item: ControlObject) => {
                if (successCallback) {
                    successCallback(item);
                }

            }, errorCallback);

    }

    public saveControlObject(data: ControlObject, successCallback?: (data: ControlObject) => void, errorCallback?: (error: any) => void) {
        data.org_id = data.org_id ? data.org_id : this.iqsOrganization.orgId;
        this.pipRest.getResource(this.RESOURCE).save(
            {
                org_id: data.org_id
            },
            data,
            (item: ControlObject) => {
                if (successCallback) {
                    successCallback(item);
                }

            },
            errorCallback);

    }

    public deleteControlObject(id: string, successCallback?: (data: any) => void, errorCallback?: (error: any) => void) {
        this.pipRest.getResource(this.RESOURCE).delete(
            {
                object_id: id,
                org_id: this.iqsOrganization.orgId
            },
            null, (item) => {
                if (successCallback) {
                    successCallback(item);
                }

                return item;
            },
            errorCallback)
    }
}

class ControlObjectsDataProvider implements IControlObjectsDataProvider {
    private _service: IControlObjectsDataService;

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
            this._service = new ControlObjectsDataSerrvice(pipRest, pipFormat, iqsOrganization);
        }

        return this._service;
    }

}


angular
    .module('iqsControlObjects.Data', ['pipRest', 'pipServices', 'iqsControlObjects.Resource'])
    .provider('iqsControlObjectsData', ControlObjectsDataProvider);