import { IAgreementsDataService, IAgreementsDataProvider } from './IAgreementsDataService';
import { Agreement } from './Agreement';
import { DataPage } from '../DataPage';
import { IOrganizationService } from '../../services';

class AgreementsDataService implements IAgreementsDataService {
    private RESOURCE: string = 'agreements';
    private RESOURCE_VERIFY: string = 'agreement_verify';

    private PAGE_SIZE: number = 100;
    private PAGE_START: number = 0;
    private PAGE_TOTAL: boolean = true;

    constructor(
        private pipRest: pip.rest.IRestService,
        private iqsOrganization: IOrganizationService,
        private $http: ng.IHttpService
    ) {
        "ngInject";
    }

    public readAgreements(params: any, successCallback?: (data: DataPage<Agreement>) => void, errorCallback?: (error: any) => void): angular.IPromise<any> {
        params = params || {};
        params.customer_id = params.customer_id ? params.customer_id : this.iqsOrganization.orgId;

        return this.pipRest.getResource(this.RESOURCE).get(
            params,
            (data: DataPage<Agreement>) => {
                if (params.type) {
                    if (successCallback) {
                        successCallback(data);
                    }
                }
                if (successCallback) {
                    successCallback(data);
                }
            },
            errorCallback);
    }

    public readAgreement(params: any, successCallback?: (data: DataPage<Agreement>) => void, errorCallback?: (error: any) => void): angular.IPromise<any> {
        params = params || {};
        params.customer_id = params.customer_id ? params.customer_id : this.iqsOrganization.orgId;

        return this.pipRest.getResource(this.RESOURCE).get(
            params,
            (data: DataPage<Agreement>) => {
                if (params.type) {
                    if (successCallback) {
                        successCallback(data);
                    }
                }
                if (successCallback) {
                    successCallback(data);
                }
            },
            errorCallback);
    }

    // number: number
    public verifyAgreement(number: string, successCallback?: (data: DataPage<Agreement>) => void, errorCallback?: (error: any) => void): void {
        let url: string = this.pipRest.serverUrl + '/api/v1/agreements/verify';
        let params: any = {
            number: number
        };

        this.$http({
            method: "GET",
            url: url,
            params
        })
            .success((data: any) => {
                if (successCallback) successCallback(data);
            })
            .error((error: any) => {
                if (errorCallback) errorCallback(error);
            });
    }

    public createAgreement(data: Agreement, successCallback?: (data: Agreement) => void, errorCallback?: (error: any) => void) {
        if (!data) return;

        // data.customer_id = data.customer_id ? data.customer_id : this.iqsOrganization.orgId;

        this.pipRest.getResource(this.RESOURCE).save(
            null,
            // {
            //     customer_id: data.customer_id
            // },
            data,
            (item: Agreement) => {
                if (successCallback) {
                    successCallback(item);
                }

                return item;
            }, errorCallback);
    }

    public updateAgreement(id: string, data: Agreement, successCallback?: (data: Agreement) => void, errorCallback?: (error: any) => void): void {
        // data.customer_id = data.customer_id ? data.customer_id : this.iqsOrganization.orgId;
        this.pipRest.getResource(this.RESOURCE).update(
            {
                agreement_id: id,
                // org_id: data.customer_id
            },
            data,
            successCallback,
            errorCallback
        );
    }

    public deleteAgreement(id: string, customer_id?: string, successCallback?: (data: any) => void, errorCallback?: (error: any) => void) {
        // customer_id = customer_id ? customer_id : this.iqsOrganization.orgId;
        this.pipRest.getResource(this.RESOURCE).delete(
            {
                agreement_id: id,
                // customer_id: customer_id
            },
            null, (data) => {
                if (successCallback) {
                    successCallback(data);
                }

                return data;
            }, errorCallback)
    }
}

angular
    .module('iqsAgreements.Data', ['pipRest', 'pipServices', 'iqsAgreements.Resource'])
    .service('iqsAgreementsData', AgreementsDataService);