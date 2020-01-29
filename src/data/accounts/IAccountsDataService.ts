import { Account } from './Account';
import { DataPage } from '../DataPage';

export interface IAccountsDataService {
    readAllAccounts(params: any, successCallback?: (data: DataPage<Account>) => void, errorCallback?: (error: any) => void): angular.IPromise<any>;
    readAccounts(params: any, successCallback?: (data: DataPage<Account>) => void, errorCallback?: (error: any) => void): angular.IPromise<any>;
    readAccount(id: string, successCallback?: (data: Account) => void, errorCallback?: (error: any) => void): any;
    saveAccount(data: Account, successCallback?: (data: Account) => void, errorCallback?: (error: any) => void);
    updateAccount(id: string, data: Account, successCallback?: (data: Account) => void, errorCallback?: (error: any) => void);
    deleteAccount(id: string, successCallback?: (data: any) => void, errorCallback?: (error: any) => void);
}

export interface IAccountsDataProvider {

}