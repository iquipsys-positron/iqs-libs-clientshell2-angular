import { Correction } from './Correction';
import { DataPage } from '../DataPage';

export interface ICorrectionsDataService {
    readCorrection(id: string, successCallback?: (data: Correction) => void, errorCallback?: (error: any) => void): angular.IPromise<any>
    readCorrections(params: any, successCallback?: (data: DataPage<Correction>) => void, errorCallback?: (error: any) => void): angular.IPromise<any>
    createCorrection(data: Correction, successCallback?: (data: Correction) => void, errorCallback?: (error: any) => void): void;
    updateCorrection(id: string, data: Correction, successCallback?: (data: Correction) => void, errorCallback?: (error: any) => void): void;
    deleteCorrection(id: string, successCallback?: () => void, errorCallback?: (error: any) => void): void;
}

export interface ICorrectionsDataProvider extends ng.IServiceProvider {

}
