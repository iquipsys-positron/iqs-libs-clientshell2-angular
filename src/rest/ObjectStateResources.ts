function configObjectStateResources(pipRestProvider: pip.rest.IRestProvider) {
    // resource, url, path, defaultParams, actions
    // pipRestProvider.registerCollection('object_state', '/api/v1/organizations/:org_id/object_states/timeline', { org_id: '@org_id' });
    pipRestProvider.registerOperation('object_state', '/api/v1/organizations/:org_id/object_states/timeline', { org_id: '@org_id', state_id: '@state_id' });
}

angular
    .module('iqsObjectStates.Resource', ['pipCommonRest'])
    .config(configObjectStateResources);