import { Application } from './Application';
import { DataPage } from '../DataPage';

export interface IApplicationsDataService {
    readApplications(params: any, successCallback?: (data: DataPage<Application>) => void, errorCallback?: (error: any) => void): angular.IPromise<any>;
    readApplication(id: string, successCallback?: (data: Application) => void, errorCallback?: (error: any) => void): any;
    saveApplication(data: Application, successCallback?: (data: Application) => void, errorCallback?: (error: any) => void);
    updateApplication(id: string, data: Application, successCallback?: (data: Application) => void, errorCallback?: (error: any) => void);
    deleteApplication(id: string, successCallback?: (data: any) => void, errorCallback?: (error: any) => void);
}

export interface IApplicationsDataProvider {

}