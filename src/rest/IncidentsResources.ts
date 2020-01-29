function configIncidentsResources(pipRestProvider: pip.rest.IRestProvider) {
    pipRestProvider.registerPagedCollection('incidents', '/api/v1/organizations/:org_id/incidents/:incident_id',
        { incident_id: '@incident_id', org_id: '@org_id' },
        {
            update: { method: 'PUT' }
        });

    pipRestProvider.registerResource('incidents_count', '/api/v1/organizations/:org_id/incidents/count',
        { org_id: '@org_id' },
        {
            get: { method: 'GET', isArray: false },
        });

}

angular
    .module('iqsIncidents.Resource', ['pipCommonRest'])
    .config(configIncidentsResources);
