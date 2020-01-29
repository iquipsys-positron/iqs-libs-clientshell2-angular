import {
    IDevicesDataService,
    IDevicesDataProvider
} from './IDevicesDataService';
import {
    Device,
    DeviceType
} from './';
import { DataPage } from '../DataPage';
import { IOrganizationService } from '../../services';

class DevicesDataService implements IDevicesDataService {
    private RESOURCE: string = 'devices';
    private RESOURCE_PING: string = 'ping_devices';

    private PAGE_SIZE: number = 100;
    private PAGE_START: number = 0;
    private PAGE_TOTAL: boolean = true;

    constructor(
        private pipRest: pip.rest.IRestService,
        private iqsOrganization: IOrganizationService,
        private $http: ng.IHttpService
    ) {
        "ngInject";
    }

    public readDevices(params: any, successCallback?: (data: DataPage<Device>) => void, errorCallback?: (error: any) => void): any {
        params.org_id = params.org_id ? params.org_id : this.iqsOrganization.orgId;
        this.pipRest.getResource(this.RESOURCE).get(
            params,
            (items: DataPage<Device>) => {
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

    public readDevice(params: any, successCallback?: (data: Device) => void, errorCallback?: (error: any) => void): angular.IPromise<any> {
        params.org_id = params.org_id ? params.org_id : this.iqsOrganization.orgId;

        return this.pipRest.getResource(this.RESOURCE).get(params, successCallback, errorCallback);
    }

    public updateDevice(id: string, data: Device, successCallback?: (data: Device) => void, errorCallback?: (error: any) => void) {
        data.org_id = data.org_id ? data.org_id : this.iqsOrganization.orgId;
        this.pipRest.getResource(this.RESOURCE).update(
            {
                device_id: id,
                org_id: data.org_id
            },
            data,
            (item: Device) => {
                if (successCallback) {
                    successCallback(item);
                }

                return item;
            },
            errorCallback);

    }

    public saveDevice(data: Device, successCallback?: (data: Device) => void, errorCallback?: (error: any) => void) {
        data.org_id = data.org_id ? data.org_id : this.iqsOrganization.orgId;
        this.pipRest.getResource(this.RESOURCE).save(
            {
                org_id: data.org_id
            },
            data,
            (item: Device) => {
                if (successCallback) {
                    successCallback(item);
                }

                return item;
            }, errorCallback);
    }

    public deleteDevice(id: string, successCallback?: (data: any) => void, errorCallback?: (error: any) => void) {
        this.pipRest.getResource(this.RESOURCE).delete(
            {
                device_id: id,
                org_id: this.iqsOrganization.orgId
            },
            null, (item) => {
                if (successCallback) {
                    successCallback(item);
                }

                return item;
            }, errorCallback)
    }

    public verifyDeviceUdi(params: any, successCallback?: (data?: any) => void, errorCallback?: (error?: any) => void): void {
        params = params ? params : {};
        params.org_id = params.org_id ? params.org_id : this.iqsOrganization.orgId;
        let url: string = this.pipRest.serverUrl + '/api/v1/organizations/' + params.org_id + '/devices/validate_udi';

        this.$http({
            method: "POST",
            url: url,
            params
        })
            .success((data: any) => {
                if (successCallback) successCallback(data);
            })
            .error((error: any) => {
                if (errorCallback) errorCallback(error);
            });
    }

    // public invalidateState(params, successCallback?: (data: any) => void, errorCallback?: (error: any) => void) {
    //     let url: string = this.pipRest.serverUrl + '/api/v1/organizations/' + this.iqsOrganization.orgId + '/invalidate_state';

    //     this.$http({
    //         method: "POST",
    //         url: url,
    //         params
    //     })
    //         .success((data: any) => {
    //             if (successCallback) successCallback(data);
    //         })
    //         .error((error: any) => {
    //             if (errorCallback) errorCallback(error);
    //         });
    // }

    public pingDevice(params: any, successCallback?: (data?: any) => void, errorCallback?: (error?: any) => void): void {
        params.org_id = params.org_id ? params.org_id : this.iqsOrganization.orgId;
        this.pipRest.getResource(this.RESOURCE_PING).call(
            params,
            null,
            successCallback,
            errorCallback
        );
    }
}

class DevicesDataProvider implements IDevicesDataProvider {
    private _service: IDevicesDataService;

    constructor() {
        "ngInject";
    }

    public $get(
        pipRest: pip.rest.IRestService,
        iqsOrganization: IOrganizationService,
        $http: ng.IHttpService
    ) {
        "ngInject";

        if (this._service == null) {
            this._service = new DevicesDataService(pipRest, iqsOrganization, $http);
        }

        return this._service;
    }

}


angular
    .module('iqsDevices.Data', ['pipRest', 'pipServices', 'iqsDevices.Resource'])
    .provider('iqsDevicesData', DevicesDataProvider);