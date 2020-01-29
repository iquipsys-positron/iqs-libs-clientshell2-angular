function configOrganizationResources(pipRestProvider: pip.rest.IRestProvider) {
    // resource, url, path, defaultParams, actions

    pipRestProvider.registerPagedCollection('organizations', '/api/v1/organizations/:org_id',
        { org_id: '@org_id' },
        {
            get: { method: 'GET', isArray: true },
            update: { method: 'PUT' }
        });

    pipRestProvider.registerOperation('organizations_generate', '/api/v1/organizations/:org_id/generate_code',
        { org_id: '@org_id' });

    pipRestProvider.registerOperation('organizations_find_by_code', '/api/v1/organizations/find_by_code',
        { org_id: '@org_id' });

    pipRestProvider.registerOperation('organizations_validate_code', '/api/v1/organizations/validate_code',
        { org_id: '@org_id' });


    pipRestProvider.registerOperation('demo_connect', '/api/v1/organizations/demo/roles', { user_id: '@user_id' });
    pipRestProvider.registerOperation('organizations_remove', '/api/v1/organizations/:org_id/remove', { org_id: '@org_id' });
    pipRestProvider.registerResource('organizations_add_to_cluster', '/api/v1/clusters/add_organization/:org_id',
        { org_id: '@org_id' },
        { save: { method: 'POST' } }
    );

    // this.registerRouteWithAuth('get', '/organizations', auth.signed(), organizations.getAuthorizedOrganizationsOperation());
    // this.registerRouteWithAuth('get', '/organizations/all', auth.admin(), organizations.getOrganizationsOperation());
    // this.registerRouteWithAuth('get', '/organizations/find_by_code', auth.anybody(), organizations.findOrganizationByCodeOperation());
    // this.registerRouteWithAuth('get', '/organizations/:org_id', auth.organizationUser(), organizations.getOrganizationOperation());
    // this.registerRouteWithAuth('post', '/organizations/:org_id/generate_code', auth.organizationAdmin(), organizations.generateCodeOperation());
    // this.registerRouteWithAuth('post', '/organizations', auth.signed(), organizations.createOrganizationOperation());
    // this.registerRouteWithAuth('post', '/organizations/validate_code', auth.signed(), organizations.validateOrganizationCodeOperation());
    // this.registerRouteWithAuth('put', '/organizations/:org_id', auth.organizationAdmin(), organizations.updateOrganizationOperation());
    // this.registerRouteWithAuth('del', '/organizations/:org_id', auth.admin(), organizations.deleteOrganizationOperation());
    // this.registerRouteWithAuth('post', '/organizations/:org_id/remove', auth.organizationUser(), organizations.removeOrganizationOperation());

}

angular
    .module('iqsOrganizations.Resource', ['pipCommonRest'])
    .config(configOrganizationResources);