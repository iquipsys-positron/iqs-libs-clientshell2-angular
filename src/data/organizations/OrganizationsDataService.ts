import {
    IOrganizationsDataService,
    IOrganizationsDataProvider
} from './IOrganizationsDataService';
import {
    Organization
} from './Organization';
import {
    DataPage
} from '../DataPage';

class OrganizationsDataService implements IOrganizationsDataService {
    private RESOURCE: string = 'organizations';
    private RESOURCE_GENERATE: string = 'organizations_generate';
    private RESOURCE_REMOVE: string = 'organizations_remove';
    private RESOURCE_DEMO_CONNECT: string = 'demo_connect';
    private RESOURCE_ADD_TO_CLUSTER: string = 'organizations_add_to_cluster';

    private PAGE_SIZE: number = 100;
    private PAGE_START: number = 0;
    private PAGE_TOTAL: boolean = true;

    constructor(
        private pipRest: pip.rest.IRestService,
        private pipFormat: pip.services.IFormat,
        private $http: ng.IHttpService
    ) {
        "ngInject";
    }

    public readOrganizations(params, successCallback?: (data: DataPage<Organization>) => void, errorCallback?: (error: any) => void) {
        return this.pipRest.getResource(this.RESOURCE).get(null, successCallback, errorCallback);
    }

    public readOrganization(id: string, successCallback?: (data: Organization) => void, errorCallback?: (error: any) => void) {
        return this.pipRest.getResource(this.RESOURCE).get({
            id: id
        }, (data: DataPage<Organization>) => {
            if (successCallback) successCallback(data.data[0] || null);
        }, errorCallback);
    }

    public generateCode(id: string, successCallback?: (data) => void, errorCallback?: (error: any) => void) {
        this.pipRest.getResource(this.RESOURCE_GENERATE).call({
            org_id: id
        }, {
                org_id: id
            }, (data: any) => {
                if (successCallback) successCallback(data || null);
            }, errorCallback);
    }

    public findOrganizationByCode(code: string, successCallback?: (data) => void, errorCallback?: (error: any) => void) {
        this.pipRest.getResource('organizations_find_by_code').get(
            { code: code },
            (data: Organization) => {
                if (successCallback) successCallback(data || null);
            },
            errorCallback);
    }

    public validateCode(code: string, successCallback?: (data) => void, errorCallback?: (error: any) => void) {
        let url: string = this.pipRest.serverUrl + '/api/v1/organizations/validate_code';
        var params = { code: code };

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

    public updateOrganization(id: string, data: Organization, successCallback?: (data: Organization) => void, errorCallback?: (error: any) => void) {
        this.pipRest.getResource(this.RESOURCE).update({ org_id: id }, data, (item: Organization) => {
            if (successCallback) {
                successCallback(item);
            }
        }, errorCallback);
    }

    public saveOrganization(data: Organization, successCallback?: (data: Organization) => void, errorCallback?: (error: any) => void) {
        this.pipRest.getResource(this.RESOURCE).save(data, (item: Organization) => {
            if (successCallback) {
                successCallback(item);
            }
        }, errorCallback);

    }


    public removeOrganization(id: string, successCallback?: (data: Organization) => void, errorCallback?: (error: any) => void) {
        this.pipRest.getResource(this.RESOURCE_REMOVE).save({ org_id: id }, { org_id: id }, (item: Organization) => {
            if (successCallback) {
                successCallback(item);
            }
        }, errorCallback);

    }

    public demoConnect(params: any, successCallback?: (data: any) => void, errorCallback?: (error: any) => void): void {
        this.pipRest.getResource(this.RESOURCE_DEMO_CONNECT).save(params, (data: any) => {
            if (successCallback) {
                successCallback(data);
            }
        }, errorCallback);

    }

    public deleteOrganization(id: string, successCallback?: (data: any) => void, errorCallback?: (error: any) => void) {
        this.pipRest.getResource(this.RESOURCE).delete({ org_id: id }, null, (item) => {
            if (successCallback) {
                successCallback(item);
            }
        }, errorCallback)
    }

    public addToCluster(id: string, successCallback?: (data: any) => void, errorCallback?: (error: any) => void) {
        this.pipRest.getResource(this.RESOURCE_ADD_TO_CLUSTER).save({ org_id: id}, successCallback, errorCallback);
    }
}


class OrganizationsDataProvider implements IOrganizationsDataProvider {
    private _service: IOrganizationsDataService;

    constructor() {
        "ngInject";
    }

    public $get(
        pipRest: pip.rest.IRestService,
        pipFormat: pip.services.IFormat,
        $http: ng.IHttpService
    ) {
        "ngInject";

        if (this._service == null) {
            this._service = new OrganizationsDataService(pipRest, pipFormat, $http);
        }

        return this._service;
    }

}


angular
    .module('iqsOrganizations.Data', ['pipServices', 'iqsOrganizations.Resource'])
    .provider('iqsOrganizationsData', OrganizationsDataProvider);