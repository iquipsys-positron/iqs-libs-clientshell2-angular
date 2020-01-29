function configGatewaysResources(pipRestProvider: pip.rest.IRestProvider) {
    pipRestProvider.registerPagedCollection('gateways', '/api/v1/organizations/:org_id/gateways/:gateway_id',
        { gateway_id: '@gateway_id', org_id: '@org_id' },
        {
            update: { method: 'PUT' }
        });
    pipRestProvider.registerOperation('verifyGatewayUdi', '/api/v1/organizations/:org_id/gateways/validate_udi', { org_id: '@org_id' },
        {
            save: { method: 'POST' },
            call: { method: 'POST' }
        });
    pipRestProvider.registerOperation('ping_gateways', '/api/v1/organizations/:org_id/gateways/:gateway_id/ping',
        { gateway_id: '@gateway_id', org_id: '@org_id' },
        {
            save: { method: 'POST' },
            call: { method: 'POST' }
        });
    pipRestProvider.registerOperation('stat_gateways', '/api/v1/organizations/:org_id/gateways/:gateway_id/request_stats',
        { gateway_id: '@gateway_id', org_id: '@org_id' },
        {
            save: { method: 'POST' },
            call: { method: 'POST' }
        });

}


angular
    .module('iqsGateways.Resource', ['pipCommonRest'])
    .config(configGatewaysResources);
