export interface IRolesDataService {
    readRoles(params: any, successCallback?: (data: string[]) => void, errorCallback?: (error: any) => void): angular.IPromise<any>;
    deleteRole(params: any, successCallback?: (data: string[]) => void, errorCallback?: (error: any) => void): void;
    createRole(params: any, data: any, successCallback?: (data: string[]) => void, errorCallback?: (error: any) => void): void
    grantRoles(id: string, body: string[], successCallback?: (data: string[]) => void, errorCallback?: (error: any) => void): angular.IPromise<any>;
    revokeRoles(id: string, body: string[], successCallback?: (data: string[]) => void, errorCallback?: (error: any) => void): angular.IPromise<any>;
}

export interface IRolesDataProvider {

}
