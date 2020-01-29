import { Beacon } from './Beacon';
import { DataPage } from '../DataPage';

export interface IBeaconsDataService {
    readBeacon(params: any, successCallback?: (data: Beacon) => void, errorCallback?: (error: any) => void): angular.IPromise<any>;
    readBeacons(params: any, successCallback?: (data: DataPage<Beacon>) => void, errorCallback?: (error: any) => void): angular.IPromise<any>;
    createBeacon(data: Beacon, successCallback?: (data: Beacon) => void, errorCallback?: (error: any) => void): void;
    updateBeacon(id: string, data: Beacon, successCallback?: (data: Beacon) => void, errorCallback?: (error: any) => void): void;
    deleteBeacon(id: string, successCallback?: () => void, errorCallback?: (error: any) => void): void;
    
    verifyBeaconUdi(params: any, successCallback?: (data: any) => void, errorCallback?: (error: any) => void): void;
    calculatePosition(params: any, successCallback?: (data?: any) => void, errorCallback?: (error?: any) => void): void;
}

export interface IBeaconsDataProvider extends ng.IServiceProvider {

}
