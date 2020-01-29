
function configBeaconsResources(pipRestProvider: pip.rest.IRestProvider) {
    pipRestProvider.registerPagedCollection('beacons', '/api/v1/organizations/:org_id/beacons/:beacon_id',
        { beacon_id: '@beacon_id', org_id: '@org_id' },
        {
            update: { method: 'PUT' }
        });

    pipRestProvider.registerOperation('beacons_calculate_position', '/api/v1/organizations/:org_id/beacons/calculate_position',
        { org_id: '@org_id' });

    pipRestProvider.registerOperation('verify_beacons_udi', '/api/v1/organizations/:org_id/beacons/validate_udi', {},
        {
            save: { method: 'POST' },
            call: { method: 'POST' }
        });

}

angular
    .module('iqsBeacons.Resource', ['pipCommonRest'])
    .config(configBeaconsResources);