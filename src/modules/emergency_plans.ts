import '../data/emergency_plans/EmergencyPlansDataService';
import '../models/emergency_plans/EmergencyPlansViewModel';
import '../rest/EmergencyPlansResources';

angular.module('iqsEmergencyPlans', [
    'iqsEmergencyPlans.Data',
    'iqsEmergencyPlans.Resource',
    'iqsEmergencyPlans.ViewModel'
]);