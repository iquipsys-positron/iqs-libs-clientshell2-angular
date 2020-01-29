import { ObjectRoute } from './ObjectRoute';
import { DataPage } from '../DataPage';

export interface IObjectRoutesDataService {
    readObjectsPositions(params: any, successCallback?: (data: DataPage<ObjectRoute>) => void, errorCallback?: (error: any) => void): angular.IPromise<any>;
    readObjectPositions(params: any, successCallback?: (data: any) => void, errorCallback?: (error: any) => void): angular.IPromise<any>;
    readAllObjectsPositions(params: any, successCallback?: (data: ObjectRoute[]) => void, errorCallback?: (error: any) => void): void;
}

export interface IObjectRoutesDataProvider {
    
}