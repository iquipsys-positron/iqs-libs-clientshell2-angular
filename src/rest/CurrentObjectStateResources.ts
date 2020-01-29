function configCurrentObjectStateResources(pipRestProvider: pip.rest.IRestProvider) {
    // resource, url, path, defaultParams, actions
    pipRestProvider.registerOperation('current_object_state', '/api/v1/organizations/:org_id/curr_object_states/:state_id',
    { org_id: '@org_id', state_id: '@state_id' });
}

angular
    .module('iqsCurrentObjectStates.Resource', ['pipCommonRest'])
    .config(configCurrentObjectStateResources);