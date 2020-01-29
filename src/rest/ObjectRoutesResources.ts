function configObjectRoutesResources(pipRestProvider: pip.rest.IRestProvider) {
    pipRestProvider.registerOperation('object_routes', '/api/v1/organizations/:org_id/object_routes/:route_id', { org_id: '@org_id', route_id: '@route_id' });
}

angular
    .module('iqsObjectRoutes.Resource', ['pipCommonRest'])
    .config(configObjectRoutesResources);