import { OperationalEvent } from './OperationalEvent';
import { DataPage } from '../DataPage';

export interface IOperationalEventsDataService {
    readOperationalEvents(params: any, successCallback?: (data: DataPage<OperationalEvent>) => void, errorCallback?: (error: any) => void): angular.IPromise<any>;
    // readOperationalEvent(id: string, successCallback?: (data: OperationalEvent) => void, errorCallback?: (error: any) => void): angular.IPromise<any>;
    createOperationalEvent(data: OperationalEvent, successCallback?: (data: OperationalEvent) => void, errorCallback?: (error: any) => void): void;
    deleteOperationalEvent(id: string, successCallback?: () => void, errorCallback?: (error: any) => void): void;
}

export interface IOperationalEventsDataProvider extends ng.IServiceProvider {

}
