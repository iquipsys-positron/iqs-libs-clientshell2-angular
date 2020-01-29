import { ICorrectionsDataService, ICorrectionsDataProvider } from './ICorrectionsDataService';
import { Correction } from './Correction';
import { DataPage } from '../DataPage';
import { IOrganizationService } from '../../services';

class CorrectionsDataService implements ICorrectionsDataService {
    private RESOURCE: string = 'corrections';

    constructor(
        private pipRest: pip.rest.IRestService,
        private iqsOrganization: IOrganizationService,
    ) {
        "ngInject";

    }

    public readCorrections(params: any, successCallback?: (data: DataPage<Correction>) => void, errorCallback?: (error: any) => void): angular.IPromise<any> {
        params = params || {};
        params.org_id = params.org_id ? params.org_id : this.iqsOrganization.orgId;

        return this.pipRest.getResource(this.RESOURCE).page(params, successCallback, errorCallback);
    }

    public readCorrection(id: string, successCallback?: (data: Correction) => void, errorCallback?: (error: any) => void): angular.IPromise<any> {
        return this.pipRest.getResource(this.RESOURCE).get(
            {
                correction_id: id,
                org_id: this.iqsOrganization.orgId
            },
            successCallback, errorCallback);
    }

    public createCorrection(data: Correction, successCallback?: (data: Correction) => void, errorCallback?: (error: any) => void): void {
        this.pipRest.getResource(this.RESOURCE).save(
            { org_id: this.iqsOrganization.orgId },
            data,
            successCallback,
            errorCallback
        );
    }

    public updateCorrection(id: string, data: Correction, successCallback?: (data: Correction) => void, errorCallback?: (error: any) => void): void {
        this.pipRest.getResource(this.RESOURCE).update(
            {
                correction_id: id,
                org_id: this.iqsOrganization.orgId
            },
            data,
            successCallback,
            errorCallback
        );
    }

    public deleteCorrection(id: string, successCallback?: () => void, errorCallback?: (error: any) => void): void {
        this.pipRest.getResource(this.RESOURCE).remove(
            {
                correction_id: id,
                org_id: this.iqsOrganization.orgId
            },
            null,
            successCallback,
            errorCallback
        );
    }
}


class CorrectionsDataProvider implements ICorrectionsDataProvider {
    private _service: ICorrectionsDataService;

    constructor() {
        "ngInject";
    }

    public $get(
        pipRest: pip.rest.IRestService,
        iqsOrganization: IOrganizationService
    ) {
        "ngInject";

        if (this._service == null) {
            this._service = new CorrectionsDataService(pipRest, iqsOrganization);
        }

        return this._service;
    }

}


angular
    .module('iqsCorrections.Data', ['pipRest', 'pipServices', 'iqsCorrections.Resource'])
    .provider('iqsCorrectionsData', CorrectionsDataProvider);
