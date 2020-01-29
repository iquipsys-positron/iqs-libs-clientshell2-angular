import '../data/organizations/OrganizationsDataService';
import '../models/organizations/OrganizationsViewModel';
import '../rest/OrganizationsResources';
import '../services/organizations/OrganizationService'

angular.module('iqsOrganizations', [
    'iqsOrganizations.Data',
    'iqsOrganizations.Resource',
    'iqsOrganizations.Service',
    'iqsOrganizations.ViewModel'
]);