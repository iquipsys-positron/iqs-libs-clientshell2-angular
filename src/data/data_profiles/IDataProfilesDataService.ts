import { DataProfile } from './DataProfile';

export interface IDataProfilesDataService {
    readDataProfiles(successCallback ? : (data: DataProfile) => void, errorCallback ? : (error: any) => void): angular.IPromise<any>;
}

export interface IDataProfilesDataProvider {
    
}