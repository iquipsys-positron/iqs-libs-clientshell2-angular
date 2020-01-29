function configZonesResources(pipRestProvider: pip.rest.IRestProvider) {
    // resource, url, path, defaultParams, actions
    pipRestProvider.registerPagedCollection('zones', '/api/v1/organizations/:org_id/zones/:zone_id',
        { zone_id: '@zone_id', org_id: '@org_id' },
        {
            update: { method: 'PUT' }
        });
}

angular
    .module('iqsZones.Resource', ['pipCommonRest'])
    .config(configZonesResources);