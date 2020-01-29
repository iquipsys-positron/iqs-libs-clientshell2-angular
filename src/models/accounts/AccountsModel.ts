import {
    IAccountsDataService,
    Account,
    DataPage
} from '../../data';

import { States } from '../../common';
import { IObjectsViewModel } from '../../models/objects';
import {
    IOrganizationService,
    SearchResult
} from '../../services';

export class AccountParams {
    skip: number = 0;
    total: boolean = true;
    size: number = 100;
    type?: string;
}

export class AccountsModel {
    public state: string;
    public allAccounts: Account[];
    public accounts: Account[];
    public selectedIndex: number;
    private transaction: pip.services.Transaction;
    private selectedItem: Account;

    constructor(
        private $location: ng.ILocationService,
        private iqsAccountsData: IAccountsDataService,
        private pipTransaction: pip.services.ITransactionService,
        private iqsOrganization: IOrganizationService
    ) {
        "ngInject";

        this.transaction = pipTransaction.create('Object_Group');
    }

    private sortCollection(data: Account[]): Account[] {
        let collection: Account[] = _.sortBy(data, function (item: Account) {
            return item.name ? item.name.toLocaleLowerCase() : '';
        });

        return collection;
    }

    private setState() {
        this.state = (this.accounts && this.accounts.length > 0) ? States.Data : States.Empty;
    }

    public getAccountsAll(filter: any, successCallback?: (data: Account[]) => void, errorCallback?: (error: any) => void): angular.IPromise<any> {
        this.transaction.begin('read');
        let params: AccountParams = new AccountParams();

        if (filter) {
            params = _.defaults(filter, params);
        }

        return this.iqsAccountsData.readAllAccounts(
            params,
            (data: DataPage<Account>) => {
                if (successCallback) {
                    successCallback(data.data);
                }
            },
            (error: any) => {
                this.transaction.end(error);

                if (errorCallback) {
                    errorCallback(error);
                }
            });
    }

    public getAccounts(filter: string, successCallback?: (data: Account[]) => void, errorCallback?: (error: any) => void): angular.IPromise<any> {
        this.transaction.begin('read');
        this.state = States.Progress;
        let params: AccountParams = new AccountParams();
        return this.iqsAccountsData.readAccounts(
            params,
            (data: DataPage<Account>) => {
                this.getAccountsCallback(data, filter, successCallback);
            },
            (error: any) => {
                this.transaction.end(error);

                if (errorCallback) {
                    errorCallback(error);
                }
            });
    }

    public selectItem(index?: number) {
        if (index === undefined || index === null || index < 0 || index > this.accounts.length - 1) {
            let id: string = this.$location.search()['account_id'];
            if (id) {
                index = _.findIndex(this.accounts, (item: Account) => {
                    return item.id == id;
                });
            }
            if (!index || index == -1) {
                index = 0;
            }
        }

        if (this.accounts.length > index) {
            this.selectedIndex = index;
        } else {
            this.selectedIndex = 0;
        }

        this.selectedIndex = index;

        this.selectedItem = (this.accounts && this.accounts.length > 0) ? this.accounts[index] : undefined;
        if (this.selectedItem) {
            this.$location.search('account_id', this.selectedItem.id);
        }

        this.setState();
    }

    public filterAccounts(filter: string = 'all') {
        this.accounts = this.allAccounts;
        this.setState();
    }

    public filterWithArrayObjects(objects: SearchResult[]) {
        this.accounts = _.filter(
            this.accounts,
            (item: Account) => {
                return _.findIndex(objects, { id: item.id }) != -1 ? true : false;
            });
        this.state = this.accounts.length > 0 ? States.Data : States.Empty;
    }

    public getAccountById(accountId: string) {
        return _.find(this.allAccounts, (account) => { return account.id === accountId; });
    }

    public getTransaction(): pip.services.Transaction {
        return this.transaction;
    }

    private getAccountsCallback(data: DataPage<Account>, filter?: string, successCallback?: (data: Account[]) => void) {
        let roles: string[];
        this.allAccounts = this.sortCollection(data.data);
        this.allAccounts.forEach(element => {
            element.roles.forEach(elementRole => {
                roles = elementRole.split(':');
                if (roles[0] == this.iqsOrganization.orgId) {
                    element['localRole'] = roles[1];
                }
            });
        });
        this.filterAccounts(filter);

        this.selectItem();
        this.transaction.end();
        if (successCallback) {
            successCallback(this.allAccounts);
        }
    }

    public saveAccount(data: Account, callback?: (item: Account) => void, errorCallback?: (err: any) => void) {
        this.transaction.begin('create_account');
        this.iqsAccountsData.saveAccount(data,
            (item: Account) => {
                this.accounts.push(item);
                this.allAccounts.push(item);
                this.$location.search('account_id', item.id);
                this.selectItem();
                this.transaction.end();
                if (callback) {
                    callback(item);
                }
            },
            (err: any) => {
                this.transaction.end(err);
                if (errorCallback) {
                    errorCallback(err);
                }
            })
    }

    public remove(id: string): void {
        _.remove(this.accounts, { id: id });
        _.remove(this.allAccounts, { id: id });
        this.setState();
    }

    public deleteAccount(id: string, callback?: () => void, errorCallback?: () => void) {
        this.transaction.begin('delete_account');
        let index: number;
        if (this.selectedItem && this.selectedItem.id == id) {
            index = this.selectedIndex < this.accounts.length - 1 ? this.selectedIndex : this.selectedIndex - 1;
        } else {
            index = this.selectedIndex;
        }
        this.iqsAccountsData.deleteAccount(id,
            (item) => {
                this.remove(id);
                this.selectItem(index);
                this.transaction.end();
                if (callback) {
                    callback();
                }
            },
            (err: any) => {
                this.transaction.end(err);
                if (errorCallback) {
                    errorCallback();
                }
            })
    }

    public updateAccount(data: Account, callback?: (item) => void, errorCallback?: (err) => void) {
        this.transaction.begin('update_account');
        this.iqsAccountsData.updateAccount(data.id, data,
            (item: Account) => {
                let index: number = _.findIndex(this.accounts, { id: item.id });
                if (index > -1) {
                    this.accounts[index] = item;
                    this.accounts = this.sortCollection(this.accounts);
                }

                index = _.findIndex(this.allAccounts, { id: item.id });
                if (index > -1) {
                    this.allAccounts[index] = item;
                    this.allAccounts = this.sortCollection(this.allAccounts);
                }
                this.$location.search('account_id', item.id);
                this.selectItem();
                this.transaction.end();
                if (callback) {
                    callback(item);
                }
            },
            (err: any) => {
                this.transaction.end(err);
                if (errorCallback) {
                    errorCallback(err);
                }
            })
    }

    public clean(): void {
        this.accounts = [];
        this.allAccounts = [];
        this.state = States.Empty;
        this.selectedIndex = -1;
    }
}