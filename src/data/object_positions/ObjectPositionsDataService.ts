import {
    IObjectPositionsDataService,
    IObjectPositionsDataProvider
} from './IObjectPositionsDataService';
import { ObjectPositions } from './ObjectPositions';
import { DataPage } from '../DataPage';
import { IOrganizationService } from '../../services';

class ObjectPositionsDataService implements IObjectPositionsDataService {
    private RESOURCE: string = 'object_positions';
    private COUNT_RESOURCE: string = 'object_positions_count';

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

    public readObjectsPositions(params: any, successCallback?: (data: DataPage<ObjectPositions>) => void, errorCallback?: (error: any) => void): angular.IPromise<any> {
        params = params || {};
        params.org_id = params.org_id ? params.org_id : this.iqsOrganization.orgId;

        if (params.filter) {
            params.filter = this.pipFormat.filterToString(params.filter);
        }

        return this.pipRest.getResource(this.RESOURCE).get(params, successCallback, errorCallback);
    }

    // public readObjectPositions(params: any, successCallback?: (data: ObjectPositions) => void, errorCallback?: (error: any) => void): angular.IPromise<any> {
    //     params = params || {};
    //     params.org_id = params.org_id ? params.org_id : this.iqsOrganization.orgId;

    //     return this.pipRest.getResource(this.RESOURCE).get(params, successCallback, errorCallback);
    // }

    public readObjectPositions(params: any, successCallback?: (data: DataPage<ObjectPositions>) => void, errorCallback?: (error: any) => void): void {
        params = params || {};
        params.org_id = params.org_id ? params.org_id : this.iqsOrganization.orgId;

        params.skip = 0;
        params.take = this.PAGE_SIZE;
        if (params.filter) {
            params.filter = this.pipFormat.filterToString(params.filter);
        }

        let DataPageResult: DataPage<ObjectPositions>;
        let total: number;
        let result: ObjectPositions[];
        this.pipRest.getResource(this.RESOURCE).get(
            params,
            (data) => {
                result = data && data.data ? data.data : [];
                total = data && data.total ? data.total : 0;
                if (data && data.total && data.total > this.PAGE_SIZE) {
                    let pages: number[] = new Array();

                    for (let i = 100; i < data.total; i = i + 100) {
                        pages.push(i);
                    }

                    // read all page
                    async.each(
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
                                DataPageResult = {
                                    total: total,
                                    data: result
                                };
                                if (successCallback) successCallback(DataPageResult);
                            }
                        });
                } else {
                    DataPageResult = {
                        total: total,
                        data: result
                    };
                    if (successCallback) successCallback(DataPageResult);
                }

            },
            errorCallback);
    }


    public getObjectsPositionsCount(params: any, successCallback?: (data: number) => void, errorCallback?: (error: any) => void): angular.IPromise<any> {
        params = params || {};
        params.org_id = params.org_id ? params.org_id : this.iqsOrganization.orgId;

        return this.pipRest.getResource(this.COUNT_RESOURCE).get(params, successCallback, errorCallback);
    }

}

class ObjectPositionsDataProvider implements IObjectPositionsDataProvider {
    private _service: IObjectPositionsDataService;

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
            this._service = new ObjectPositionsDataService(pipRest, iqsOrganization, pipFormat);
        }

        return this._service;
    }
}

angular
    .module('iqsObjectPositions.Data', ['pipRest', 'pipServices', 'iqsObjectPositions.Resource'])
    .provider('iqsObjectPositionsData', ObjectPositionsDataProvider);