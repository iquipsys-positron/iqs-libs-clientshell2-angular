import { OrganizationsModel } from './OrganizationsModel';
import { IOrganizationsViewModel } from './IOrganizationsViewModel';

import { States } from '../../common';
import { Organization } from '../../data/organizations/Organization';
import { IOrganizationsDataService } from '../../data/organizations/IOrganizationsDataService';

class OrganizationsViewModel implements IOrganizationsViewModel {
    public model: OrganizationsModel;

    constructor(
        pipTransaction: pip.services.ITransactionService,
        $location: ng.ILocationService,
        pipRest: pip.rest.IRestService,
        pipIdentity: pip.services.IIdentityService,
        private iqsOrganizationsData: IOrganizationsDataService
    ) {

        this.model = new OrganizationsModel(pipTransaction, $location, iqsOrganizationsData, pipRest, pipIdentity);
    }

    public initOrganizations(successCallback?: (data: Organization[]) => void, errorCallback?: (error: any) => void) {
        this.model.getOrganizations(successCallback, errorCallback);
    }

    public generateCode(id: string, successCallback?: (data) => void, errorCallback?: (error: any) => void) {
        this.iqsOrganizationsData.generateCode(id, successCallback, errorCallback);
    }

    public get state(): string {
        return this.model.state;
    }

    public get organizations() {
        return this.model.allOrganizations;
    }

    public get allOrganizations() {
        return this.model.allOrganizations;
    }

    public getUserOrganizations(): Organization[] {
        return this.model.getUserOrganizations();
    }

    public getOrganizationById(id: string): Organization {
        return this.model.getOrganizationById(id)
    }

    public updateOrganization(organization: Organization, successCallback: (Organization) => void, errorCallback: (error: any) => void): void {
        this.model.updateOrganization(organization, successCallback, errorCallback);
    }

    public createOrganization(data: Organization, successCallback?: (data: Organization) => void, errorCallback?: (error: any) => void) {
        this.model.createOrganization(data, successCallback, errorCallback);
    }

    public deleteOrganization(data: Organization, successCallback?: (data: Organization) => void, errorCallback?: (error: any) => void) {
        this.model.deleteOrganization(data, successCallback, errorCallback);
    }

    public removeOrganization(id: string, successCallback?: (data: Organization) => void, errorCallback?: (error: any) => void) {
        this.model.removeOrganization(id, successCallback, errorCallback);
    }

    public demoConnect(params: any, successCallback?: (data: any) => void, errorCallback?: (error: any) => void) {
        this.model.demoConnect(params, successCallback, errorCallback);
    }

    public getTransaction(): pip.services.Transaction {
        return this.model.transaction;
    }

    public clean(): void {
        this.model.clean();
    }

}

angular.module('iqsOrganizations.ViewModel', ['iqsOrganizations.Data'])
    .service('iqsOrganizationsViewModel', OrganizationsViewModel);