import '../data/invitations/InvitationsDataService';
import '../models/invitations/InvitationsViewModel';
import '../rest/InvitationsResources';

angular.module('iqsInvitations', [
    'iqsInvitations.Data',
    'iqsInvitations.Resource',
    'iqsInvitations.ViewModel'
]);