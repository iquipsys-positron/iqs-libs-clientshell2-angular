import { Organization } from './Organization';
import { DataPage } from '../DataPage';

export interface IOrganizationsDataService {
    readOrganizations(params: any, successCallback?: (data: DataPage<Organization>) => void, errorCallback?: (error: any) => void): any;
    readOrganization(id: string, successCallback?: (data: Organization) => void, errorCallback?: (error: any) => void): any;
    updateOrganization(id: string, data: Organization, successCallback?: (data: Organization) => void, errorCallback?: (error: any) => void);
    saveOrganization(data: Organization, successCallback?: (data: Organization) => void, errorCallback?: (error: any) => void);
    deleteOrganization(id: string, successCallback?: (data: any) => void, errorCallback?: (error: any) => void);
    generateCode(id: string, successCallback?: (data) => void, errorCallback?: (error: any) => void);
    demoConnect(params: any, successCallback?: (data: any) => void, errorCallback?: (error: any) => void): void;
    removeOrganization(id: string, successCallback?: (data: Organization) => void, errorCallback?: (error: any) => void);
    findOrganizationByCode(code: string, successCallback?: (data) => void, errorCallback?: (error: any) => void);
    validateCode(code: string, successCallback?: (data) => void, errorCallback?: (error: any) => void);
    addToCluster(id: string, successCallback?: (data: any) => void, errorCallback?: (error: any) => void);
}

export interface IOrganizationsDataProvider {

}