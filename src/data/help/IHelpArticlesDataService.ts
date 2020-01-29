import { HelpArticle } from './HelpArticle';
import { DataPage } from '../DataPage';

export interface IHelpArticlesDataService {
    readHelpArticles(params: any, successCallback?: (data: DataPage<HelpArticle>) => void, errorCallback?: (error: any) => void): angular.IPromise<any>;
    readHelpArticle(id: any, successCallback?: (data: HelpArticle) => void, errorCallback?: (error: any) => void): angular.IPromise<any>;
}

