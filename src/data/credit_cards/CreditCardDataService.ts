import { ICreditCardsDataService } from './ICreditCardsDataService';
import { CreditCard } from './CreditCard';
import { DataPage } from '../DataPage';
import { IOrganizationService } from '../../services';

class CreditCardsDataService implements ICreditCardsDataService {
    private RESOURCE: string = 'credit_cards';

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

    public readCreditCards(params: any, successCallback?: (data: DataPage<CreditCard>) => void, errorCallback?: (error: any) => void): angular.IPromise<any> {
        params = params || {};
        params.customer_id = params.customer_id ? params.customer_id : this.iqsOrganization.orgId;

        return this.pipRest.getResource(this.RESOURCE).get(
            params,
            (data: DataPage<CreditCard>) => {
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

    public readCreditCard(params: any, successCallback?: (data: DataPage<CreditCard>) => void, errorCallback?: (error: any) => void): angular.IPromise<any> {
        params = params || {};
        params.customer_id = params.customer_id ? params.customer_id : this.iqsOrganization.orgId;

        return this.pipRest.getResource(this.RESOURCE).get(
            params,
            (data: DataPage<CreditCard>) => {
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

    public createCreditCard(data: CreditCard, successCallback?: (data: CreditCard) => void, errorCallback?: (error: any) => void) {
        if (!data) return;

        data.customer_id = data.customer_id ? data.customer_id : this.iqsOrganization.orgId;

        this.pipRest.getResource(this.RESOURCE).save(
            {
                customer_id: data.customer_id
            },
            data,
            (item: CreditCard) => {
                if (successCallback) {
                    successCallback(item);
                }

                return item;
            }, errorCallback);
    }

    public updateCreditCard(id: string, data: CreditCard, successCallback?: (data: CreditCard) => void, errorCallback?: (error: any) => void): void {
        data.customer_id = data.customer_id ? data.customer_id : this.iqsOrganization.orgId;
        this.pipRest.getResource(this.RESOURCE).update(
            {
                card_id: id,
                org_id: data.customer_id
            },
            data,
            successCallback,
            errorCallback
        );
    }

    public deleteCreditCard(id: string, customer_id?: string, successCallback?: (data: any) => void, errorCallback?: (error: any) => void) {
        customer_id = customer_id ? customer_id : this.iqsOrganization.orgId;
        this.pipRest.getResource(this.RESOURCE).delete(
            {
                card_id: id,
                customer_id: customer_id
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
    .module('iqsCreditCards.Data', ['pipRest', 'pipServices', 'iqsCreditCards.Resource'])
    .service('iqsCreditCardsData', CreditCardsDataService);