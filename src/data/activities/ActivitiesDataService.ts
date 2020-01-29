import {
    IActivitiesDataService,
    IActivitiesDataProvider
} from './IActivitiesDataService';
import { Activity } from './Activity';
import { DataPage } from '../DataPage';
import { IOrganizationService } from '../../services';

class ActivitiesDataService implements IActivitiesDataService {
    private RESOURCE: string = 'activities';

    constructor(
        private pipRest: pip.rest.IRestService,
        private iqsOrganization: IOrganizationService
    ) {
        "ngInject";
    }

    public readActivities(id: string, params: any, successCallback?: (data: DataPage<Activity[]>) => void, errorCallback?: (error: any) => void): angular.IPromise<any> {
        params = params || {};

        return this.pipRest.getResource(this.RESOURCE).page({ account_id: id }, params, successCallback, errorCallback);
    }

    public readActivity(id: string, successCallback?: (data: Activity) => void, errorCallback?: (error: any) => void): angular.IPromise<any> {
        return this.pipRest.getResource(this.RESOURCE).get({
            account_id: id
        }, successCallback, errorCallback);
    }

    public createActivity(data: Activity, successCallback?: (data: Activity) => void, errorCallback?: (error: any) => void): void {
        this.pipRest.getResource(this.RESOURCE).save(
            null,
            data,
            successCallback,
            errorCallback
        );
    }
    public removeActivity(params, successCallback?: any, errorCallback?: any) {
        this.pipRest.getResource(this.RESOURCE).delete(
            {
                account_id: params.session.id
            }, {
                account_id: params.session.id
            },
            successCallback,
            errorCallback);
    }

    public updateActivity(id: string, data: Activity, successCallback?: (data: Activity) => void, errorCallback?: (error: any) => void): void {
        this.pipRest.getResource(this.RESOURCE).update(
            { account_id: id },
            data,
            successCallback,
            errorCallback
        );
    }

    public deleteActivity(id: string, successCallback?: () => void, errorCallback?: (error: any) => void): void {
        this.pipRest.getResource(this.RESOURCE).remove(
            { account_id: id },
            null,
            successCallback,
            errorCallback
        );
    }


}


class ActivitiesDataProvider implements IActivitiesDataProvider {
    private _service: IActivitiesDataService;

    constructor() {
        "ngInject";
    }

    public $get(
        pipRest: pip.rest.IRestService,
        iqsOrganization: IOrganizationService
    ) {
        "ngInject";

        if (this._service == null) {
            this._service = new ActivitiesDataService(pipRest, iqsOrganization);
        }

        return this._service;
    }

}


angular
    .module('iqsActivities.Data', ['pipRest', 'pipServices', 'iqsActivities.Resource'])
    .provider('iqsActivitiesData', ActivitiesDataProvider);