function configManualCreditCardResources(pipRestProvider: pip.rest.IRestProvider) {
    pipRestProvider.registerPagedCollection('credit_cards', '/api/v1/organizations/:customer_id/credit_cards/:card_id',
        { card_id: '@card_id', customer_id: '@customer_id' },
        {
            update: { method: 'PUT' }
        });
}

angular
    .module('iqsCreditCards.Resource', ['pipCommonRest'])
    .config(configManualCreditCardResources);




