import './panels/GlobalHelpPanel';
import { IOrganizationService, ILoadingService, LoadingCompleteEvent } from '../../services';
import { IShellService } from '../../shell';

function initGlobalHelp(
    $rootScope: ng.IRootScopeService,
    $state: ng.ui.IStateService,
    $timeout: ng.ITimeoutService,
    pipMedia: pip.layouts.IMediaService,
    pipAuxPanel: pip.layouts.IAuxPanelService,
    pipActions: pip.nav.IActionsService,
    pipSession: pip.services.ISessionService,
    iqsLoading: ILoadingService,
    iqsShell: IShellService,
    iqsOrganization: IOrganizationService
) {
    let mediaSizeGtSm: boolean;
    
    // open panel if incidents exist
    $rootScope.$on('iqsGlobalHelp', () => {
        // open panel
        if (iqsOrganization.orgId && pipSession.isOpened() && !pipAuxPanel.isOpen() && !notOpenHelp($state.current.name)) {
            pipAuxPanel.open();
        }
        iqsShell.panel = 'global_help';
    });

    function notOpenHelp(stateName): boolean {
        return stateName == 'organizations' ||
            stateName == 'organizations.home' || stateName == 'verify_email' || stateName == 'verify_email_success' ||
            stateName == 'organizations.create' || stateName == 'expire_change_password' ||
            stateName == 'organizations.connection' || stateName == 'organizations.quick_start' || stateName == 'organizations.welcome' || stateName.name == 'organizations.invitation'
            || iqsLoading.isLoading;
    }

    const setHelpActionWrap = () => {
        if (mediaSizeGtSm !== pipMedia('gt-sm')) {
            setHelpAction();
        }
    };

    $rootScope.$on('pipMainResized', setHelpActionWrap);
    $rootScope.$on(LoadingCompleteEvent, setHelpAction);
    $rootScope.$on(pip.services.IdentityChangedEvent, setHelpAction);

    $timeout(setHelpAction, 1000);

    function setHelpAction(): void {
        mediaSizeGtSm = pipMedia('gt-sm');
        let index: number;

        if (iqsOrganization.orgId) {
            if (mediaSizeGtSm) {
                index = _.findIndex(pipActions.primaryGlobalActions, { name: 'global.help' });
                if (index == -1) {
                    pipActions.primaryGlobalActions.push({ name: 'global.help', icon: 'icons:help', count: 0, event: 'iqsGlobalHelp' });
                }
                _.remove(pipActions.secondaryGlobalActions, { name: 'global.help' });
            } else {
                index = _.findIndex(pipActions.secondaryGlobalActions, { name: 'global.help' });
                if (index == -1) {
                    let soi = _.findIndex(pipActions.secondaryGlobalActions, { name: 'global.signout' });
                    soi = soi == -1 ? pipActions.secondaryGlobalActions.length : soi;
                    pipActions.secondaryGlobalActions.splice(soi, 0, { name: 'global.help', title: 'GLOBAL_HELP', icon: 'icons:help', count: 0, event: 'iqsGlobalHelp' });
                }
                _.remove(pipActions.primaryGlobalActions, { name: 'global.help' });
            }
        }
    }
}

function resourceYoutubeConfig($sceDelegateProvider) {
    $sceDelegateProvider.resourceUrlWhitelist([
        'self',
        'https://www.youtube.com/**'
    ]);
}
angular
    .module('iqsGlobalHelp', ['iqsGlobalHelpPanel', 'iqsOrganizations.Service'])
    .run(initGlobalHelp)
    .config(resourceYoutubeConfig);