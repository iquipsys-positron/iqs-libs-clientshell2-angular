import { AccountsModel } from './AccountsModel';
import { IAccountsViewModel } from './IAccountsViewModel';
import {
    IAccountsDataService,
    Account
} from '../../data';
import { IObjectsViewModel} from '../../models';
import {
    IOrganizationService,
    SearchResult
} from '../../services';

class AccountsViewModel implements IAccountsViewModel {
    public model: AccountsModel;

    constructor(
        $location: ng.ILocationService,
        iqsAccountsData: IAccountsDataService,
        iqsObjectsViewModel: IObjectsViewModel,
        pipTransaction: pip.services.ITransactionService,
        iqsOrganization: IOrganizationService
    ) {

        this.model = new AccountsModel($location, iqsAccountsData, pipTransaction, iqsOrganization);
    }

    public initAccounts(filter?: string, successCallback?: (data: Account[]) => void, errorCallback?: (error: any) => void): angular.IPromise<any> {
        return this.model.getAccounts(filter || 'all', successCallback, errorCallback);
    }

    public getAccountsAll(filter?: any, successCallback?: (data: Account[]) => void, errorCallback?: (error: any) => void): angular.IPromise<any> {
        return this.model.getAccountsAll(filter, successCallback, errorCallback);
    }

    public filterAccounts(filter: string = 'all') {
        this.model.filterAccounts(filter);
    }

    public get accounts() {
        return this.model.accounts;
    }

    public get allAccounts() {
        return this.model.allAccounts;
    }

    public selectItem(index?: number) {
        this.model.selectItem(index);
    }

    public get state(): string {
        return this.model.state;
    }

    public set state(state: string) {
        this.model.state = state;
    }

    public get selectedIndex(): number {
        return this.model.selectedIndex;
    }

    public set selectedIndex(index: number) {
        this.model.selectedIndex = index;
    }

    public getTransaction(): pip.services.Transaction {
        return this.model.getTransaction();
    }

    public getAccountById(accountId: string): Account {
        return this.model.getAccountById(accountId)
    }

    public saveAccount(data: Account, callback: (item: Account) => void, error: (err: any) => void) {
        this.model.saveAccount(data, callback, error);
    }

    public deleteAccount(id, callback: () => void, error: () => void) {
        this.model.deleteAccount(id, callback, error);
    }

    public updateAccount(data: Account, callback: (item: Account) => void, error: (err: any) => void) {
        this.model.updateAccount(data, callback, error);
    }

    public filterWithArrayObjects(objects: SearchResult[])  {
        this.model.filterWithArrayObjects(objects);
    }

    public clean(): void {
        this.model.clean();
    }
}

angular.module('iqsAccounts.ViewModel', ['iqsAccounts.Data'])
    .service('iqsAccountsViewModel', AccountsViewModel);