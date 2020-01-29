
import { HelpTopic } from './HelpTopic';
import { DataPage } from '../DataPage';

export interface IHelpTopicsDataService {
    readHelpTopics(params: any, successCallback?: (data: DataPage<HelpTopic>) => void, errorCallback?: (error: any) => void): angular.IPromise<any>;
    readHelpTopic(id: any, successCallback?: (data: HelpTopic) => void, errorCallback?: (error: any) => void): angular.IPromise<any>;
    createHelpTopic(data: HelpTopic, successCallback?: (data: HelpTopic) => void, errorCallback?: (error: any) => void): void;
}

