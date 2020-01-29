import { EmailSettings } from './EmailSettings';

export interface IEmailSettingsDataService {
    readEmailSettings(params: any, successCallback?: (data: any) => void, errorCallback?: (error: any) => void): angular.IPromise<any>;
    updateEmailSettings(params: any, data: EmailSettings, successCallback?: (data: any) => void, errorCallback?: (error: any) => void): angular.IPromise<any>;
    verifyEmail(params: any, successCallback?: (data: any) => void, errorCallback?: (error: any) => void): angular.IPromise<any>;
    resendEmail(params: any, successCallback?: (data: any) => void, errorCallback?: (error: any) => void): angular.IPromise<any>;
}

