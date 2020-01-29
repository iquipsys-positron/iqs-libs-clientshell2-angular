import '../data/resolutions/ResolutionsDataService';
import '../models/resolutions/ResolutionsViewModel';
import '../rest/ResolutionsResources';

angular.module('iqsResolutions', [
    'iqsResolutions.Data',
    'iqsResolutions.Resource',
    'iqsResolutions.ViewModel'
]);