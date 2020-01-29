function configInvitationsResources(pipRestProvider: pip.rest.IRestProvider) {
    // resource, url, path, defaultParams, actions
    pipRestProvider.registerPagedCollection('invitations', '/api/v1/organizations/:org_id/invitations/:invitation_id',
        { invitation_id: '@invitation_id', org_id: '@org_id' },
        {
            page: { method: 'GET', isArray: false },
            update: { method: 'PUT' }
        });

    pipRestProvider.registerPagedCollection('invitations_notify', '/api/v1/organizations/:org_id/invitations/notify',
        { org_id: '@org_id' },
        {
            page: { method: 'GET', isArray: false },
            update: { method: 'PUT' }
        });

    pipRestProvider.registerPagedCollection('invitations_approve', '/api/v1/organizations/:org_id/invitations/:invitation_id/approve',
        { invitation_id: '@invitation_id', org_id: '@org_id' },
        {
            page: { method: 'GET', isArray: false },
            update: { method: 'PUT' }
        });

    pipRestProvider.registerPagedCollection('invitations_deny', '/api/v1/organizations/:org_id/invitations/:invitation_id/deny',
        { invitation_id: '@invitation_id', org_id: '@org_id' },
        {
            page: { method: 'GET', isArray: false },
            update: { method: 'PUT' }
        });

    pipRestProvider.registerPagedCollection('invitations_resend', '/api/v1/organizations/:org_id/invitations/:invitation_id/resend',
        { invitation_id: '@invitation_id', org_id: '@org_id' },
        {
            page: { method: 'GET', isArray: false },
            update: { method: 'PUT' }
        });
}

angular
    .module('iqsInvitations.Resource', ['pipCommonRest'])
    .config(configInvitationsResources);