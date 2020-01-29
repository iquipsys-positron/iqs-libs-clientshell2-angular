import {
    IZonesDataService,
    IZonesDataProvider
} from './IZonesDataService';
import { Zone } from './Zone';
import { DataPage } from '../DataPage';
import { IOrganizationService } from '../../services';

class ZonesDataService implements IZonesDataService {
    private RESOURCE: string = 'zones';

    private PAGE_SIZE: number = 100;
    private PAGE_START: number = 0;
    private PAGE_TOTAL: boolean = true;

    constructor(
        private pipRest: pip.rest.IRestService,
        private iqsOrganization: IOrganizationService
    ) {
        "ngInject";
    }

    public readZones(params: any, successCallback?: (data: DataPage<Zone>) => void, errorCallback?: (error: any) => void) {
        params = params || {};
        params.org_id = params.org_id ? params.org_id : this.iqsOrganization.orgId;

        this.pipRest.getResource(this.RESOURCE).get(params, successCallback, errorCallback);
    }

    public saveZone(data: Zone, successCallback?: (data: Zone) => void, errorCallback?: (error: any) => void) {
        this.pipRest.getResource(this.RESOURCE).save(
            {
                org_id: this.iqsOrganization.orgId
            },
            _.extend(data, { org_id: this.iqsOrganization.orgId }),
            (item: Zone) => {
                if (successCallback) {
                    successCallback(item);
                }
            },
            errorCallback);
    }

    public updateZone(id: string, data: Zone, successCallback?: (data: Zone) => void, errorCallback?: (error: any) => void) {
        this.pipRest.getResource(this.RESOURCE).update(
            {
                zone_id: id,
                org_id: this.iqsOrganization.orgId
            },
            _.extend(data, { org_id: this.iqsOrganization.orgId }),
            (item: Zone) => {
                if (successCallback) {
                    successCallback(item);
                }
            },
            errorCallback);
    }

    public deleteZone(id: string, successCallback?: () => void, errorCallback?: (error: any) => void): any {
        this.pipRest.getResource(this.RESOURCE).delete(
            {
                zone_id: id,
                org_id: this.iqsOrganization.orgId
            },
            null,
            successCallback,
            errorCallback
        );
    }

    public readZone(object_id: string, successCallback?: (data: Zone) => void, errorCallback?: (error: any) => void): any {
        this.pipRest.getResource(this.RESOURCE).get(
            { org_id: this.iqsOrganization.orgId },
            (data: DataPage<Zone>) => {
                if (successCallback) {
                    successCallback(data.data[Number(object_id)]);
                }
            },
            errorCallback);
    }
}


class ZonesDataProvider implements IZonesDataProvider {
    private _service: IZonesDataService;

    constructor() {
        "ngInject";
    }

    public $get(
        pipRest: pip.rest.IRestService,
        iqsOrganization: IOrganizationService
    ) {
        "ngInject";

        if (this._service == null) {
            this._service = new ZonesDataService(pipRest, iqsOrganization);
        }

        return this._service;
    }

}


angular
    .module('iqsZones.Data', ['pipRest', 'pipServices', 'iqsZones.Resource'])
    .provider('iqsZonesData', ZonesDataProvider);