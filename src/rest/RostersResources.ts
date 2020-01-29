function configRostersResources(pipRestProvider: pip.rest.IRestProvider) {
    pipRestProvider.registerPagedCollection('rosters', '/api/v1/organizations/:org_id/rosters/:roster_id',
        { roster_id: '@roster_id', org_id: '@org_id' },
        {
            update: { method: 'PUT' }
        });
}

angular
    .module('iqsRosters.Resource', ['pipCommonRest'])
    .config(configRostersResources);




