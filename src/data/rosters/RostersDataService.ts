import {
    IRostersDataService,
    IRostersDataProvider
} from './IRostersDataService';
import { Roster } from './Roster';
import { DataPage } from '../DataPage';
import { IOrganizationService } from '../../services';

class RostersDataService implements IRostersDataService {
    private RESOURCE: string = 'rosters';

    private PAGE_SIZE: number = 100;
    private PAGE_START: number = 0;
    private PAGE_TOTAL: boolean = true;

    constructor(
        private pipRest: pip.rest.IRestService,
        private iqsOrganization: IOrganizationService) {
        "ngInject";
    }

    public readRosters(params: any, successCallback?: (data: DataPage<Roster>) => void, errorCallback?: (error: any) => void): any {
        params = params || {};
        params.org_id = params.org_id ? params.org_id : this.iqsOrganization.orgId;
        this.pipRest.getResource(this.RESOURCE).get(params, (items: DataPage<Roster>) => {
            if (params.type) {
                if (successCallback) {
                    successCallback(items);
                }
            }

            if (successCallback) {
                successCallback(items);
            }
        }, errorCallback);
    }

    public readRoster(id: string, successCallback?: (data: Roster) => void, errorCallback?: (error: any) => void): any {

    }

    public updateRoster(id: string, data: Roster, successCallback?: (data: Roster) => void, errorCallback?: (error: any) => void) {
        data.org_id = this.iqsOrganization.orgId;
        this.pipRest.getResource(this.RESOURCE).update(
            {
                roster_id: id,
                org_id: this.iqsOrganization.orgId
            },
            data, (item: Roster) => {
                if (successCallback) {
                    successCallback(item);
                }
            },
            errorCallback);
    }

    public saveRoster(data: Roster, successCallback?: (data: Roster) => void, errorCallback?: (error: any) => void) {
        this.pipRest.getResource(this.RESOURCE).save(
            { org_id: this.iqsOrganization.orgId }, // null
            _.extend(data, { org_id: this.iqsOrganization.orgId }),
            (item: Roster) => {
                if (successCallback) {
                    successCallback(item);
                }
            },
            errorCallback);
    }

    public deleteRoster(id: string, successCallback?: (data: any) => void, errorCallback?: (error: any) => void) {
        this.pipRest.getResource(this.RESOURCE).delete(
            {
                roster_id: id,
                org_id: this.iqsOrganization.orgId
            },
            null,
            (item) => {
                if (successCallback) {
                    successCallback(item);
                }

                return item;
            },
            errorCallback)
    }
}

class RostersDataProvider implements IRostersDataProvider {
    private _service: IRostersDataService;

    constructor() {
        "ngInject";
    }

    public $get(
        pipRest: pip.rest.IRestService,
        iqsOrganization: IOrganizationService
    ) {
        "ngInject";

        if (this._service == null) {
            this._service = new RostersDataService(pipRest, iqsOrganization);
        }

        return this._service;
    }

}


angular
    .module('iqsRosters.Data', ['pipRest', 'pipServices', 'iqsRosters.Resource'])
    .provider('iqsRostersData', RostersDataProvider);