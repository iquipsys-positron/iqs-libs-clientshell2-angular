import '../data/data_profiles/DataProfilesDataService';
import '../models/data_profiles/DataProfilesViewModel';
import '../rest/DataProfile';

angular.module('iqsDataProfiles', [
    'iqsDataProfiles.Data',
    'iqsDataProfiles.Resource',
    'iqsDataProfiles.ViewModel'
]);