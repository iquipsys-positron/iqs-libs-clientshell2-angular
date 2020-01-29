import { Signal } from './Signal';
import { DataPage } from '../DataPage';

export interface ISignalsDataService {
    readSignals(params: any, successCallback?: (data: DataPage<Signal>) => void, errorCallback?: (error: any) => void): angular.IPromise<any>;
    saveSignal(data: Signal, successCallback?: (data: Signal) => void, errorCallback?: (error: any) => void);
    deleteSignal(id: string, successCallback?: (data: any) => void, errorCallback?: (error: any) => void);
    lockSignal(params: any, successCallback?: (data?: any) => void, errorCallback?: (error?: any) => void): void;
    closeSignal(params: any, successCallback?: (data?: any) => void, errorCallback?: (error?: any) => void): void;
}

export interface ISignalsDataProvider {

}