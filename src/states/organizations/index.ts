import './organization/Organization';
import './organization_invitation/OrganizationInvitation';
import './organization_quick_start/OrganizationQuickStart';
import './organization_welcome/OrganizationWelcome';
import './organizations_connection/OrganizationsConnection';
import './organizations_home/OrganizationsHome';

(() => {
    angular
        .module('iqsOrganizations', [
            'iqsOrganizationsHome',
            'iqsOrganizationsConnection',
            'iqsNewOrganization',
            'iqsOrganizationQuickStart',
            'iqsOrganizationWelcome',
            'iqsOrganizationInvitation'
        ]);
})();

import './OrganizationsStrings';
