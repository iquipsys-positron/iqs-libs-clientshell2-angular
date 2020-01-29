import {
    IApplicationsDataService,
    IApplicationsDataProvider
} from './IApplicationsDataService';
import { Application } from './Application';
import { DataPage } from '../DataPage';
import { IOrganizationService } from '../../services';

class ApplicationsDataService implements IApplicationsDataService {
    private RESOURCE: string = 'applications';
    private RESOURCE_ALL_APPLICATIONS: string = 'applications_all';

    private PAGE_SIZE: number = 100;
    private PAGE_START: number = 0;
    private PAGE_TOTAL: boolean = true;

    constructor(
        private pipRest: pip.rest.IRestService,
        private pipFormat: pip.services.IFormat,
        private iqsOrganization: IOrganizationService
    ) {
        "ngInject";
    }

    public readApplications(params: any, successCallback?: (data: DataPage<Application>) => void, errorCallback?: (error: any) => void): angular.IPromise<any> {
        params = params || {};
        params.product = params.product || 'iQuipsys Positron';
        return this.pipRest.getResource(this.RESOURCE_ALL_APPLICATIONS).get(
            params,
            (items: DataPage<Application>) => {

                if (successCallback) {
                    successCallback(items);
                }
            }, errorCallback);
    }

    public readApplication(id: string, successCallback?: (data: Application) => void, errorCallback?: (error: any) => void): any {
        const params: any = {
            product: 'iQuipsys Positron'
        };
        this.pipRest.getResource(this.RESOURCE).get(params, (application: Application) => {
            if (successCallback) {
                successCallback(application);
            }
        }, errorCallback);
    }


    public updateApplication(id: string, data: Application, successCallback?: (data: Application) => void, errorCallback?: (error: any) => void) {
        const params: any = {
            product: 'iQuipsys Positron'
        };
        this.pipRest.getResource(this.RESOURCE).update(params, data, (item: Application) => {
            if (successCallback) {
                successCallback(item);
            }
        }, errorCallback);

    }

    public saveApplication(data: Application, successCallback?: (data: Application) => void, errorCallback?: (error: any) => void) {
        if (data.product !== 'iQuipsys Positron') {
            if (errorCallback) {
                errorCallback('Application can\'t change it\'s product');
            }
            return;
        }
        this.pipRest.getResource(this.RESOURCE).save(data, (item: Application) => {
            if (successCallback) {
                successCallback(item);
            }
        }, errorCallback);

    }

    public deleteApplication(id: string, successCallback?: (data: any) => void, errorCallback?: (error: any) => void) {
        const params: any = {
            product: 'iQuipsys Positron'
        };
        this.pipRest.getResource(this.RESOURCE).delete(params, null, (item) => {
            if (successCallback) {
                successCallback(item);
            }
        }, errorCallback)
    }
}

class ApplicationsDataProvider implements IApplicationsDataProvider {
    private _service: IApplicationsDataService;

    constructor() {
        "ngInject";
    }

    public $get(
        pipRest: pip.rest.IRestService,
        pipFormat: pip.services.IFormat,
        iqsOrganization: IOrganizationService
    ) {
        "ngInject";

        if (this._service == null) {
            this._service = new ApplicationsDataService(pipRest, pipFormat, iqsOrganization);
        }

        return this._service;
    }
}

angular
    .module('iqsApplications.Data', ['pipRest', 'pipServices', 'iqsApplications.Resource'])
    .provider('iqsApplicationsData', ApplicationsDataProvider);