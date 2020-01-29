import { Agreement } from './Agreement';
import { DataPage } from '../DataPage';

export interface IAgreementsDataService {
    readAgreements(params: any, successCallback?: (data: DataPage<Agreement>) => void, errorCallback?: (error: any) => void): angular.IPromise<any>;
    readAgreement(params: any, successCallback?: (data: DataPage<Agreement>) => void, errorCallback?: (error: any) => void): angular.IPromise<any>;
    createAgreement(data: Agreement, successCallback?: (data: Agreement) => void, errorCallback?: (error: any) => void);
    updateAgreement(id: string, data: Agreement, successCallback?: (data: Agreement) => void, errorCallback?: (error: any) => void): void;
    deleteAgreement(id: string, customer_id?: string, successCallback?: (data: any) => void, errorCallback?: (error: any) => void);
    verifyAgreement(number: string, successCallback?: (data: DataPage<Agreement>) => void, errorCallback?: (error: any) => void): void;
}

export interface IAgreementsDataProvider {

}