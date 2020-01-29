import '../data/applications/ApplicationsDataService';
import '../models/applications/ApplicationViewModel';
import '../rest/ApplicationsResources';

angular.module('iqsApplications', [
    'iqsApplications.Data',
    'iqsApplications.Resource',
    'iqsApplications.ViewModel'
]);