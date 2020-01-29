import { CreditCard } from './CreditCard';
import { DataPage } from '../DataPage';

export interface ICreditCardsDataService {
    readCreditCards(params: any, successCallback?: (data: DataPage<CreditCard>) => void, errorCallback?: (error: any) => void): angular.IPromise<any>;
    readCreditCard(params: any, successCallback?: (data: DataPage<CreditCard>) => void, errorCallback?: (error: any) => void): angular.IPromise<any>;
    createCreditCard(data: CreditCard, successCallback?: (data: CreditCard) => void, errorCallback?: (error: any) => void);
    updateCreditCard(id: string, data: CreditCard, successCallback?: (data: CreditCard) => void, errorCallback?: (error: any) => void): void;
    deleteCreditCard(id: string, customer_id?: string, successCallback?: (data: any) => void, errorCallback?: (error: any) => void);
}

export interface ICreditCardsDataProvider {

}