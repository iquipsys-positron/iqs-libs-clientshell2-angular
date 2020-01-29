function configResolutionsResources(pipRestProvider: pip.rest.IRestProvider) {
    pipRestProvider.registerPagedCollection('resolutions', '/api/v1/organizations/:org_id/resolutions/:resolution_id',
        { resolution_id: '@resolution_id', org_id: '@org_id' },
        {
            update: { method: 'PUT' }
        });
}

// this.registerRoute('get', '/resolutions', resolutions.getResolutionsOperation());
// this.registerRoute('get', '/resolutions/:resolution_id', resolutions.getResolutionsOperation());
// this.registerRoute('post', '/resolutions', resolutions.createResolutionOperation());
// this.registerRoute('put', '/resolutions/:resolution_id', resolutions.updateResolutionOperation());
// this.registerRoute('del', '/resolutions/:resolution_id', resolutions.deleteResolutionOperation());

angular
    .module('iqsResolutions.Resource', ['pipCommonRest'])
    .config(configResolutionsResources);
