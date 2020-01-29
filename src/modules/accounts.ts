import '../data/accounts/AccountsDataService';
import '../models/accounts/AccountsViewModel';
import '../rest/AccountsResources';

angular.module('iqsAccounts', [
    'iqsAccounts.Data',
    'iqsAccounts.Resource',
    'iqsAccounts.ViewModel'
]);