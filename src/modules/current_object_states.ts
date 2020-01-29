import '../data/current_object_states/CurrentObjectStatesDataService';
import '../models/current_object_states/CurrentObjectStatesViewModel';
import '../rest/CurrentObjectStateResources';

angular.module('iqsCurrentObjectStates', [
    'iqsCurrentObjectStates.Data',
    'iqsCurrentObjectStates.Resource',
    'iqsCurrentObjectStates.ViewModel'
]);