import { DataProfile } from './DataProfile';
import { IDataProfilesDataService, IDataProfilesDataProvider } from './IDataProfilesDataService';

import { IOrganizationService } from '../../services';

class DataProfilesDataService implements IDataProfilesDataService {
    private RESOURCE: string = 'data_profiles';

    constructor(
        private pipRest: pip.rest.IRestService,
        private pipFormat: pip.services.IFormat,
        private iqsOrganization: IOrganizationService
    ) {
        "ngInject";
    }

    public readDataProfiles(successCallback?: (data: DataProfile) => void, errorCallback?: (error: any) => void): angular.IPromise<any> {
        return this.pipRest.getResource(this.RESOURCE).get(
            {
                org_id: this.iqsOrganization.orgId
            },
            (data: DataProfile) => {
                successCallback(data);
            },
            errorCallback
        );
    }
}


class DataProfilesDataProvider implements IDataProfilesDataProvider {
    private _service: IDataProfilesDataService;

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
            this._service = new DataProfilesDataService(pipRest, pipFormat, iqsOrganization);
        }

        return this._service;
    }

}


angular
    .module('iqsDataProfiles.Data', ['pipRest', 'pipServices', 'iqsDataProfiles.Resource'])
    .provider('iqsDataProfilesData', DataProfilesDataProvider);