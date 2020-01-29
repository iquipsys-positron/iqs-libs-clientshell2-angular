function configStatisticsResources(pipRestProvider: pip.rest.IRestProvider) {
    pipRestProvider.registerOperation('statistics', '/api/v1/organizations/:org_id/statistics/:name', { org_id: '@org_id'});
}

angular
    .module('iqsStatistics.Resource', ['pipCommonRest'])
    .config(configStatisticsResources);




