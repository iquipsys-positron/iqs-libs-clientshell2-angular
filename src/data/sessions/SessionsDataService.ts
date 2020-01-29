import {
    ISessionsDataService,
    ISessionsDataProvider
} from './ISessionsDataService';
import { Session } from './Session';

import { DataPage } from '..';
import { IOrganizationService } from '../../services';

class SessionsDataService implements ISessionsDataService {
    private RESOURCE: string = 'sessions';
    // private RESOURCE_REMOVE: string = 'close_session';

    constructor(
        private pipRest: pip.rest.IRestService,
        private pipIdentity: pip.services.IIdentityService,
        private iqsOrganization: IOrganizationService
    ) {
        "ngInject";
    }

    public readSessions(params: any, successCallback?: (data: DataPage<Session[]>) => void, errorCallback?: (error: any) => void): angular.IPromise<any> {
        params = params || {};

        return this.pipRest.getResource(this.RESOURCE).page(params, successCallback, errorCallback);
    }

    // public readSession(id: string, successCallback?: (data: Session) => void, errorCallback?: (error: any) => void): angular.IPromise<any> {
    //     return this.pipRest.getResource(this.RESOURCE).get({
    //         session_id: id
    //     }, successCallback, errorCallback);
    // }

    // public createSession(data: Session, successCallback?: (data: Session) => void, errorCallback?: (error: any) => void): void {
    //     this.pipRest.getResource(this.RESOURCE).save(
    //         null,
    //         data,
    //         successCallback,
    //         errorCallback
    //     );
    // }

    public deleteSession(params: any, successCallback?: () => void, errorCallback?: (error: any) => void): void {
        params.user_id = params.user_id ? params.user_id : this.pipIdentity.identity.user_id;
        this.pipRest.getResource(this.RESOURCE).delete(
            params,
            null,
            successCallback,
            errorCallback);
    }

    // public updateSession(id: string, data: Session, successCallback?: (data: Session) => void, errorCallback?: (error: any) => void): void {
    //     this.pipRest.getResource(this.RESOURCE).update(
    //         { session_id: id },
    //         data,
    //         successCallback,
    //         errorCallback
    //     );
    // }

    // public deleteSession(id: string, successCallback?: () => void, errorCallback?: (error: any) => void): void {
    //     this.pipRest.getResource(this.RESOURCE).remove(
    //         { session_id: id },
    //         null,
    //         successCallback,
    //         errorCallback
    //     );
    // }


}


class SessionsDataProvider implements ISessionsDataProvider {
    private _service: ISessionsDataService;

    constructor() {
        "ngInject";
    }

    public $get(
        pipRest: pip.rest.IRestService,
        pipIdentity: pip.services.IIdentityService,
        iqsOrganization: IOrganizationService
    ) {
        "ngInject";

        if (this._service == null) {
            this._service = new SessionsDataService(pipRest, pipIdentity, iqsOrganization);
        }

        return this._service;
    }

}


angular
    .module('iqsSessions.Data', ['pipRest', 'pipServices', 'iqsSessions.Resource'])
    .provider('iqsSessionsData', SessionsDataProvider);