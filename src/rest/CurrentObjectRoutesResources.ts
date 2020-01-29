function configCurrObjectRoutesResources(pipRestProvider: pip.rest.IRestProvider) {
    pipRestProvider.registerOperation('curr_object_routes', '/api/v1/organizations/:org_id/curr_object_routes/:object_id', { org_id: '@org_id', object_id: '@object_id' });

}

angular
    .module('iqsCurrentObjectRoutes.Resource', ['pipCommonRest'])
    .config(configCurrObjectRoutesResources);