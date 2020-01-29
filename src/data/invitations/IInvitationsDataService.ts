import { Invitation } from './Invitation';
import { DataPage } from '../DataPage';

export interface IInvitationsDataService {
    readInvitations(params: any, successCallback?: (data: DataPage<Invitation>) => void, errorCallback?: (error: any) => void): any;
    saveInvitation(data: Invitation, successCallback?: (data: Invitation) => void, errorCallback?: (error: any) => void);
    updateInvitation(id: string, data: Invitation, successCallback?: (data: Invitation) => void, errorCallback?: (error: any) => void);
    deleteInvitation(id: string, successCallback?: (data: any) => void, errorCallback?: (error: any) => void);

    resendInvitation(invite: Invitation, successCallback?: (data: Invitation) => void, errorCallback?: (error: any) => void): any;
    denyInvitation(invite: Invitation, successCallback?: (data: Invitation) => void, errorCallback?: (error: any) => void): any;
    approveInvitation(invite: Invitation, successCallback?: (data: Invitation) => void, errorCallback?: (error: any) => void): any;
    sendNotifyMessage(invite: Invitation, successCallback?: (data?: Invitation) => void, errorCallback?: (error: any) => void): any;
}

export interface IInvitationsDataProvider {

}