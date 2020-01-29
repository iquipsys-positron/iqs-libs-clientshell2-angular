function configControlObjectsResources(pipRestProvider: pip.rest.IRestProvider) {
    // resource, url, path, defaultParams, actions
    pipRestProvider.registerPagedCollection('control_objects', '/api/v1/organizations/:org_id/control_objects/:object_id',
        { object_id: '@object_id', org_id: '@org_id' },
        {
            page: { method: 'GET', isArray: false },
            update: { method: 'PUT' }
        });
}

angular
    .module('iqsControlObjects.Resource', ['pipCommonRest'])
    .config(configControlObjectsResources);