function configObjectPositionsResources(pipRestProvider: pip.rest.IRestProvider) {
    // resource, url, path, defaultParams, actions
    pipRestProvider.registerOperation('object_positions', '/api/v1/organizations/:org_id/object_positions', { org_id: '@org_id' });
    pipRestProvider.registerResource('object_positions_count', '/api/v1/organizations/:org_id/object_positions/count',
        { org_id: '@org_id' });
}

angular
    .module('iqsObjectPositions.Resource', ['pipCommonRest'])
    .config(configObjectPositionsResources);