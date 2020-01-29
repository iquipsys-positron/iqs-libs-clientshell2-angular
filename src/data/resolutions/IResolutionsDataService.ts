import { Resolution } from './Resolution';
import { DataPage } from '../DataPage';

export interface IResolutionsDataService{
    readResolution(id: string, successCallback?: (data: Resolution) => void, errorCallback?: (error: any) => void): angular.IPromise<any>
    readResolutions(params: any, successCallback?: (data: DataPage<Resolution>) => void, errorCallback?: (error: any) => void): angular.IPromise<any>
    createResolution(data: Resolution, successCallback?: (data: Resolution) => void, errorCallback?: (error: any) => void): void;
    updateResolution(id: string, data: Resolution, successCallback?: (data: Resolution) => void, errorCallback?: (error: any) => void): void;
    deleteResolution(id: string, successCallback?: () => void, errorCallback?: (error: any) => void): void;
}

export interface IResolutionsDataProvider{

}