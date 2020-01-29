
function configCurrentDeviceStateResources(pipRestProvider: pip.rest.IRestProvider) {
    // resource, url, path, defaultParams, actions
    pipRestProvider.registerOperation('curr_device_states', '/api/v1/organizations/:org_id/curr_device_states/:state_id',
    { org_id: '@org_id', state_id: '@state_id' });
}

angular
    .module('iqsCurrentDeviceStates.Resource', ['pipCommonRest'])
    .config(configCurrentDeviceStateResources);

