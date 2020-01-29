import { Account } from "../../data";
import { SearchResult } from '../../services';

export interface IAccountsViewModel {
    initAccounts(filter?: string, successCallback?: (data: Account[]) => void, errorCallback?: (error: any) => void): angular.IPromise<any>;
    filterAccounts(filter: string);
    selectItem(index?: number);
    getAccountById(accountId: string): Account;
    saveAccount(data: Account, callback: (item: Account) => void, error: (err: any) => void);
    updateAccount(data: Account, callback: (item: Account) => void, error: (err: any) => void);
    deleteAccount(id, callback: () => void, error: () => void);
    filterWithArrayObjects(objects: SearchResult[]); 
    getTransaction(): pip.services.Transaction;

    getAccountsAll(filter?: any, successCallback?: (data: Account[]) => void, errorCallback?: (error: any) => void): angular.IPromise<any>;
    clean(): void;
    state: string;
    selectedIndex: number;
    accounts: Account[];
    allAccounts: Account[];
}