function configLocationsResources(pipRestProvider: pip.rest.IRestProvider) {
    pipRestProvider.registerPagedCollection('locations', '/api/v1/organizations/:org_id/locations/:location_id',
        { location_id: '@location_id', org_id: '@org_id' },
        {
            update: { method: 'PUT' }
        });
}

// this.registerRoute('get', '/locations', locations.getLocationsOperation());
// this.registerRoute('get', '/locations/:location_id', locations.getLocationOperation());
// this.registerRoute('post', '/locations', locations.createLocationOperation());
// this.registerRoute('put', '/locations/:location_id', locations.updateLocationOperation());
// this.registerRoute('del', '/locations/:location_id', locations.deleteLocationOperation());

angular
    .module('iqsLocations.Resource', ['pipCommonRest'])
    .config(configLocationsResources);




