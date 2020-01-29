import { IEventTemplatesDataService, IEventTemplatesDataProvider } from './IEventTemplatesDataService';
import { EventTemplate } from './EventTemplate';
import { DataPage } from '../DataPage';
import { IOrganizationService } from '../../services';

class EventTemplatesDataService implements IEventTemplatesDataService {
    private RESOURCE: string = 'event_templates';

    constructor(
        private pipRest: pip.rest.IRestService,
        private iqsOrganization: IOrganizationService,
    ) {
        "ngInject";

    }

    public readEventTemplates(params: any, successCallback?: (data: DataPage<EventTemplate>) => void, errorCallback?: (error: any) => void): angular.IPromise<any> {
        params = params || {};
        params.org_id = params.org_id ? params.org_id : this.iqsOrganization.orgId;

        return this.pipRest.getResource(this.RESOURCE).page(params, successCallback, errorCallback);
    }

    public readEventTemplate(id: string, successCallback?: (data: EventTemplate) => void, errorCallback?: (error: any) => void): angular.IPromise<any> {
        return this.pipRest.getResource(this.RESOURCE).get(
            {
                template_id: id,
                org_id: this.iqsOrganization.orgId
            },
            successCallback, errorCallback);
    }

    public createEventTemplate(data: EventTemplate, successCallback?: (data: EventTemplate) => void, errorCallback?: (error: any) => void): void {
        this.pipRest.getResource(this.RESOURCE).save(
            { org_id: this.iqsOrganization.orgId },
            data,
            successCallback,
            errorCallback
        );
    }

    public updateEventTemplate(id: string, data: EventTemplate, successCallback?: (data: EventTemplate) => void, errorCallback?: (error: any) => void): void {
        this.pipRest.getResource(this.RESOURCE).update(
            {
                template_id: id,
                org_id: this.iqsOrganization.orgId
            },
            data,
            successCallback,
            errorCallback
        );
    }

    public deleteEventTemplate(id: string, successCallback?: () => void, errorCallback?: (error: any) => void): void {
        this.pipRest.getResource(this.RESOURCE).remove(
            {
                template_id: id,
                org_id: this.iqsOrganization.orgId
            },
            null,
            successCallback,
            errorCallback
        );
    }
}


class EventTemplatesDataProvider implements IEventTemplatesDataProvider {
    private _service: IEventTemplatesDataService;

    constructor() {
        "ngInject";
    }

    public $get(
        pipRest: pip.rest.IRestService,
        iqsOrganization: IOrganizationService
    ) {
        "ngInject";

        if (this._service == null) {
            this._service = new EventTemplatesDataService(pipRest, iqsOrganization);
        }

        return this._service;
    }

}


angular
    .module('iqsEventTemplates.Data', ['pipRest', 'pipServices', 'iqsEventTemplates.Resource'])
    .provider('iqsEventTemplatesData', EventTemplatesDataProvider);
