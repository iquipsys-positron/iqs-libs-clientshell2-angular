import { ILocationsDataService, ILocationsDataProvider } from './ILocationsDataService';
import { Location } from './Location';
import { DataPage } from '../DataPage';
import { IOrganizationService } from '../../services';

class LocationsDataService implements ILocationsDataService {
    private RESOURCE: string = 'locations';

    constructor(
        private pipRest: pip.rest.IRestService,
        private iqsOrganization: IOrganizationService,
    ) {
        "ngInject";

    }

    public readLocations(params: any, successCallback?: (data: DataPage<Location>) => void, errorCallback?: (error: any) => void): angular.IPromise<any> {
        params = params || {};
        params.org_id = params.org_id ? params.org_id : this.iqsOrganization.orgId;

        return this.pipRest.getResource(this.RESOURCE).page(params, successCallback, errorCallback);
    }

    public readLocation(id: string, successCallback?: (data: Location) => void, errorCallback?: (error: any) => void): angular.IPromise<any> {
        return this.pipRest.getResource(this.RESOURCE).get(
            {
                location_id: id,
                org_id: this.iqsOrganization.orgId
            },
            successCallback, errorCallback);
    }

    public createLocation(data: Location, successCallback?: (data: Location) => void, errorCallback?: (error: any) => void): void {
        this.pipRest.getResource(this.RESOURCE).save(
            { org_id: this.iqsOrganization.orgId }, // null
            _.extend(data, { org_id: this.iqsOrganization.orgId }),
            successCallback,
            errorCallback
        );
    }

    public updateLocation(id: string, data: Location, successCallback?: (data: Location) => void, errorCallback?: (error: any) => void): void {
        this.pipRest.getResource(this.RESOURCE).update(
            {
                location_id: id,
                org_id: this.iqsOrganization.orgId
            },
            _.extend(data, { org_id: this.iqsOrganization.orgId }),
            successCallback,
            errorCallback
        );
    }

    public deleteLocation(id: string, successCallback?: () => void, errorCallback?: (error: any) => void): void {
        this.pipRest.getResource(this.RESOURCE).delete(
            {
                location_id: id,
                org_id: this.iqsOrganization.orgId
            },
            null,
            successCallback,
            errorCallback
        );
    }
}


class LocationsDataProvider implements ILocationsDataProvider {
    private _service: ILocationsDataService;

    constructor() {
        "ngInject";
    }

    public $get(
        pipRest: pip.rest.IRestService,
        iqsOrganization: IOrganizationService
    ) {
        "ngInject";

        if (this._service == null) {
            this._service = new LocationsDataService(pipRest, iqsOrganization);
        }

        return this._service;
    }

}


angular
    .module('iqsLocations.Data', ['pipRest', 'pipServices', 'iqsLocations.Resource'])
    .provider('iqsLocationsData', LocationsDataProvider);
