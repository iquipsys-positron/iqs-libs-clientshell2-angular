function configManualAgreementResources(pipRestProvider: pip.rest.IRestProvider) {
    pipRestProvider.registerPagedCollection('agreements', '/api/v1/agreement/:agreement_id',
        { agreement_id: '@agreement_id', customer_id: '@agreement_id' },
        {
            update: { method: 'PUT' }
        });
        pipRestProvider.registerOperation('agreement_verify', '/api/v1/agreements/verify', {});
}



angular
    .module('iqsAgreements.Resource', ['pipCommonRest'])
    .config(configManualAgreementResources);




