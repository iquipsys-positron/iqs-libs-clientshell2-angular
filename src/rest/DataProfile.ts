function configDataProfilesResources(pipRestProvider: pip.rest.IRestProvider) {
    pipRestProvider.registerOperation('data_profiles', '/api/v1/organizations/:org_id/data_profiles',
        { org_id: '@org_id' }
    );
}

angular
    .module('iqsDataProfiles.Resource', ['pipCommonRest'])
    .config(configDataProfilesResources);