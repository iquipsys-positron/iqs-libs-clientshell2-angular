function configManualCorrectionsResources(pipRestProvider: pip.rest.IRestProvider) {
    pipRestProvider.registerPagedCollection('corrections', '/api/v1/organizations/:org_id/corrections/:correction_id',
        { correction_id: '@correction_id', org_id: '@org_id' },
        {
            update: { method: 'PUT' }
        });
}
            // this.registerRoute('get', '/corrections', corrections.getCorrectionsOperation());
            // this.registerRoute('get', '/corrections/:correction_id', corrections.getCorrectionOperation());
            // this.registerRoute('post', '/corrections', corrections.createCorrectionOperation());
            // this.registerRoute('put', '/corrections/:correction_id', corrections.updateCorrectionOperation());
            // this.registerRoute('del', '/corrections/:correction_id', corrections.deleteCorrectionOperation());

angular
    .module('iqsCorrections.Resource', ['pipCommonRest'])
    .config(configManualCorrectionsResources);




