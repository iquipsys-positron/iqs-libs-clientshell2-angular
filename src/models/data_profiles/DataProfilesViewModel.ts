import { DataProfilesModel } from './DataProfilesModel';
import { IDataProfilesViewModel } from './IDataProfilesViewModel';
import {
    IDataProfilesDataService,
    DataProfile
} from '../../data';
import { IOrganizationService } from '../../services';

class DataProfilesViewModel implements IDataProfilesViewModel {
    public model: DataProfilesModel;

    constructor(
        $location: ng.ILocationService,
        pipTransaction: pip.services.ITransactionService,
        iqsDataProfilesData: IDataProfilesDataService,
        iqsOrganization: IOrganizationService
    ) {

        this.model = new DataProfilesModel($location, pipTransaction, iqsDataProfilesData, iqsOrganization);
    }

    public initDataProfiles(successCallback?: (data: DataProfile) => void, errorCallback?: (error: any) => void) {
        this.model.getDataProfiles(successCallback, errorCallback);
    }

    public get dataProfile() {
        return this.model.dataProfile;
    }

    public getTransaction(): pip.services.Transaction {
        return this.model.getTransaction();
    }

    public get state(): string {
        return this.model.state;
    }

    public set state(state: string) {
        this.model.state = state;
    }

    public clean(): void {
        this.model.clean();
    }
}

angular.module('iqsDataProfiles.ViewModel', ['iqsDataProfiles.Data'])
    .service('iqsDataProfilesViewModel', DataProfilesViewModel);