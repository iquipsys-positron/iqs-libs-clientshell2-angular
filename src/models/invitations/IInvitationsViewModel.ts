import { SearchResult } from '../../services';
import { Invitation } from '../../data';

export interface IInvitationsViewModel {
    initInvitations(filter?: string, successCallback?: (data: Invitation[]) => void, errorCallback?: (error: any) => void);
    filterInvitations(filter: string);
    selectItem(index?: number);
    getInvitationById(invitationId: string): Invitation;
    saveInvitation(data: Invitation, callback: (item: Invitation) => void, error: (err: any) => void);
    updateInvitation(data: Invitation, callback: (item: Invitation) => void, error: (err: any) => void);
    deleteInvitation(id, callback: () => void, error: (error: any) => void);
    filterWithArrayObjects(objects: SearchResult[]);
    sendNotifyMessage(data: Invitation, callback?: (item?: Invitation) => void, errorCallback?: (err: any) => void);
    resendInvite(data, callback?: (item) => void, errorCallback?: (err) => void);
    approveInvite(data, callback?: (item) => void, errorCallback?: (err) => void);
    denyInvite(data, callback?: (item) => void, errorCallback?: (err) => void);
    clean(): void;
    getTransaction(): pip.services.Transaction;
    state: string;
    selectedIndex: number;
    invitations: Invitation[];
    allInvitations: Invitation[];
}
