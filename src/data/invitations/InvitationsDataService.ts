import {
    IInvitationsDataService,
    IInvitationsDataProvider
} from './IInvitationsDataService';
import { Invitation } from './Invitation';
import { DataPage } from '../DataPage';
import { IOrganizationService } from '../../services';

class InvitationsDataService implements IInvitationsDataService {
    private RESOURCE: string = 'invitations';
    private RESOURCE_APPROVE: string = 'invitations_approve';
    private RESOURCE_RESEND: string = 'invitations_resend';
    private RESOURCE_DENY: string = 'invitations_deny';
    private RESOURCE_NOTIFY_MESSAGE: string = 'invitations_notify';

    private PAGE_SIZE: number = 100;
    private PAGE_START: number = 0;
    private PAGE_TOTAL: boolean = true;

    constructor(private pipRest: pip.rest.IRestService, private pipFormat: pip.services.IFormat,
        private iqsOrganization: IOrganizationService) {
        "ngInject";
    }

    public readInvitations(params: any = {}, successCallback?: (data: DataPage<Invitation>) => void, errorCallback?: (error: any) => void): any {
        params = params || {};
        params.org_id = params.org_id ? params.org_id : this.iqsOrganization.orgId;

        this.pipRest.getResource(this.RESOURCE).get(
            params,
            (items: DataPage<Invitation>) => {
                if (successCallback) {
                    successCallback(items);
                }
            },
            errorCallback);
    }

    public sendNotifyMessage(invite: Invitation, successCallback?: (data?: Invitation) => void, errorCallback?: (error: any) => void): any {
        this.pipRest.getResource(this.RESOURCE_NOTIFY_MESSAGE).save(
            {
                org_id: this.iqsOrganization.orgId
            },
            invite, (item?: Invitation) => {
                if (successCallback) {
                    successCallback(item);
                }
            },
            errorCallback);
    }

    public updateInvitation(id: string, data: Invitation, successCallback?: (data: Invitation) => void, errorCallback?: (error: any) => void) {
        this.pipRest.getResource(this.RESOURCE).update(
            {
                invitation_id: id,
                org_id: this.iqsOrganization.orgId
            },
            data,
            (item: Invitation) => {
                if (successCallback) {
                    successCallback(item);
                }
            },
            errorCallback);
    }

    public approveInvitation(invite: Invitation, successCallback?: (data: Invitation) => void, errorCallback?: (error: any) => void): any {
        this.pipRest.getResource(this.RESOURCE_APPROVE).save(
            {
                invitation_id: invite.id,
                org_id: this.iqsOrganization.orgId
            },
            invite, (item: Invitation) => {
                if (successCallback) {
                    successCallback(item);
                }
            },
            errorCallback);
    }

    public resendInvitation(invite: Invitation, successCallback?: (data: Invitation) => void, errorCallback?: (error: any) => void): any {
        this.pipRest.getResource(this.RESOURCE_RESEND).save(
            {
                invitation_id: invite.id,
                org_id: this.iqsOrganization.orgId
            },
            invite,
            (item: Invitation) => {
                if (successCallback) {
                    successCallback(item);
                }
            },
            errorCallback);
    }

    public denyInvitation(invite: Invitation, successCallback?: (data: Invitation) => void, errorCallback?: (error: any) => void): any {
        this.pipRest.getResource(this.RESOURCE_DENY).save(
            {
                invitation_id: invite.id,
                org_id: this.iqsOrganization.orgId
            },
            invite,
            (item: Invitation) => {
                if (successCallback) {
                    successCallback(item);
                }
            },
            errorCallback);
    }

    public saveInvitation(data: Invitation, successCallback?: (data: Invitation) => void, errorCallback?: (error: any) => void) {
        data.org_id = data.org_id ? data.org_id : this.iqsOrganization.orgId
        this.pipRest.getResource(this.RESOURCE).save(
            {
                org_id: data.org_id
            },
            data,
            (item: Invitation) => {
                if (successCallback) {
                    successCallback(item);
                }
            },
            errorCallback);
    }

    public deleteInvitation(id: string, successCallback?: (data: any) => void, errorCallback?: (error: any) => void) {
        this.pipRest.getResource(this.RESOURCE).delete(
            {
                invitation_id: id,
                org_id: this.iqsOrganization.orgId
            },
            null,
            (item) => {
                if (successCallback) {
                    successCallback(item);
                }
            },
            errorCallback);
    }
}

class InvitationsDataProvider implements IInvitationsDataProvider {
    private _service: IInvitationsDataService;

    constructor() {
        "ngInject";
    }

    public $get(
        pipRest: pip.rest.IRestService,
        pipFormat: pip.services.IFormat,
        iqsOrganization: IOrganizationService
    ) {
        "ngInject";

        if (this._service == null) {
            this._service = new InvitationsDataService(pipRest, pipFormat, iqsOrganization);
        }

        return this._service;
    }

}


angular
    .module('iqsInvitations.Data', ['pipRest', 'pipServices', 'iqsInvitations.Resource'])
    .provider('iqsInvitationsData', InvitationsDataProvider);