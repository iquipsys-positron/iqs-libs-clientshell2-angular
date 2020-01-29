import './common';
import './data';
import './models';
import './modules';
import './shell/Shell';
import './services';
import './states';
import './config';
import './validators';

import { AccessRole } from './data';
import { IAccessConfigService, IOrganizationService } from './services';


(() => {
    'use strict';

    function initIndex(
        $rootScope: ng.IRootScopeService,
        pipNavService: pip.nav.INavService,
        pipIdentity: pip.services.IIdentityService,
        iqsOrganization: IOrganizationService,
        iqsAccessConfig: IAccessConfigService
    ) {

        $rootScope.$on(pip.services.IdentityChangedEvent, () => {
            if (pipIdentity.identity) {
                if (iqsOrganization.orgId || pipIdentity.identity.user && pipIdentity.identity.user.organizations && pipIdentity.identity.user.organizations.length > 0) {
                    pipNavService.actions.secondaryGlobalActions = [
                        {
                            name: 'global.signal', title: 'ACTION_SEND_SIGNAL', event: 'iqsSendSignalEvent',
                            access: () => { return iqsAccessConfig.roleLevel >= AccessRole.manager }
                        },
                        { name: 'global.settings', title: 'User settings', /* state: 'settings.user'*/ event: 'iqsUserSettings' },
                        { name: 'global.guide', title: 'SHOW_GUIDE', event: 'iqsShowGuide' },
                        { name: 'global.signout', title: 'Sign out', state: 'signout' }
                    ];
                } else {
                    pipNavService.actions.secondaryGlobalActions = [
                        { name: 'global.guide', title: 'SHOW_GUIDE', event: 'iqsShowGuide' },
                        { name: 'global.signout', title: 'Sign out', state: 'signout' }
                    ];
                }
            } else {
                pipNavService.actions.secondaryGlobalActions = [];
            }
        });
    }

    angular.module('iqsShell', [
        'iqsShell.Config',
        'iqsShellService',
        'iqsClientShell',

        'pipSettingsResources'
    ])
        .run(initIndex);
})();

import './IquipsysStrings';
export * from './common';
export * from './data';
export * from './models';
export * from './services';
export * from './shell';
export * from './states';
export * from './validators';