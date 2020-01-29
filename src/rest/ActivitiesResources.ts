function configActivitiesResources(pipRestProvider: pip.rest.IRestProvider) {
    // resource, url, path, defaultParams, actions
    pipRestProvider.registerPagedCollection('activities', '/api/v1/activities/:account_id',
        { account_id: '@account_id' },
        {
            page: { method: 'GET', isArray: false },
            update: { method: 'PUT' }
        });
}

angular
    .module('iqsActivities.Resource', ['pipCommonRest'])
    .config(configActivitiesResources);