import { Activity } from './Activity';

export interface IActivitiesDataService {
    readActivities(id: string, params: any, successCallback?: (data: any) => void, errorCallback?: (error: any) => void): angular.IPromise<any>;
    createActivity(data: Activity, successCallback?: (data: Activity) => void, errorCallback?: (error: any) => void): void;
    readActivity(id: string, successCallback?: (data: Activity) => void, errorCallback?: (error: any) => void): angular.IPromise<any>;
    updateActivity(id: string, data: Activity, successCallback?: (data: Activity) => void, errorCallback?: (error: any) => void): void;
    deleteActivity(id: string, successCallback?: () => void, errorCallback?: (error: any) => void): void;
    removeActivity(params, successCallback?: any, errorCallback?: any);
}

export interface IActivitiesDataProvider {

}


