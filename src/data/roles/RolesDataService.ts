import {
    IRolesDataService,
    IRolesDataProvider
} from './IRolesDataService';
import { IOrganizationService } from '../../services';

class RolesDataService implements IRolesDataService {
    private RESOURCE: string = 'roles';
    private RESOURCE_GRANT: string = 'roles_grant';
    private RESOURCE_REVOKE: string = 'roles_revoke';

    constructor(
        private $http: ng.IHttpService,
        private pipRest: pip.rest.IRestService,
        private iqsOrganization: IOrganizationService,
        private pipIdentity: pip.services.IIdentityService
    ) {
        "ngInject";
    }

    public readRoles(params: any, successCallback?: (data: string[]) => void, errorCallback?: (error: any) => void): angular.IPromise<any> {
        params = params || {};
        params.org_id = params.org_id ? params.org_id : this.iqsOrganization.orgId;
        if (params.user_id && this.pipIdentity.identity) {
            params.user_id = this.pipIdentity.identity.user.id
        }

        return this.pipRest.getResource(this.RESOURCE).query(params, params, successCallback, errorCallback);
    }

    public deleteRole(params: any, successCallback?: (data: string[]) => void, errorCallback?: (error: any) => void): void {
        params = params || {};
        params.org_id = params.org_id ? params.org_id : this.iqsOrganization.orgId;

        let url: string = this.pipRest.serverUrl + '/api/v1/organizations/' + params.org_id + '/roles';
        this.$http({
            method: "DELETE",
            url: url,
            params: {
                role: params.role,
                user_id: params.user_id
            }
        })
            .success((data: any) => {
                if (successCallback) successCallback(data);
            })
            .error((error: any) => {
                if (errorCallback) errorCallback(error);
            });
        // this.pipRest.getResource(this.RESOURCE).delete(params, null, successCallback, errorCallback);
    }

    public createRole(params: any, data: any, successCallback?: (data: string[]) => void, errorCallback?: (error: any) => void): void {
        params = params || {};
        params.org_id = params.org_id ? params.org_id : this.iqsOrganization.orgId;
        let a: ng.IRequestConfig
        let url: string = this.pipRest.serverUrl + '/api/v1/organizations/' + params.org_id + '/roles';
        this.$http({
            method: "POST",
            url: url,
            params: {
                role: data,
                user_id: params.user_id
            }

        })
            .success((data: any) => {
                if (successCallback) successCallback(data);
            })
            .error((error: any) => {
                if (errorCallback) errorCallback(error);
            });
        // this.pipRest.getResource(this.RESOURCE).save(params, data, successCallback, errorCallback);
    }

    public grantRoles(id: string, body: string[], successCallback?: (data: string[]) => void, errorCallback?: (error: any) => void) {
        let url: string = this.pipRest.serverUrl + '/api/v1/roles/' + id + '/grant';
        return this.$http({
            method: "POST",
            url: url,
            data: body,
        })
            .success((data: any) => {
                if (successCallback) successCallback(data);
            })
            .error((error: any) => {
                if (errorCallback) errorCallback(error);
            });
        // return this.pipRest.getResource(this.RESOURCE_GRANT).save({ user_id: id }, body, (data) => {
        //     if (successCallback)
        //         successCallback(data);
        // }, errorCallback);
    }


    public revokeRoles(id: string, body: string[], successCallback?: (data: string[]) => void, errorCallback?: (error: any) => void) {
        let url: string = this.pipRest.serverUrl + '/api/v1/roles/' + id + '/revoke';
        return this.$http({
            method: "POST",
            url: url,
            data: body,
        })
            .success((data: any) => {
                if (successCallback) successCallback(data);
            })
            .error((error: any) => {
                if (errorCallback) errorCallback(error);
            });
        // return this.pipRest.getResource(this.RESOURCE_REVOKE).save({ user_id: id }, body, (data) => {
        //     if (successCallback)
        //         successCallback(data);
        // }, errorCallback);
    }


}


class RolesDataProvider implements IRolesDataProvider {
    private _service: IRolesDataService;

    constructor() {
        "ngInject";
    }

    public $get(
        $http: ng.IHttpService,
        pipRest: pip.rest.IRestService,
        iqsOrganization: IOrganizationService,
        pipIdentity: pip.services.IIdentityService
    ) {
        "ngInject";

        if (this._service == null) {
            this._service = new RolesDataService($http, pipRest, iqsOrganization, pipIdentity);
        }
        return this._service;
    }

}


angular
    .module('iqsRoles.Data', ['pipRest', 'pipServices', 'iqsRoles.Resource'])
    .provider('iqsRolesData', RolesDataProvider);