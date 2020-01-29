import { ObjectPositions } from './ObjectPositions';
import { DataPage } from '../DataPage';

export interface IObjectPositionsDataService {
    readObjectsPositions(params: any, successCallback?: (data: DataPage<ObjectPositions>) => void, errorCallback?: (error: any) => void): angular.IPromise<any>;
    readObjectPositions(params: any, successCallback?: (data: DataPage<ObjectPositions>) => void, errorCallback?: (error: any) => void): void;
    getObjectsPositionsCount(params: any, successCallback?: (data: number) => void, errorCallback?: (error: any) => void): angular.IPromise<any>;
}

export interface IObjectPositionsDataProvider {

}