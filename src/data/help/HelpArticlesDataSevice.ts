import { IHelpArticlesDataService } from './IHelpArticlesDataService';
import { HelpArticle } from './HelpArticle';
import { DataPage } from '../DataPage';
import { IOrganizationService } from '../../services';

class HelpArticlesDataService implements IHelpArticlesDataService {
    private RESOURCE: string = 'help_articles';
    private RESOURCE_RANDOM: string = 'help_article_random';
    private APP_NAME: string = 'Positron';

    constructor( 
        private pipRest: pip.rest.IRestService, 
        private iqsOrganization: IOrganizationService
    ) {
        "ngInject";
    }

  
    public readHelpArticles(params: any, successCallback?: (data: DataPage<HelpArticle>) => void, errorCallback?: (error: any) => void): angular.IPromise<any> {

        return this.pipRest.getResource(this.RESOURCE).get(params, successCallback, errorCallback);
    }

    public readHelpArticleRandom(successCallback?: (data: HelpArticle) => void, errorCallback?: (error: any) => void): angular.IPromise<any> {

        return this.pipRest.getResource(this.RESOURCE).get(null, successCallback, errorCallback);
    }

    public readHelpArticle(id: any, successCallback?: (data: HelpArticle) => void, errorCallback?: (error: any) => void): angular.IPromise<any> {
        let params = {
            topic_id: id
        };

        return this.pipRest.getResource(this.RESOURCE).get(params, successCallback, errorCallback);
    }
}


angular
    .module('iqsHelpArticles.Data', ['pipRest', 'pipServices', 'iqsHelpArticles.Resource'])
    .service('iqsHelpArticlesData', HelpArticlesDataService);