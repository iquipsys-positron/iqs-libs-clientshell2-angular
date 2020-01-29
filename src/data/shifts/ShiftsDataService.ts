import {
    IShiftsDataService,
    IShiftsDataProvider
} from './IShiftsDataService';
import {
    Shift
} from './Shift';
import { DataPage } from '../DataPage';
import { IOrganizationService } from '../../services';

class ShiftsDataService implements IShiftsDataService {
    private RESOURCE: string = 'shifts';

    private PAGE_SIZE: number = 100;
    private PAGE_START: number = 0;
    private PAGE_TOTAL: boolean = true;

    constructor(
        private pipRest: pip.rest.IRestService,
        private iqsOrganization: IOrganizationService) {
        "ngInject";
    }

    public readShifts(params: any, successCallback?: (data: DataPage<Shift>) => void, errorCallback?: (error: any) => void): any {
        params.org_id = params.org_id ? params.org_id : this.iqsOrganization.orgId;

        this.pipRest.getResource(this.RESOURCE).get(
            params,
            (items: DataPage<Shift>) => {
                if (successCallback) {
                    successCallback(items);
                }
            },
            errorCallback);
    }

    // public readShift(id: string, successCallback?: (data: Shift) => void, errorCallback?: (error: any) => void): angular.IPromise<any> {
    // return this.pipRest.getResource(this.RESOURCE).get({
    //     event_id: id
    // }, successCallback, errorCallback);
    // }        
    public readShift(id: string, successCallback?: (data: Shift) => void, errorCallback?: (error: any) => void): any {

    }

    public updateShift(id: string, data: Shift, successCallback?: (data: Shift) => void, errorCallback?: (error: any) => void) {
        data.org_id = this.iqsOrganization.orgId;
        this.pipRest.getResource(this.RESOURCE).update(
            { 
                shift_id: id,
                org_id: this.iqsOrganization.orgId 
            }, 
            data, 
            (item: Shift) => {
            if (successCallback) {
                successCallback(item);
            }

            return item;
        }, 
        errorCallback);

    }

    public saveShift(data: Shift, successCallback?: (data: Shift) => void, errorCallback?: (error: any) => void) {
        data.org_id = this.iqsOrganization.orgId;
        this.pipRest.getResource(this.RESOURCE).save(
            {
                org_id: this.iqsOrganization.orgId
            },
            data, 
            (item: Shift) => {
            if (successCallback) {
                successCallback(item);
            }
        }, 
        errorCallback);
    }

    public deleteShift(id: string, successCallback?: (data: any) => void, errorCallback?: (error: any) => void) {
        this.pipRest.getResource(this.RESOURCE).delete(
            { 
                shift_id: id,
                org_id: this.iqsOrganization.orgId
            }, 
            null, (item) => {
            if (successCallback) {
                successCallback(item);
            }
        }, 
        errorCallback)
    }
}

class ShiftsDataProvider implements IShiftsDataProvider {
    private _service: IShiftsDataService;

    constructor() {
        "ngInject";
    }

    public $get(
        pipRest: pip.rest.IRestService,
        iqsOrganization: IOrganizationService
    ) {
        "ngInject";

        if (this._service == null) {
            this._service = new ShiftsDataService(pipRest, iqsOrganization);
        }

        return this._service;
    }

}


angular
    .module('iqsShifts.Data', ['pipRest', 'pipServices', 'iqsShifts.Resource'])
    .provider('iqsShiftsData', ShiftsDataProvider);