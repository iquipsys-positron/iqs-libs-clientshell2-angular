import '../data/event_templates/EventTemplatesDataService';
import '../models/event_templates/OperationalEventTemplatesViewModel';
import '../rest/EventTemplateResources';

angular.module('iqsEventTemplates', [
    'iqsEventTemplates.Data',
    'iqsEventTemplates.Resource',
    'iqsEventTemplates.ViewModel'
]);