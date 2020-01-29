import { ISmsSettingsDataService } from './ISmsSettingsDataService';
import { SmsSettings } from './SmsSettings';
import { IOrganizationService } from '../../services';

class SmsSettingsDataService implements ISmsSettingsDataService {
    private RESOURCE: string = 'sms_settings';
    private RESOURCE_VIRIFY: string = 'verifyPhone';
    private RESOURCE_RESEND: string = 'requestPhoneVerification';

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

    private getUserLogin(): string {
        let userLogin: string = this.pipIdentity.identity && this.pipIdentity.identity.user ? this.pipIdentity.identity.user.login : null;

        return userLogin;
    }

    public readSmsSettings(params: any, successCallback?: (data: SmsSettings) => void, errorCallback?: (error: any) => void): angular.IPromise<any> {
        params = params || {};
        params.user_id = params.user_id ? params.user_id : this.getUserId();  

        return this.pipRest.getResource(this.RESOURCE).get(params, successCallback, errorCallback);
    }

    public updateSmsSettings(params: any, data: SmsSettings, successCallback?: (data: SmsSettings) => void, errorCallback?: (error: any) => void): angular.IPromise<any> {
        params = params || {};
        params.user_id = params.user_id ? params.user_id : this.getUserId(); 

        return this.pipRest.getResource(this.RESOURCE).update(params, data, successCallback, errorCallback);
    }

    // params {phone: phone, code: verify_code }
    public verifyPhone(params: any, successCallback?: (data: any) => void, errorCallback?: (error: any) => void): angular.IPromise<any> {
        params = params || {};
        params.login = params.login ? params.login : this.getUserLogin();  

        return this.pipRest.getResource(this.RESOURCE_VIRIFY).call(params, successCallback, errorCallback);
    }

    // params { phone: phone }
    public resendPhone(params: any, successCallback?: (data: any) => void, errorCallback?: (error: any) => void): angular.IPromise<any> {
        params = params || {};
        params.login = params.login ? params.login : this.getUserLogin();  
        
        return this.pipRest.getResource(this.RESOURCE_RESEND).call(params, successCallback, errorCallback);
    }
}


angular
    .module('iqsSmsSettings.Data', ['pipRest', 'pipServices', 'iqsSettings.Resource'])
    .service('iqsSmsSettingsData', SmsSettingsDataService);