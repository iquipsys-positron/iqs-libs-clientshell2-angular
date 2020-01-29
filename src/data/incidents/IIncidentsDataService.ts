import { Incident } from './Incident';
import { DataPage } from '../DataPage';

export interface IIncidentsDataService {
    readIncidentsCount(successCallback?: (cnt: number) => void, errorCallback?: (error: any) => void): void;
    readIncident(id: string, successCallback?: (data: Incident) => void, errorCallback?: (error: any) => void): angular.IPromise<any>;
    readIncidents(params: any, successCallback?: (data: DataPage<Incident>) => void, errorCallback?: (error: any) => void): angular.IPromise<any>;
    createIncident(data: Incident, successCallback?: (data: Incident) => void, errorCallback?: (error: any) => void): void;
    updateIncident(id: string, data: Incident, successCallback?: (data: Incident) => void, errorCallback?: (error: any) => void): void;
    deleteIncident(id: string, successCallback?: () => void, errorCallback?: (error: any) => void): void;
}

export interface IIncidentsDataProvider extends ng.IServiceProvider {

}
