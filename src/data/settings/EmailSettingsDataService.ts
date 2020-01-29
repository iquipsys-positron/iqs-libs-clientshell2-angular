import { IEmailSettingsDataService } from './IEmailSettingsDataService';
import { EmailSettings } from './EmailSettings';
import { IOrganizationService } from '../../services';

class EmailSettingsDataService implements IEmailSettingsDataService {
    private RESOURCE: string = 'email_settings';
    private RESOURCE_VIRIFY: string = 'verifyEmail';
    private RESOURCE_RESEND: string = 'requestEmailVerification';

    constructor( 
        private pipRest: pip.rest.IRestService, 
        private iqsOrganization: IOrganizationService, 
        private pipIdentity: pip.services.IIdentityService
    ) {
        "ngInject";
    }

    private getUserId(): string {
        let userId: string = this.pipIdentity.identity ? this.pipIdentity.identity.user_id : null;

        return userId;
    }

    private getUserEmail(): string {
        let userEmail: string = this.pipIdentity.identity && this.pipIdentity.identity.user ? this.pipIdentity.identity.user.email : this.pipIdentity.identity.user.login;

        return userEmail;
    }

    private getUserLogin(): string {
        let userLogin: string = this.pipIdentity.identity && this.pipIdentity.identity.user ? this.pipIdentity.identity.user.login : null;

        return userLogin;
    }

    public readEmailSettings(params: any, successCallback?: (data: any) => void, errorCallback?: (error: any) => void): angular.IPromise<any> {
        params = params || {};
        params.user_id = params.user_id ? params.user_id : this.getUserId();  

        return this.pipRest.getResource(this.RESOURCE).get(params, successCallback, errorCallback);
    }

    public updateEmailSettings(params: any, data: EmailSettings, successCallback?: (data: any) => void, errorCallback?: (error: any) => void): angular.IPromise<any> {
        params = params || {};
        params.user_id = params.user_id ? params.user_id : this.getUserId();  

        return this.pipRest.getResource(this.RESOURCE).update(params, data, successCallback, errorCallback);
    }

    // params {email: email, code: verify_code }
    public verifyEmail(params: any, successCallback?: (data: any) => void, errorCallback?: (error: any) => void): angular.IPromise<any> {
        params = params || {};
        params.login = params.login ? params.login : this.getUserLogin();  
        
        return this.pipRest.getResource(this.RESOURCE_VIRIFY).call(params, successCallback, errorCallback);
    }

    // params { login: email }
    public resendEmail(params: any, successCallback?: (data: any) => void, errorCallback?: (error: any) => void): angular.IPromise<any> {
        params = params || {};
        params.email = params.email ? params.email : this.getUserEmail();  
        params.login = params.login ? params.login : this.getUserLogin();
        
        return this.pipRest.getResource(this.RESOURCE_RESEND).call(params, successCallback, errorCallback);
    }
}


angular
    .module('iqsEmailSettings.Data', ['pipRest', 'pipServices', 'iqsSettings.Resource'])
    .service('iqsEmailSettingsData', EmailSettingsDataService);