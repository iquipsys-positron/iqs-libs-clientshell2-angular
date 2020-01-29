import {
    IDataProfilesDataService,
    DataProfile
} from '../../data';
import { States } from '../../common/States';
import { IOrganizationService } from '../../services';

export class DataProfilesModel {
    public state: string;
    public dataProfile: DataProfile;
    private transaction: pip.services.Transaction;

    constructor(
        private $location: ng.ILocationService,
        private pipTransaction: pip.services.ITransactionService,
        private iqsDataProfilesData: IDataProfilesDataService,
        private iqsOrganization: IOrganizationService
    ) {
        "ngInject";

        this.transaction = pipTransaction.create('Data_Profile');
        this.setState();
    }

    private setState() {
        this.state = this.dataProfile ? States.Data : States.Empty;
    }

    public getDataProfiles( successCallback?: (data: DataProfile) => void, errorCallback?: (error: any) => void) {
        this.state = States.Progress;
        this.transaction.begin('read');
        this.iqsDataProfilesData.readDataProfiles(
            (data: DataProfile) => {
                this.getDataProfilesCallback(data, successCallback);
                this.transaction.end();
            },
            (error: any) => {
                this.transaction.end(error);

                if (errorCallback) {
                    errorCallback(error);
                }
            });
    }

    private getDataProfilesCallback(data: DataProfile, successCallback?: (data: DataProfile) => void) {
        this.dataProfile = data;
        this.setState();

        if (successCallback) {
            successCallback(this.dataProfile);
        }
    }

    public getTransaction(): pip.services.Transaction {
        return this.transaction;
    }

    public clean(): void {
        this.dataProfile = null;
        this.state = States.Empty;
    }
}