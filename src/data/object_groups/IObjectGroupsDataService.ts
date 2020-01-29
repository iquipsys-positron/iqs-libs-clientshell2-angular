import { ObjectGroup } from './ObjectGroup';
import { DataPage } from '../DataPage';

export interface IObjectGroupsDataService{
    readObjectGroup(id: string, successCallback?: (data: ObjectGroup) => void, errorCallback?: (error: any) => void): angular.IPromise<any>
    readObjectGroups(params: any, successCallback?: (data: DataPage<ObjectGroup>) => void, errorCallback?: (error: any) => void): angular.IPromise<any>
    createObjectGroup(data: ObjectGroup, successCallback?: (data: ObjectGroup) => void, errorCallback?: (error: any) => void): void;
    updateObjectGroup(id: string, data: ObjectGroup, successCallback?: (data: ObjectGroup) => void, errorCallback?: (error: any) => void): void;
    deleteObjectGroup(id: string, successCallback?: () => void, errorCallback?: (error: any) => void): void;
}

export interface IObjectGroupsDataProvider{

}