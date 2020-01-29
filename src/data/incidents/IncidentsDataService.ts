import { IIncidentsDataService, IIncidentsDataProvider } from './IIncidentsDataService';
import { Incident } from './Incident';
import { DataPage } from '../DataPage';
import { IOrganizationService } from '../../services';

class IncidentsDataService implements IIncidentsDataService {
    private RESOURCE: string = 'incidents';
    private RESOURCE_COUNT: string = 'incidents_count';

    constructor(
        private $http: ng.IHttpService,
        private pipRest: pip.rest.IRestService,
        private iqsOrganization: IOrganizationService,
    ) {
        "ngInject";

    }

    public readIncidentsCount(successCallback?: (cnt: number) => void, errorCallback?: (error: any) => void): angular.IPromise<any> {
        // return this.pipRest.getResource(this.RESOURCE_COUNT).get(
        //     {
        //         org_id: this.iqsOrganization.orgId
        //     },
        //     successCallback, errorCallback
        // );

        let url: string = this.pipRest.serverUrl + '/api/v1/organizations/' + this.iqsOrganization.orgId + '/incidents/count';
        return this.$http({
            method: "GET",
            url: url
        })
            .success((data: any) => {
                if (successCallback) successCallback(data);
            })
            .error((error: any) => {
                if (errorCallback) errorCallback(error);
            });
    }

    public readIncidents(params: any, successCallback?: (data: DataPage<Incident>) => void, errorCallback?: (error: any) => void): angular.IPromise<any> {
        params = params || {};
        params.org_id = params.org_id ? params.org_id : this.iqsOrganization.orgId;

        return this.pipRest.getResource(this.RESOURCE).page(params, successCallback, errorCallback);
    }

    public readIncident(id: string, successCallback?: (data: Incident) => void, errorCallback?: (error: any) => void): angular.IPromise<any> {
        return this.pipRest.getResource(this.RESOURCE).get(
            {
                incident_id: id,
                org_id: this.iqsOrganization.orgId
            },
            successCallback, errorCallback);
    }

    public createIncident(data: Incident, successCallback?: (data: Incident) => void, errorCallback?: (error: any) => void): void {
        this.pipRest.getResource(this.RESOURCE).save(
            { org_id: this.iqsOrganization.orgId }, // null
            data,
            successCallback,
            errorCallback
        );
    }

    public updateIncident(id: string, data: Incident, successCallback?: (data: Incident) => void, errorCallback?: (error: any) => void): void {
        this.pipRest.getResource(this.RESOURCE).update(
            {
                incident_id: id,
                org_id: this.iqsOrganization.orgId
            },
            data,
            successCallback,
            errorCallback
        );
    }

    public deleteIncident(id: string, successCallback?: () => void, errorCallback?: (error: any) => void): void {
        this.pipRest.getResource(this.RESOURCE).remove(
            {
                incident_id: id,
                org_id: this.iqsOrganization.orgId
            },
            null,
            successCallback,
            errorCallback
        );
    }
}


class IncidentsDataProvider implements IIncidentsDataProvider {
    private _service: IIncidentsDataService;

    constructor() {
        "ngInject";
    }

    public $get(
        $http: ng.IHttpService,
        pipRest: pip.rest.IRestService,
        iqsOrganization: IOrganizationService
    ) {
        "ngInject";

        if (this._service == null) {
            this._service = new IncidentsDataService($http, pipRest, iqsOrganization);
        }

        return this._service;
    }

}

angular
    .module('iqsIncidents.Data', ['pipRest', 'pipServices', 'iqsIncidents.Resource'])
    .provider('iqsIncidentsData', IncidentsDataProvider);
