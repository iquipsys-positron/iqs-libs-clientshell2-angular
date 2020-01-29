function configEventRulesResources(pipRestProvider: pip.rest.IRestProvider) {
    pipRestProvider.registerPagedCollection('event_rules', '/api/v1/organizations/:org_id/event_rules/:event_rule_id',
        { event_rule_id: '@event_rule_id', org_id: '@org_id' },
        {
            update: { method: 'PUT' }
        });
}

angular
    .module('iqsEventRules.Resource', ['pipCommonRest'])
    .config(configEventRulesResources);




