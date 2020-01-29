import { IEmergencyPlansDataService, IEmergencyPlansDataProvider } from './IEmergencyPlansDataService';
import { EmergencyPlan } from './EmergencyPlan';
import { DataPage } from '../DataPage';
import { IOrganizationService } from '../../services';

class EmergencyPlansDataService implements IEmergencyPlansDataService {
    private RESOURCE: string = 'emergency_plans';

    constructor(
        private pipRest: pip.rest.IRestService,
        private iqsOrganization: IOrganizationService
    ) {
        "ngInject";

    }

    public readEmergencyPlans(params: any, successCallback?: (data: DataPage<EmergencyPlan>) => void, errorCallback?: (error: any) => void): angular.IPromise<any> {
        params = params || {};
        params.org_id = params.org_id ? params.org_id : this.iqsOrganization.orgId;

        return this.pipRest.getResource(this.RESOURCE).page(params, successCallback, errorCallback);
    }

    public readEmergencyPlan(id: string, successCallback?: (data: EmergencyPlan) => void, errorCallback?: (error: any) => void): angular.IPromise<any> {
        return this.pipRest.getResource(this.RESOURCE).get(
            {
                plan_id: id,
                org_id: this.iqsOrganization.orgId
            },
            successCallback, errorCallback);
    }

    public createEmergencyPlan(data: EmergencyPlan, successCallback?: (data: EmergencyPlan) => void, errorCallback?: (error: any) => void): void {
        this.pipRest.getResource(this.RESOURCE).save(
            { org_id: this.iqsOrganization.orgId },
            data,
            successCallback,
            errorCallback
        );
    }

    public updateEmergencyPlan(id: string, data: EmergencyPlan, successCallback?: (data: EmergencyPlan) => void, errorCallback?: (error: any) => void): void {
        this.pipRest.getResource(this.RESOURCE).update(
            {
                plan_id: id,
                org_id: this.iqsOrganization.orgId
            },
            data,
            successCallback,
            errorCallback
        );
    }

    public deleteEmergencyPlan(id: string, successCallback?: () => void, errorCallback?: (error: any) => void): void {
        this.pipRest.getResource(this.RESOURCE).remove(
            {
                plan_id: id,
                org_id: this.iqsOrganization.orgId
            },
            null,
            successCallback,
            errorCallback
        );
    }

}


class EmergencyPlansDataProvider implements IEmergencyPlansDataProvider {
    private _service: IEmergencyPlansDataService;

    constructor() {
        "ngInject";
    }

    public $get(
        pipRest: pip.rest.IRestService,
        iqsOrganization: IOrganizationService,
    ) {
        "ngInject";

        if (this._service == null) {
            this._service = new EmergencyPlansDataService(pipRest, iqsOrganization);
        }

        return this._service;
    }

}


angular
    .module('iqsEmergencyPlans.Data', ['pipRest', 'pipServices', 'iqsEmergencyPlans.Resource'])
    .provider('iqsEmergencyPlansData', EmergencyPlansDataProvider);
