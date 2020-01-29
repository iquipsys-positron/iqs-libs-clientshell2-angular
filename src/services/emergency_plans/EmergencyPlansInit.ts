import './panels/EmergencyPlansPanel';

import { ILoadingService, LoadingCompleteEvent } from '../loading';
import { IAccessConfigProvider} from '../access_config';
import { AccessRole } from '../../data';
import { IOrganizationService } from '../organizations';
import { IShellService } from '../../shell';

export const EmargencyPlanStateName: string = 'emargency_plan';

function initEmergencyPlans(
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
    $rootScope.$on('iqsEmergencyPlan', () => {
        // open panel
        iqsShell.panel = 'emergency';
        if (iqsOrganization.orgId && pipSession.isOpened() && !pipAuxPanel.isOpen() && !notOpenEmergency($state.current.name)) {
            pipAuxPanel.open();
        }
    });

    const setEmergencyActionWrap = () => {
        if (mediaSizeGtSm !== pipMedia('gt-sm')) {
            setEmergencyAction();
        }
    };

    $rootScope.$on('pipMainResized', setEmergencyActionWrap);
    $rootScope.$on(LoadingCompleteEvent, setEmergencyAction);
    $rootScope.$on(pip.services.IdentityChangedEvent, setEmergencyAction);

    $timeout(setEmergencyAction, 1000);

    function notOpenEmergency(stateName): boolean {
        return stateName == 'organizations' ||
            stateName == 'organizations.home' || stateName == 'verify_email' || stateName == 'verify_email_success' ||
            stateName == 'organizations.create' || stateName == 'expire_change_password' ||
            stateName == 'organizations.connection' || stateName == 'organizations.quick_start' || stateName == 'organizations.welcome' || stateName.name == 'organizations.invitation'
            || iqsLoading.isLoading;
    }

    function setEmergencyAction(): void {
        mediaSizeGtSm = pipMedia('gt-sm');
        let index: number;

        if (iqsOrganization.orgId) {
            if (mediaSizeGtSm) {
                index = _.findIndex(pipActions.primaryGlobalActions, { name: 'global.emergency' });
                if (index == -1) {
                    pipActions.primaryGlobalActions.unshift({ name: 'global.emergency', icon: 'iqs:emergency', count: 0, event: 'iqsEmergencyPlan' });
                }
                _.remove(pipActions.secondaryGlobalActions, { name: 'global.emergency' });
            } else {
                index = _.findIndex(pipActions.secondaryGlobalActions, { name: 'global.emergency' });
                if (index == -1) {
                    pipActions.secondaryGlobalActions.unshift({ name: 'global.emergency', title: 'EMERGENCY_PLANS_AUX_TITLE', icon: 'iqs:emergency', count: 0, event: 'iqsEmergencyPlan' });
                }
                _.remove(pipActions.primaryGlobalActions, { name: 'global.emergency' });
            }
        }
    }
}


function configureEmergencyPlansAccess(
    iqsAccessConfigProvider: IAccessConfigProvider
) {
    "ngInject";

    let accessLevel: number = AccessRole.user;
    let accessConfig: any = {
        emergencyPlanConfig: AccessRole.manager
    };
    iqsAccessConfigProvider.registerStateAccess(EmargencyPlanStateName, accessLevel);
    iqsAccessConfigProvider.registerStateConfigure(EmargencyPlanStateName, accessConfig);
}

angular
    .module('iqsEmergencyPlansAux', ['iqsEmergencyPlansPanel', 'iqsOrganizations.Service'])
    .config(configureEmergencyPlansAccess)
    .run(initEmergencyPlans);

import './EmergencyPlansStrings';
