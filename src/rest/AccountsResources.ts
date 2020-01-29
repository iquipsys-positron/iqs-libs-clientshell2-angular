function configAccountsResources(pipRestProvider: pip.rest.IRestProvider) {
    // resource, url, path, defaultParams, actions
    pipRestProvider.registerPagedCollection('accounts', '/api/v1/accounts/:user_id',
        { user_id: '@user_id' },
        {
            page: { method: 'GET', isArray: false },
            update: { method: 'PUT' }
        });

    pipRestProvider.registerPagedCollection('accounts_all', '/api/v1/accounts',
        {},
        {
            page: { method: 'GET', isArray: false },
        });

    pipRestProvider.registerPagedCollection('accounts_organization', '/api/v1/organizations/:org_id/users',
        { org_id: '@org_id' },
        {
            page: { method: 'GET', isArray: false },
            update: { method: 'PUT' }
        });
}

angular
    .module('iqsAccounts.Resource', ['pipCommonRest'])
    .config(configAccountsResources);