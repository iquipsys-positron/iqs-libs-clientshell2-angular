import { IBeaconsDataService, IBeaconsDataProvider } from './IBeaconsDataService';
import { Beacon } from './Beacon';
import { DataPage } from '../DataPage';
import { IOrganizationService } from '../../services';

class BeaconsDataService implements IBeaconsDataService {
    private RESOURCE: string = 'beacons';
    private RESOURCE_CALC_POSITION: string = 'beacons_calculate_position';
    private RESOURCE_VERIFY: string = 'verify_beacons_udi';

    constructor(
        private pipRest: pip.rest.IRestService,
        private iqsOrganization: IOrganizationService,
        private $http: ng.IHttpService
    ) {
        "ngInject";

    }

    public readBeacons(params: any, successCallback?: (data: DataPage<Beacon>) => void, errorCallback?: (error: any) => void): angular.IPromise<any> {
        params = params || {};
        params.org_id = params.org_id ? params.org_id : this.iqsOrganization.orgId;

        return this.pipRest.getResource(this.RESOURCE).page(params, successCallback, errorCallback);
    }

    public readBeacon(params: any, successCallback?: (data: Beacon) => void, errorCallback?: (error: any) => void): angular.IPromise<any> {
        params = params || {};
        params.org_id = params.org_id ? params.org_id : this.iqsOrganization.orgId;

        return this.pipRest.getResource(this.RESOURCE).get(params, successCallback, errorCallback);
    }

    public createBeacon(data: Beacon, successCallback?: (data: Beacon) => void, errorCallback?: (error: any) => void): void {
        this.pipRest.getResource(this.RESOURCE).save(
            { org_id: this.iqsOrganization.orgId },
            data,
            successCallback,
            errorCallback
        );
    }

    public updateBeacon(id: string, data: Beacon, successCallback?: (data: Beacon) => void, errorCallback?: (error: any) => void): void {
        this.pipRest.getResource(this.RESOURCE).update(
            {
                beacon_id: id,
                org_id: this.iqsOrganization.orgId
            },
            data,
            successCallback,
            errorCallback
        );
    }

    public deleteBeacon(id: string, successCallback?: () => void, errorCallback?: (error: any) => void): void {
        this.pipRest.getResource(this.RESOURCE).remove(
            {
                beacon_id: id,
                org_id: this.iqsOrganization.orgId
            },
            null,
            successCallback,
            errorCallback
        );
    }

    public verifyBeaconUdi(params: any, successCallback?: (data?: any) => void, errorCallback?: (error?: any) => void): void {
        let url: string = this.pipRest.serverUrl + '/api/v1/organizations/' + this.iqsOrganization.orgId + '/beacons/validate_udi';

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

    public calculatePosition(params: any, successCallback?: (data?: any) => void, errorCallback?: (error?: any) => void): void {
        this.pipRest.getResource(this.RESOURCE_CALC_POSITION).call(
            {
                org_id: this.iqsOrganization.orgId
            },
            params, // udis string [];
            successCallback,
            errorCallback
        );
    }

}


class BeaconsDataProvider implements IBeaconsDataProvider {
    private _service: IBeaconsDataService;

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
            this._service = new BeaconsDataService(pipRest, iqsOrganization, $http);
        }

        return this._service;
    }

}


angular
    .module('iqsBeacons.Data', ['pipRest', 'pipServices', 'iqsBeacons.Resource'])
    .provider('iqsBeaconsData', BeaconsDataProvider);
