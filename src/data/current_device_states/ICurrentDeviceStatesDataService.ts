import { CurrentDeviceState } from './CurrentDeviceState';
import { DataPage } from '../DataPage';

export interface ICurrentDeviceStatesDataService {
    readCurrentDeviceState(id: string, successCallback ? : (data: CurrentDeviceState) => void, errorCallback ? : (error: any) => void): angular.IPromise<any>;
    readCurrentDeviceStates(successCallback?: (data: DataPage<CurrentDeviceState>) => void, errorCallback?: (error: any) => void): angular.IPromise<any>;
}

export interface ICurrentDeviceStatesDataProvider {

}