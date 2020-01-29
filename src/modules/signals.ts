import '../data/signals/SignalsDataService';
import '../models/signals/SignalsViewModel';
import '../rest/SignalResources';

angular.module('iqsSignals', [
    'iqsSignals.Data',
    'iqsSignals.Resource',
    'iqsSignals.ViewModel'
]);