import '../data/object_states/ObjectStatesDataService';
import '../models/object_states/ObjectStatesViewModel';
import '../rest/ObjectStateResources';

angular.module('iqsObjectStates', [
    'iqsObjectStates.Data',
    'iqsObjectStates.Resource',
    'iqsObjectStates.ViewModel'
]);