
function configSignalsResources(pipRestProvider: pip.rest.IRestProvider) {
    pipRestProvider.registerOperation('signals', '/api/v1/organizations/:org_id/signals/:signal_id', { org_id: '@org_id', signal_id: '@signal_id' });


}

angular
    .module('iqsSignals.Resource', ['pipCommonRest'])
    .config(configSignalsResources);

