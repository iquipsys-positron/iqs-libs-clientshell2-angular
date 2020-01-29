import { IResolutionsDataService, IResolutionsDataProvider } from './IResolutionsDataService';
import { Resolution } from './Resolution';
import { DataPage } from '../DataPage';
import { IOrganizationService } from '../../services';

class ResolutionsDataService implements IResolutionsDataService {
    private RESOURCE: string = 'resolutions';

    constructor(
        private pipRest: pip.rest.IRestService,
        private iqsOrganization: IOrganizationService
    ) {
        "ngInject";

    }

    public readResolutions(params: any, successCallback?: (data: DataPage<Resolution>) => void, errorCallback?: (error: any) => void): angular.IPromise<any> {
        params = params || {};
        params.org_id = params.org_id ? params.org_id : this.iqsOrganization.orgId;

        return this.pipRest.getResource(this.RESOURCE).page(params, successCallback, errorCallback);
    }

    public readResolution(id: string, successCallback?: (data: Resolution) => void, errorCallback?: (error: any) => void): angular.IPromise<any> {
        return this.pipRest.getResource(this.RESOURCE).get(
            {
                resolution_id: id,
                org_id: this.iqsOrganization.orgId
            }, successCallback, errorCallback);
    }

    public createResolution(data: Resolution, successCallback?: (data: Resolution) => void, errorCallback?: (error: any) => void): void {
        this.pipRest.getResource(this.RESOURCE).save(
            { org_id: this.iqsOrganization.orgId },
            data,
            successCallback,
            errorCallback
        );
    }

    public updateResolution(id: string, data: Resolution, successCallback?: (data: Resolution) => void, errorCallback?: (error: any) => void): void {
        this.pipRest.getResource(this.RESOURCE).update(
            {
                resolution_id: id,
                org_id: this.iqsOrganization.orgId
            },
            data,
            successCallback,
            errorCallback
        );
    }

    public deleteResolution(id: string, successCallback?: () => void, errorCallback?: (error: any) => void): void {
        this.pipRest.getResource(this.RESOURCE).remove(
            {
                resolution_id: id,
                org_id: this.iqsOrganization.orgId
            },
            null,
            successCallback,
            errorCallback
        );
    }
}


class ResolutionsDataProvider implements IResolutionsDataProvider {
    private _service: IResolutionsDataService;

    constructor() {
        "ngInject";
    }

    public $get(
        pipRest: pip.rest.IRestService,
        iqsOrganization: IOrganizationService
    ) {
        "ngInject";

        if (this._service == null) {
            this._service = new ResolutionsDataService(pipRest, iqsOrganization);
        }

        return this._service;
    }

}


angular
    .module('iqsResolutions.Data', ['pipRest', 'pipServices', 'iqsResolutions.Resource'])
    .provider('iqsResolutionsData', ResolutionsDataProvider);
