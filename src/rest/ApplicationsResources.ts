function configApplicationsResources(pipRestProvider: pip.rest.IRestProvider) {
    pipRestProvider.registerPagedCollection('applications', '/api/v1/applications/:application_id',
        { application_id: '@application_id' },
        {
            page: { method: 'GET', isArray: true },
            update: { method: 'PUT' }
        });

    pipRestProvider.registerPagedCollection('applications_all', '/api/v1/applications',
        { application_id: '@application_id' },
        {
            page: { method: 'GET', isArray: true },
            update: { method: 'PUT' }
        });
}


angular
    .module('iqsApplications.Resource', ['pipCommonRest'])
    .config(configApplicationsResources);
