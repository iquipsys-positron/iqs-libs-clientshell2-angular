function configDevicesResources(pipRestProvider: pip.rest.IRestProvider) {
    // resource, url, path, defaultParams, actions
    pipRestProvider.registerPagedCollection('devices', '/api/v1/organizations/:org_id/devices/:device_id',
        { device_id: '@device_id', org_id: '@org_id' },
        {
            page: { method: 'GET', isArray: false },
            update: { method: 'PUT' }
        });
    pipRestProvider.registerOperation('verifyDeviceUdi', '/api/v1/organizations/:org_id/devices/validate_udi', {},
        {
            save: { method: 'POST' },
            call: { method: 'POST' }
        });
    pipRestProvider.registerOperation('ping_devices', '/api/v1/organizations/:org_id/devices/:device_id/ping',
        { gateway_id: '@device_id' },
        {
            save: { method: 'POST' },
            call: { method: 'POST' }
        });        
}

angular
    .module('iqsDevices.Resource', ['pipCommonRest'])
    .config(configDevicesResources);