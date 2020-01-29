import {
    ICurrentObjectRoutesDataService,
    ICurrentObjectRoutesDataProvider
} from './ICurrentObjectRoutesDataService';
import { CurrentObjectRoute } from './CurrentObjectRoute';
import { DataPage } from '../DataPage';
import { IOrganizationService } from '../../services';

class CurrentObjectRoutesDataService implements ICurrentObjectRoutesDataService {
    private RESOURCE: string = 'curr_object_routes';

    private PAGE_SIZE: number = 100;
    private PAGE_START: number = 0;
    private PAGE_TOTAL: boolean = true;

    constructor(
        private pipRest: pip.rest.IRestService,
        private iqsOrganization: IOrganizationService,
        private pipFormat: pip.services.IFormat
    ) {
        "ngInject";
    }

    public readObjectsPositions(params: any, successCallback?: (data: DataPage<CurrentObjectRoute>) => void, errorCallback?: (error: any) => void): angular.IPromise<any> {
        params = params || {};
        params.org_id = params.org_id ? params.org_id : this.iqsOrganization.orgId;

        if (params.filter) {
            params.filter = this.pipFormat.filterToString(params.filter);
        }

        return this.pipRest.getResource(this.RESOURCE).get(params, successCallback, errorCallback);
    }

    public readAllObjectsPositions(params: any, successCallback?: (data: CurrentObjectRoute[]) => void, errorCallback?: (error: any) => void): void {
        params = params || {};
        params.org_id = params.org_id ? params.org_id : this.iqsOrganization.orgId;

        params.skip = 0;
        params.take = this.PAGE_SIZE;
        if (params.filter) {
            params.filter = this.pipFormat.filterToString(params.filter);
        }

        let result: CurrentObjectRoute[];
        this.pipRest.getResource(this.RESOURCE).get(
            params,
            (data) => {
                result = data && data.data ? data.data : [];
                if (data && data.total && data.total > this.PAGE_SIZE) {
                    let pages: number[] = new Array();

                    for (let i = 100; i < data.total; i = i + 100) {
                        pages.push(i);
                    }

                    // read all page
                    async.eachSeries(
                        pages,
                        (skip, callback) => {
                            let p = _.cloneDeep(params);
                            p.skip = skip
                            this.pipRest.getResource(this.RESOURCE).get(
                                p,
                                (data) => {
                                    if (data.data) {
                                        result = _.union(result, data.data);
                                    }
                                    callback();
                                },
                                (error) => {
                                    callback(error);
                                });
                        },
                        (error) => {
                            if (error) {
                                if (errorCallback) errorCallback(error);
                            } else {
                                if (successCallback) successCallback(result);
                            }
                        });
                } else {
                    if (successCallback) successCallback(result);
                }

            },
            errorCallback);
    }

    public readObjectPositions(params: any, successCallback?: (data: CurrentObjectRoute) => void, errorCallback?: (error: any) => void): angular.IPromise<any> {
        params = params || {};
        params.org_id = params.org_id ? params.org_id : this.iqsOrganization.orgId;

        return this.pipRest.getResource(this.RESOURCE).get(params, successCallback, errorCallback);
    }

}

class CurrentObjectRoutesDataProvider implements ICurrentObjectRoutesDataProvider {
    private _service: ICurrentObjectRoutesDataService;

    constructor() {
        "ngInject";
    }

    public $get(
        pipRest: pip.rest.IRestService,
        iqsOrganization: IOrganizationService,
        pipFormat: pip.services.IFormat
    ) {
        "ngInject";

        if (this._service == null) {
            this._service = new CurrentObjectRoutesDataService(pipRest, iqsOrganization, pipFormat);
        }

        return this._service;
    }
}

angular
    .module('iqsCurrentObjectRoutes.Data', ['pipRest', 'pipServices', 'iqsCurrentObjectRoutes.Resource'])
    .provider('iqsCurrentObjectRoutesData', CurrentObjectRoutesDataProvider);