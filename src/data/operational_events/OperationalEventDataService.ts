import { IOperationalEventsDataService, IOperationalEventsDataProvider } from './IOperationalEventDataService';
import { OperationalEvent } from './OperationalEvent';
import { DataPage } from '../DataPage';
import { IOrganizationService } from '../../services';

class OperationalEventsDataService implements IOperationalEventsDataService {
    private RESOURCE: string = 'operational_events';

    private PAGE_SIZE: number = 100;
    private PAGE_START: number = 0;
    private PAGE_TOTAL: boolean = true;

    constructor(
        private pipRest: pip.rest.IRestService,
        private pipFormat: pip.services.IFormat,
        private iqsOrganization: IOrganizationService,
    ) {
        "ngInject";

    }

    public filterToString(filter: any): string {
        if (filter == null) return null;
        let result = '';

        for (let key in filter) {
            if (result.length > 0)
                result += ';';

            let value = filter[key];
            if (value != null) {
                if (_.isArray(value)) {
                    result += key + '=' + this.arrayToString(<string[]>value);
                } else {
                    result += key + '=' + value
                }
            }

            else
                result += key
        }

        return result;
    }

    public arrayToString(array: string[]): string {
        let result = '';

        if (array == null || array.length == 0)
            return result;

        for (let i = 0; i < array.length; i++) {
            if (result.length > 0)
                result += ',';
            result += array[i]
        }

        return result;
    }

    public readOperationalEvents(params: any, successCallback?: (data: DataPage<OperationalEvent>) => void, errorCallback?: (error: any) => void): angular.IPromise<any> {
        params = params || {};
        params.org_id = params.org_id ? params.org_id : this.iqsOrganization.orgId;

        return this.pipRest.getResource(this.RESOURCE).page(params, successCallback, errorCallback);
    }

    public createOperationalEvent(data: OperationalEvent, successCallback?: (data: OperationalEvent) => void, errorCallback?: (error: any) => void): void {
        this.pipRest.getResource(this.RESOURCE).save(
            { org_id: this.iqsOrganization.orgId }, // null
            data,
            successCallback,
            errorCallback
        );
    }

    public deleteOperationalEvent(id: string, successCallback?: () => void, errorCallback?: (error: any) => void): void {
        this.pipRest.getResource(this.RESOURCE).remove(
            {
                event_id: id,
                org_id: this.iqsOrganization.orgId
            },
            null,
            successCallback,
            errorCallback
        );
    }

}


class OperationalEventsDataProvider implements IOperationalEventsDataProvider {
    private _service: IOperationalEventsDataService;

    constructor() {
        "ngInject";
    }

    public $get(
        pipRest: pip.rest.IRestService,
        pipFormat: pip.services.IFormat,
        iqsOrganization: IOrganizationService,
    ) {
        "ngInject";

        if (this._service == null) {
            this._service = new OperationalEventsDataService(pipRest, pipFormat, iqsOrganization);
        }

        return this._service;
    }

}


angular
    .module('iqsOperationalEvents.Data', ['pipRest', 'pipServices', 'iqsOperationalEvents.Resource'])
    .provider('iqsOperationalEventsData', OperationalEventsDataProvider);
