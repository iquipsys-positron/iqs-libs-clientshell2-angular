import '../data/object_routes/ObjectRoutesDataService';
import '../models/object_routes/ObjectRoutesViewModel';
import '../rest/ObjectRoutesResources';

angular.module('iqsObjectRoutes', [
    'iqsObjectRoutes.Data',
    'iqsObjectRoutes.Resource',
    'iqsObjectRoutes.ViewModel'
]);