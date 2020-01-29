import { CurrentObjectRoute } from './CurrentObjectRoute';
import { DataPage } from '../DataPage';

export interface ICurrentObjectRoutesDataService {
    readObjectsPositions(params: any, successCallback?: (data: DataPage<CurrentObjectRoute>) => void, errorCallback?: (error: any) => void): angular.IPromise<any>;
    readObjectPositions(params: any, successCallback?: (data: CurrentObjectRoute) => void, errorCallback?: (error: any) => void): angular.IPromise<any>;
    readAllObjectsPositions(params: any, successCallback?: (data: CurrentObjectRoute[]) => void, errorCallback?: (error: any) => void): void;
}

export interface ICurrentObjectRoutesDataProvider {
    
}