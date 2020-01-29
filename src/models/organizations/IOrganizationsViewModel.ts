import { Organization } from '../../data/organizations/Organization';

export interface IOrganizationsViewModel {
    initOrganizations(successCallback?: (data: any[]) => void, errorCallback?: (error: any) => void);
    organizations: Organization[];
    state: string;
    getOrganizationById(id: string);
    updateOrganization(organization: Organization, successCallback: (Organization) => void, errorCallback: (error: any) => void): void;
    generateCode(id: string, successCallback?: (data) => void, errorCallback?: (error: any) => void);
    deleteOrganization(data: Organization, successCallback?: (data: Organization) => void, errorCallback?: (error: any) => void);
    createOrganization(data: Organization, successCallback?: (data: Organization) => void, errorCallback?: (error: any) => void);
    clean(): void;
    demoConnect(params: any, successCallback?: (data: any) => void, errorCallback?: (error: any) => void);
    removeOrganization(id: string, successCallback?: (data: Organization) => void, errorCallback?: (error: any) => void);
    getUserOrganizations(): Organization[];
    getTransaction(): pip.services.Transaction;
}