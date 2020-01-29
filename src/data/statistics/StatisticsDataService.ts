import {
    IStatisticsDataService,
    IStatisticsDataProvider
} from './IStatisticsDataService';
import { Statistics } from './Statistics';
import { IOrganizationService } from '../../services';

class StatisticsDataService implements IStatisticsDataService {
    private RESOURCE: string = 'statistics';

    private PAGE_SIZE: number = 100;
    private PAGE_START: number = 0;
    private PAGE_TOTAL: boolean = true;

    constructor(private pipRest: pip.rest.IRestService, private iqsOrganization: IOrganizationService) {
        "ngInject";
    }

    public readStatistics(params: any, successCallback?: (data: Statistics[]) => void, errorCallback?: (error: any) => void): any {
        params.org_id = this.iqsOrganization.orgId;
        params.timezone = this.iqsOrganization.organization.timezone;
        let hoursOffset = moment(new Date()).tz(params.timezone).utcOffset() / 60;
        let localOffset = moment(new Date()).utcOffset() / 60;
        params.from_time = moment(params.from_time).add('hours', -hoursOffset + localOffset).toISOString();
        params.to_time = moment(params.to_time).add('hours', -hoursOffset + localOffset).toISOString();

        this.pipRest.getResource(this.RESOURCE).get(params, (items: Statistics[]) => {
            if (successCallback) {
                successCallback(items);
            }

            return items;
        }, errorCallback);
    }

    public updateStatistics(id: string, data: Statistics, successCallback?: (data: any) => void, errorCallback?: (error: any) => void) {
        this.pipRest.getResource(this.RESOURCE).update({ group_id: id }, data, (item: any) => {
            if (successCallback) {
                successCallback(item);
            }

            return item;
        }, errorCallback);

    }

    public saveStatistics(data: Statistics, successCallback?: (data: any) => void, errorCallback?: (error: any) => void) {
        this.pipRest.getResource(this.RESOURCE).save(data, (item: any) => {
            if (successCallback) {
                successCallback(item);
            }

            return item;
        }, errorCallback);

    }
}

class StatisticsDataProvider implements IStatisticsDataProvider {
    private _service: IStatisticsDataService;

    constructor() {
        "ngInject";
    }

    public $get(
        pipRest: pip.rest.IRestService,
        iqsOrganization: IOrganizationService
    ) {
        "ngInject";

        if (this._service == null) {
            this._service = new StatisticsDataService(pipRest, iqsOrganization);
        }

        return this._service;
    }

}


angular
    .module('iqsStatistics.Data', ['pipRest', 'pipServices', 'iqsStatistics.Resource'])
    .provider('iqsStatisticsData', StatisticsDataProvider);