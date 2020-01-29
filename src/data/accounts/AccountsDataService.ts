import {
    IAccountsDataService,
    IAccountsDataProvider
} from './IAccountsDataService';
import { Account } from './Account';
import { DataPage } from '../DataPage';
import { IOrganizationService } from '../../services';

class AccountsDataService implements IAccountsDataService {
    private RESOURCE: string = 'accounts';
    private RESOURCE_ALL_ACCOUNTS: string = 'accounts_all';
    private RESOURCE_FOR_SITE: string = 'accounts_organization';

    private PAGE_SIZE: number = 100;
    private PAGE_START: number = 0;
    private PAGE_TOTAL: boolean = true;

    constructor( 
        private pipRest: pip.rest.IRestService, 
        private pipFormat: pip.services.IFormat,
        private iqsOrganization: IOrganizationService,
        private pipIdentity: pip.services.IIdentityService
    ) {
        "ngInject";
    }

    public readAllAccounts(params: any, successCallback?: (data: DataPage<Account>) => void, errorCallback?: (error: any) => void): angular.IPromise<any> {
        // params - search
        return this.pipRest.getResource(this.RESOURCE_ALL_ACCOUNTS).get(
            params, 
            (items: DataPage<Account>) => {

            if (successCallback) {
                successCallback(items);
            }
        }, errorCallback);
    }

    public readAccounts(params: any, successCallback?: (data: DataPage<Account>) => void, errorCallback?: (error: any) => void): angular.IPromise<any> {
        params = params ? params : {};
        params.user_id = params.user_id ? params.user_id : this.pipIdentity.identity ? this.pipIdentity.identity.user_id : null;

        if (!params.user_id) {
            if (errorCallback) {
                errorCallback('User not found');
                return ;
            }
        }  
        params.org_id = params.org_id ? params.org_id : this.iqsOrganization.orgId;
        return this.pipRest.getResource(this.RESOURCE_FOR_SITE).get(
            params, 
            (items: DataPage<Account>) => {

            if (successCallback) {
                successCallback(items);
            }
        }, errorCallback);
    }

    public readAccount(id: string, successCallback?: (data: Account) => void, errorCallback?: (error: any) => void): any {
        let params: any = {};
        params.user_id = this.pipIdentity.identity ? this.pipIdentity.identity.user_id : null;
        if (!params.user_id) {
            if (errorCallback) {
                errorCallback('User not found');
                return ;
            }
        }  
        params.org_id = this.iqsOrganization.orgId;      
        params.id = id;  
            this.pipRest.getResource(this.RESOURCE).get(params, (account: Account) => {
            if (successCallback) {
                successCallback(account);
            }
        }, errorCallback);
    }


    public updateAccount(id: string, data: Account, successCallback?: (data: Account) => void, errorCallback?: (error: any) => void ) {
        let params: any = {};
        params.user_id = this.pipIdentity.identity ? this.pipIdentity.identity.user_id : null;
        if (!params.user_id) {
            if (errorCallback) {
                errorCallback('User not found');
                return ;
            }
        }  
        params.org_id = this.iqsOrganization.orgId;      
        params.id = id;          
        this.pipRest.getResource(this.RESOURCE).update(params, data, (item: Account) => {
            if (successCallback) {
                successCallback(item);
            }
        }, errorCallback);
        
    }

     public saveAccount(data: Account, successCallback?: (data: Account) => void, errorCallback?: (error: any) => void ) {
        this.pipRest.getResource(this.RESOURCE).save(data, (item: Account) => {
            if (successCallback) {
                successCallback(item);
            }
        }, errorCallback);
        
    }

    public deleteAccount(id: string, successCallback?: (data: any) => void, errorCallback?: (error: any) => void) {
        let params: any = {};
        params.user_id = this.pipIdentity.identity ? this.pipIdentity.identity.user_id : null;
        if (!params.user_id) {
            if (errorCallback) {
                errorCallback('User not found');
                return ;
            }
        }  
        params.org_id = this.iqsOrganization.orgId;      
        params.id = id;          
        this.pipRest.getResource(this.RESOURCE).delete(params, null , (item) => {
            if (successCallback) {
                successCallback(item);
            }
        }, errorCallback)
    }
}

class AccountsDataProvider implements IAccountsDataProvider {
    private _service: IAccountsDataService;

    constructor() {
        "ngInject";
    }

    public $get(
        pipRest: pip.rest.IRestService,
        pipFormat: pip.services.IFormat,
        iqsOrganization: IOrganizationService,
        pipIdentity: pip.services.IIdentityService
    ) {
        "ngInject";

        if (this._service == null) {
            this._service = new AccountsDataService(pipRest, pipFormat, iqsOrganization, pipIdentity);
        }

        return this._service;
    }

}


angular
    .module('iqsAccounts.Data', ['pipRest', 'pipServices', 'iqsAccounts.Resource'])
    .provider('iqsAccountsData', AccountsDataProvider);