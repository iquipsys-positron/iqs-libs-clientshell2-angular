import { SmsSettings } from './SmsSettings';

export interface ISmsSettingsDataService {
    readSmsSettings(params: any, successCallback?: (data: SmsSettings) => void, errorCallback?: (error: any) => void): angular.IPromise<any>;
    updateSmsSettings(params: any, data: SmsSettings, successCallback?: (data: SmsSettings) => void, errorCallback?: (error: any) => void): angular.IPromise<any>;
    verifyPhone(params: any, successCallback?: (data: any) => void, errorCallback?: (error: any) => void): angular.IPromise<any>;
    resendPhone(params: any, successCallback?: (data: any) => void, errorCallback?: (error: any) => void): angular.IPromise<any>;
}
