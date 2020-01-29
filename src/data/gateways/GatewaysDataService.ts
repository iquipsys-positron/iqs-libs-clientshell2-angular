import { IGatewaysDataService, IGatewaysDataProvider } from './IGatewaysDataService';
import { Gateway } from './Gateway';
import { DataPage } from '../DataPage';
import { IOrganizationService } from '../../services';

class GatewaysDataService implements IGatewaysDataService {
    private RESOURCE: string = 'gateways';
    private RESOURCE_PING: string = 'ping_gateways';
    private RESOURCE_STAT: string = 'stat_gateways';

    constructor(
        private pipRest: pip.rest.IRestService,
        private iqsOrganization: IOrganizationService,
        private $http: ng.IHttpService
    ) {
        "ngInject";

    }

    public readGateways(params: any, successCallback?: (data: DataPage<Gateway>) => void, errorCallback?: (error: any) => void): angular.IPromise<any> {
        params = params || {};
        params.org_id = params.org_id ? params.org_id : this.iqsOrganization.orgId;

        return this.pipRest.getResource(this.RESOURCE).page(params, successCallback, errorCallback);
    }

    public readGateway(params: any, successCallback?: (data: Gateway) => void, errorCallback?: (error: any) => void): angular.IPromise<any> {
        params = params || {};
        params.org_id = params.org_id ? params.org_id : this.iqsOrganization.orgId;

        return this.pipRest.getResource(this.RESOURCE).get(params, successCallback, errorCallback);
    }

    public createGateway(data: Gateway, successCallback?: (data: Gateway) => void, errorCallback?: (error: any) => void): void {
        data.org_id = data.org_id ? data.org_id : this.iqsOrganization.orgId;
        this.pipRest.getResource(this.RESOURCE).save(
            { org_id: data.org_id },
            data,
            successCallback,
            errorCallback
        );
    }

    public updateGateway(id: string, data: Gateway, successCallback?: (data: Gateway) => void, errorCallback?: (error: any) => void): void {
        this.pipRest.getResource(this.RESOURCE).update(
            {
                gateway_id: id,
                org_id: this.iqsOrganization.orgId
            },
            data,
            successCallback,
            errorCallback
        );
    }

    public deleteGateway(id: string, successCallback?: () => void, errorCallback?: (error: any) => void): void {
        this.pipRest.getResource(this.RESOURCE).remove(
            {
                gateway_id: id,
                org_id: this.iqsOrganization.orgId
            },
            null,
            successCallback,
            errorCallback
        );
    }

    public verifyGatewayUdi(params: any, successCallback?: (data?: any) => void, errorCallback?: (error?: any) => void): void {
        let url: string = this.pipRest.serverUrl + '/api/v1/organizations/' + this.iqsOrganization.orgId + '/gateways/validate_udi';

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

    public statsGateway(params: any, successCallback?: (data?: any) => void, errorCallback?: (error?: any) => void): void {
        this.pipRest.getResource(this.RESOURCE_STAT).call(
            {
                gateway_id: params.gateway_id,
                org_id: this.iqsOrganization.orgId
            },
            null,
            successCallback,
            errorCallback
        );
    }

    public pingGateway(params: any, successCallback?: (data?: any) => void, errorCallback?: (error?: any) => void): void {
        this.pipRest.getResource(this.RESOURCE_PING).call(
            {
                gateway_id: params.gateway_id,
                org_id: this.iqsOrganization.orgId
            },
            null,
            successCallback,
            errorCallback
        );
    }
}


class GatewaysDataProvider implements IGatewaysDataProvider {
    private _service: IGatewaysDataService;

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
            this._service = new GatewaysDataService(pipRest, iqsOrganization, $http);
        }

        return this._service;
    }

}


angular
    .module('iqsGateways.Data', ['pipRest', 'pipServices', 'iqsGateways.Resource'])
    .provider('iqsGatewaysData', GatewaysDataProvider);
