import { IHelpTopicsDataService } from './IHelpTopicsDataService';
import { HelpTopic } from './HelpTopic';
import { DataPage } from '../DataPage';
import { IOrganizationService } from '../../services';

class HelpTopicsDataService implements IHelpTopicsDataService {
    private RESOURCE: string = 'help_topics';
    private APP_NAME: string = 'Positron';

    constructor(
        private pipRest: pip.rest.IRestService,
        private iqsOrganization: IOrganizationService
    ) {
        "ngInject";
    }


    public readHelpTopics(params: any, successCallback?: (data: DataPage<HelpTopic>) => void, errorCallback?: (error: any) => void): angular.IPromise<any> {

        return this.pipRest.getResource(this.RESOURCE).get(params, successCallback, errorCallback);
    }

    public readHelpTopic(id: any, successCallback?: (data: HelpTopic) => void, errorCallback?: (error: any) => void): angular.IPromise<any> {
        let params = {
            topic_id: id
        };

        return this.pipRest.getResource(this.RESOURCE).get(params, successCallback, errorCallback);
    }

    public createHelpTopic(data: HelpTopic, successCallback?: (data: HelpTopic) => void, errorCallback?: (error: any) => void): void {
        this.pipRest.getResource(this.RESOURCE).save(
            null,
            data,
            successCallback,
            errorCallback
        );
    }

}


angular
    .module('iqsHelpTopics.Data', ['pipRest', 'pipServices', 'iqsHelpTopics.Resource'])
    .service('iqsHelpTopicsData', HelpTopicsDataService);