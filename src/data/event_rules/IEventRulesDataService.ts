import { EventRule } from './EventRule';
import { DataPage } from '../DataPage';

export interface IEventRulesDataService {
    readEventRules(params: any, successCallback?: (data: DataPage<EventRule>) => void, errorCallback?: (error: any) => void): angular.IPromise<any>;
    createEventRule(data: EventRule, successCallback?: (data: EventRule) => void, errorCallback?: (error: any) => void): void;
    readEventRule(id: string, successCallback?: (data: EventRule) => void, errorCallback?: (error: any) => void): angular.IPromise<any>;
    updateEventRule(id: string, data: EventRule, successCallback?: (data: EventRule) => void, errorCallback?: (error: any) => void): void;
    deleteEventRule(id: string, successCallback?: () => void, errorCallback?: (error: any) => void): void;
}

export interface IEventRulesDataProvider {

}


