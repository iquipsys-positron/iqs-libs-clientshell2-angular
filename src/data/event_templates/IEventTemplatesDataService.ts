import { EventTemplate } from './EventTemplate';
import { DataPage } from '../DataPage';

export interface IEventTemplatesDataService {
    readEventTemplate(id: string, successCallback?: (data: EventTemplate) => void, errorCallback?: (error: any) => void): angular.IPromise<any>
    readEventTemplates(params: any, successCallback?: (data: DataPage<EventTemplate>) => void, errorCallback?: (error: any) => void): angular.IPromise<any>
    createEventTemplate(data: EventTemplate, successCallback?: (data: EventTemplate) => void, errorCallback?: (error: any) => void): void;
    updateEventTemplate(id: string, data: EventTemplate, successCallback?: (data: EventTemplate) => void, errorCallback?: (error: any) => void): void;
    deleteEventTemplate(id: string, successCallback?: () => void, errorCallback?: (error: any) => void): void;
}

export interface IEventTemplatesDataProvider extends ng.IServiceProvider {

}
