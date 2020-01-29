import { ISignalsDataService, ISignalsDataProvider } from './ISignalsDataService';
import { Signal } from './Signal';
import { DataPage } from '../DataPage';
import { IOrganizationService } from '../../services';

class SignalsDataService implements ISignalsDataService {
    private RESOURCE: string = 'signals';

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

    public readSignals(params: any, successCallback?: (data: DataPage<Signal>) => void, errorCallback?: (error: any) => void): angular.IPromise<any> {
        params = params || {};
        params.org_id = params.org_id ? params.org_id : this.iqsOrganization.orgId;
        
        return this.pipRest.getResource(this.RESOURCE).get(
            params,
            (data: DataPage<Signal>) => {
                if (params.type) {
                    if (successCallback) {
                        successCallback(data);
                    }
                }
                if (successCallback) {
                    successCallback(data);
                }
            },
            errorCallback);
    }

    public saveSignal(data: Signal, successCallback?: (data: Signal) => void, errorCallback?: (error: any) => void) {
        data.org_id = data.org_id ? data.org_id : this.iqsOrganization.orgId;
        this.pipRest.getResource(this.RESOURCE).save(
            {
                org_id: this.iqsOrganization.orgId
            },
            data,
            (item: Signal) => {
                if (successCallback) {
                    successCallback(item);
                }

                return item;
            }, errorCallback);
    }

    public deleteSignal(id: string, successCallback?: (data: any) => void, errorCallback?: (error: any) => void) {
        this.pipRest.getResource(this.RESOURCE).delete(
            {
                signal_id: id,
                org_id: this.iqsOrganization.orgId
            },
            null, (data) => {
                if (successCallback) {
                    successCallback(data);
                }

                return data;
            }, errorCallback)
    }

    public lockSignal(params: any, successCallback?: (data?: any) => void, errorCallback?: (error?: any) => void): void {
        params = params || {};
        params.org_id = params.org_id ? params.org_id : this.iqsOrganization.orgId;

        let url: string = this.pipRest.serverUrl + '/api/v1/organizations/' + this.iqsOrganization.orgId + '/signals/' + params.signal_id + '/lock'

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

    public closeSignal(params: any, successCallback?: (data?: any) => void, errorCallback?: (error?: any) => void): void {
        params = params || {};
        params.org_id = params.org_id ? params.org_id : this.iqsOrganization.orgId;

        let url: string = this.pipRest.serverUrl + '/api/v1/organizations/' + this.iqsOrganization.orgId + '/signals/' + params.signal_id + '/close'

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

}

class SignalsDataProvider implements ISignalsDataProvider {
    private _service: ISignalsDataService;

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
            this._service = new SignalsDataService(pipRest, iqsOrganization, $http);
        }

        return this._service;
    }

}


angular
    .module('iqsSignals.Data', ['pipRest', 'pipServices'])
    .provider('iqsSignalsData', SignalsDataProvider);