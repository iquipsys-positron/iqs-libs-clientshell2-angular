import '../data/event_rules/EventRulesDataService';
import '../models/event_rules/EventRulesViewModel';
import '../rest/EventRulesResources';

angular.module('iqsEventRules', [
    'iqsEventRules.Data',
    'iqsEventRules.Resource',
    'iqsEventRules.ViewModel'
]);