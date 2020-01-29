import '../data/incidents/IncidentsDataService';
import '../models/incidents/IncidentCurrentObjectStateViewModel';
import '../models/incidents/IncidentsViewModel';
import '../rest/IncidentsResources';

angular.module('iqsIncidents', [
    'iqsIncidents.Data',
    'iqsIncidents.Resource',
    'iqsIncidents.ViewModel',
    'iqsIncidentCurrentObjectStates.ViewModel'
]);