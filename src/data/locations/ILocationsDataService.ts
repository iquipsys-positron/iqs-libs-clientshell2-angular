import { Location } from './Location';
import { DataPage } from '../DataPage';

export interface ILocationsDataService{
    readLocation(id: string, successCallback?: (data: Location) => void, errorCallback?: (error: any) => void): angular.IPromise<any>
    readLocations(params: any, successCallback?: (data: DataPage<Location>) => void, errorCallback?: (error: any) => void): angular.IPromise<any>
    createLocation(data: Location, successCallback?: (data: Location) => void, errorCallback?: (error: any) => void): void;
    updateLocation(id: string, data: Location, successCallback?: (data: Location) => void, errorCallback?: (error: any) => void): void;
    deleteLocation(id: string, successCallback?: () => void, errorCallback?: (error: any) => void): void;
}

export interface ILocationsDataProvider{

}