import '../data/operational_events/OperationalEventDataService';
import '../models/operational_events/OperationalEventsViewModel';
import '../models/operational_events/RetrospectiveOperationalEventsViewModel';
import '../rest/OperationalEventResources';

angular.module('iqsOperationalEvents', [
    'iqsOperationalEvents.Data',
    'iqsOperationalEvents.Resource',
    'iqsOperationalEvents.ViewModel',
    'iqsRetrospectiveOperationalEvents.ViewModel',
]);