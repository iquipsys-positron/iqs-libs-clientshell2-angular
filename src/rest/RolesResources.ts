function configRolesResources(pipRestProvider: pip.rest.IRestProvider) {
     pipRestProvider.registerPagedCollection('roles_grant', '/api/v1/roles/:user_id/grant',
        { user_id: '@user_id' },
        {
            save: { method: 'POST', isArray: true},
            page: { method: 'GET', isArray: true },
            update: { method: 'PUT' }
        });

    pipRestProvider.registerPagedCollection('roles', '/api/v1/roles/:user_id',
        { user_id: '@user_id' },
        {
            page: { method: 'GET', isArray: true },
            update: { method: 'PUT' }
        });

   
    pipRestProvider.registerPagedCollection('roles_revoke', '/api/v1/roles/:user_id/revoke',
        { user_id: '@user_id' },
        {
            page: { method: 'GET', isArray: false },
            update: { method: 'PUT' }
        });
}

// this.registerRoute('get', '/roles', roles.getRolesOperation());
// this.registerRoute('get', '/roles/:role_id', roles.getRolesOperation());
// this.registerRoute('post', '/roles', roles.createResolutionOperation());
// this.registerRoute('put', '/roles/:role_id', roles.updateResolutionOperation());
// this.registerRoute('del', '/roles/:role_id', roles.deleteResolutionOperation());

angular
    .module('iqsRoles.Resource', ['pipCommonRest'])
    .config(configRolesResources);




