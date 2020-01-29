import {
    IEventRulesDataService,
    IEventRulesDataProvider
} from './IEventRulesDataService';
import { EventRule } from './EventRule';
import { DataPage } from '../DataPage';
import { IOrganizationService } from '../../services';

class EventRulesDataService implements IEventRulesDataService {
    private RESOURCE: string = 'event_rules';

    constructor(
        private pipRest: pip.rest.IRestService,
        private iqsOrganization: IOrganizationService
    ) {
        "ngInject";
    }

    public readEventRules(params: any, successCallback?: (data: DataPage<EventRule>) => void, errorCallback?: (error: any) => void): angular.IPromise<any> {
        params = params || {};
        params.org_id = params.org_id ? params.org_id : this.iqsOrganization.orgId;

        return this.pipRest.getResource(this.RESOURCE).page(params, successCallback, errorCallback);
    }

    public readEventRule(id: string, successCallback?: (data: EventRule) => void, errorCallback?: (error: any) => void): angular.IPromise<any> {
        return this.pipRest.getResource(this.RESOURCE).get(
            {
                event_rule_id: id,
                org_id: this.iqsOrganization.orgId
            },
            successCallback, errorCallback);
    }

    public createEventRule(data: EventRule, successCallback?: (data: EventRule) => void, errorCallback?: (error: any) => void): void {
        this.pipRest.getResource(this.RESOURCE).save(
            {
                org_id: this.iqsOrganization.orgId
            },
            data,
            successCallback,
            errorCallback
        );
    }

    public updateEventRule(id: string, data: EventRule, successCallback?: (data: EventRule) => void, errorCallback?: (error: any) => void): void {
        this.pipRest.getResource(this.RESOURCE).update(
            {
                event_rule_id: id,
                org_id: this.iqsOrganization.orgId
            },
            data,
            successCallback,
            errorCallback
        );
    }

    public deleteEventRule(id: string, successCallback?: () => void, errorCallback?: (error: any) => void): void {
        this.pipRest.getResource(this.RESOURCE).remove(
            {
                event_rule_id: id,
                org_id: this.iqsOrganization.orgId
            },
            null,
            successCallback,
            errorCallback
        );
    }
}


class EventRulesDataProvider implements IEventRulesDataProvider {
    private _service: IEventRulesDataService;

    constructor() {
        "ngInject";
    }

    public $get(
        pipRest: pip.rest.IRestService,
        iqsOrganization: IOrganizationService
    ) {
        "ngInject";

        if (this._service == null) {
            this._service = new EventRulesDataService(pipRest, iqsOrganization);
        }

        return this._service;
    }

}


angular
    .module('iqsEventRules.Data', ['pipRest', 'pipServices', 'iqsEventRules.Resource'])
    .provider('iqsEventRulesData', EventRulesDataProvider);