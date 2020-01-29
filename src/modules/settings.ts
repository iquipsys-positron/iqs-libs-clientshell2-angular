import '../data/settings/EmailSettingsDataService';
import '../data/settings/SmsSettingsDataServce';
import '../models/settings/SettingsViewModel';
import '../rest/SettingsResources';

angular.module('iqsEmailSettings', [
    'iqsEmailSettings.Data',
    'iqsSettings.Resource'
]);
angular.module('iqsSmsSettings', [
    'iqsSmsSettings.Data',
    'iqsSettings.Resource'
]);
angular.module('iqsSettings', [
    'iqsEmailSettings',
    'iqsSmsSettings',
    'iqsSettings.Resource',
    'iqsSettings.ViewModel'
]);