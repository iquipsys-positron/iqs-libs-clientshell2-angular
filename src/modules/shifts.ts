import '../data/shifts/ShiftsDataService';
import '../models/shifts/ShiftsViewModel';
import '../rest/ShiftsResources';

angular.module('iqsShifts', [
    'iqsShifts.Data',
    'iqsShifts.Resource',
    'iqsShifts.ViewModel'
]);