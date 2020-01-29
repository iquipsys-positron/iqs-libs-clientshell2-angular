import '../data/current_device_states/CurrentDeviceStateDataService';
import '../rest/CurrentDeviceStateResources';

angular.module('iqsCurrentDeviceStates', [
    'iqsCurrentDeviceStates.Data',
    'iqsCurrentDeviceStates.Resource'
]);