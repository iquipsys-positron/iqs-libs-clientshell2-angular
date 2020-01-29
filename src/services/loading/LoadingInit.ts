import '../../states/demo/DemoService';

import { ILoadingService } from './ILoadingService';
import {
    IAccessConfigService,
    IGlobalSearchService,
    ITypeCollectionsService,
    ISendSignals,
    IOrganizationService,
    OrganizationChangedEvent
} from '../';
import {
    UnauthorizedStateName,
    ISendSignalDialogService
} from '../../common';
import { SendSignalData } from '../../data';
import {
    IApplicationsViewModel,
    IDevicesViewModel,
    IEmergencyPlansViewModel,
    IGuidesViewModel,
    IInvitationsViewModel,
    ILocationsViewModel,
    IObjectGroupsViewModel,
    IObjectsViewModel,
    IZonesViewModel,
} from '../../models';
import { IDemoService } from '../../states';
import { LoadingCompleteEvent } from '.';
import { LoadingStatus } from './LoadingStatus';

function initLoading(
    $log: ng.ILogService,
    $rootScope: ng.IRootScopeService,
    $state: ng.ui.IStateService,
    pipAuthState: pip.rest.IAuthStateService,
    iqsLoading: ILoadingService,
    pipIdentity: pip.services.IIdentityService,
    iqsTypeCollectionsService: ITypeCollectionsService,
    iqsApplicationsViewModel: IApplicationsViewModel,
    iqsAccessConfig: IAccessConfigService,
    iqsOrganization: IOrganizationService,
    iqsSendSignalDialog: ISendSignalDialogService,
    iqsSendSignals: ISendSignals,
    iqsGuidesViewModel: IGuidesViewModel,
    iqsEmergencyPlansViewModel: IEmergencyPlansViewModel,
    iqsInvitationsViewModel: IInvitationsViewModel,
    iqsDemo: IDemoService,
    iqsGlobalSearch: IGlobalSearchService,
    iqsDevicesViewModel: IDevicesViewModel,
    iqsLocationsViewModel: ILocationsViewModel,
    iqsObjectGroupsViewModel: IObjectGroupsViewModel,
    iqsObjectsViewModel: IObjectsViewModel,
    iqsZonesViewModel: IZonesViewModel,
    pipInformationDialog: pip.dialogs.IInformationDialogService,
    pipTranslate: pip.services.ITranslateService
) {

    function checkAccess(stateName: string): boolean {
        if (!iqsAccessConfig.getStateAccessAllow(stateName)) {
            event.preventDefault();
            $state.go(UnauthorizedStateName);
            return false;
        }
        return true
    }

    function stateChangeStart(event, toState, toParams, fromState, fromParams) {
        // If users profile is not read
        // console.log(`%cto state: ${toState.name}`, 'background-color: black; color: white', toState);
        if (toState.auth && !withoutLoading(toState.name) && ((!iqsLoading.isLoading && !iqsLoading.isDone) ||
            !pipIdentity.identity || !pipIdentity.identity.id)) {

            iqsLoading.start();
            const cf = $rootScope.$on(LoadingCompleteEvent, () => {
                if (iqsLoading.status === LoadingStatus.Completed && !isOrganizationsState(toState.name)) {
                    if (checkAccess(toState.name)) {
                        $state.go(toState.name, toState.params);
                    }
                }
                cf();
            });
            return;
        }

        // If users do not have organizations
        if (toState.auth && !isOrganizationsState(toState.name)
            && !withoutLoading(toState.name)
            && pipIdentity.identity && pipIdentity.identity.id && pipIdentity.identity.user.organizations.length == 0) {

            event.preventDefault();
            $state.go('organizations.home');
            return;
        }

        // check acceess
        if (toState.auth && iqsLoading.isDone && toState.name != UnauthorizedStateName && toState.name != 'verify_email') {
            if (!checkAccess(toState.name)) return;
        }

        // if (iqsDemo.isDemoUser(pipIdentity.identity) && (toState.name == 'settings.user')) {
        //     showDialog('user_settings');
        //     event.preventDefault();

        //     return;
        // }

        if (iqsDemo.isDemoUser(pipIdentity.identity) && (toState.name == 'organizations.home' || toState.name == 'organizations' || toState.name == 'organizations.create' || toState.name == 'organizations.connection')) {
            showDialog('manage_organization');
            event.preventDefault();

            return;
        }

        if (toState.name == pipAuthState.signoutState()) {
            iqsLoading.clean();
        }
    }

    function withoutLoading(stateName): boolean {
        return stateName == UnauthorizedStateName || stateName == 'verify_email' || stateName == 'verify_email_success' ||
            stateName == 'expire_change_password';
    }

    function isOrganizationsState(stateName): boolean {
        return ['organizations', 'organizations.home', 'organizations.create', 'organizations.connection', 'organizations.quick_start', 'organizations.welcome', 'organizations.invitation'].includes(stateName);
    }

    iqsTypeCollectionsService.init();

    $rootScope.$on('$stateChangeStart', stateChangeStart);

    // initilize translate collections
    $rootScope.$on(pip.services.LanguageChangedEvent, () => {
        iqsTypeCollectionsService.init();
    });

    // organization changed, reloading data
    $rootScope.$on(OrganizationChangedEvent, (event) => {
        if (iqsOrganization.organization) {
            if ($state.current.name === UnauthorizedStateName) {
                window.location.href = window.location.origin + '/home/index.html#';
            } else {
                iqsLoading.restart(() => {
                    if (iqsLoading.status === LoadingStatus.Completed && !isOrganizationsState($state.current.name)) {
                        checkAccess($state.current.name);
                    }
                });
            }
        }
    });

    // send siganl
    $rootScope.$on('iqsSendSignalEvent', () => {
        if (iqsOrganization.organization) {
            iqsSendSignalDialog.show(
                (data: SendSignalData) => {
                    // update data
                    if (!data || !(data.group_ids && data.group_ids.length ||
                        data.object_ids && data.object_ids.length ||
                        data.zone_ids && data.zone_ids.length)) return;

                    iqsSendSignals.sendSignals(data);
                },
                () => {

                }
            );
        }
    });

    $rootScope.$on('iqsShowGuide', () => {
        if (pipIdentity.identity && pipIdentity.identity.id && iqsOrganization.orgId) {
            iqsGuidesViewModel.showLastGuide(true);
        }
    });

    $rootScope.$on('iqsUserSettings', () => {
        if (iqsDemo.isDemoUser(pipIdentity.identity)) {
            showDialog('user_settings');
            event.preventDefault();
            return;
        }
        window.location.href = window.location.origin + '/settings/index.html#';
    });

    function showDialog(params: string) {
        let message = params == 'manage_organization' ? 'DEMO_LIMIT_MANAGE_SITE_INFORMATION_DIALOG_MESSAGE' : 'DEMO_LIMIT_USER_SETTINGS_INFORMATION_DIALOG_MESSAGE';
        pipInformationDialog.show(
            {
                event: null,
                title: pipTranslate.translate('DEMO_LIMIT_INFORMATION_DIALOG_TITLE'),
                message: pipTranslate.translate(message)
            });
    }

    iqsLoading.push('apps', [
        iqsApplicationsViewModel.clean.bind(iqsApplicationsViewModel)
    ], async.series, [
            // Read applications
            (callback) => {
                iqsApplicationsViewModel.initApplications(
                    (data: any) => {
                        callback();
                    },
                    (error: any) => {
                        callback(error);
                    });
            }
        ]);

    iqsLoading.push('aux_data', [
        iqsGuidesViewModel.clean.bind(iqsGuidesViewModel),
        iqsEmergencyPlansViewModel.clean.bind(iqsEmergencyPlansViewModel),
        iqsInvitationsViewModel.clean.bind(iqsInvitationsViewModel)
    ], async.series, [
            (callback) => {
                iqsGuidesViewModel.read(
                    (data: any) => {
                        callback();
                    },
                    (error: any) => {
                        callback(error);
                    });
            },
            (callback) => {
                iqsEmergencyPlansViewModel.filter = null;
                iqsEmergencyPlansViewModel.isSort = true;
                iqsEmergencyPlansViewModel.reload(
                    (data: any) => {
                        callback();
                    },
                    (error: any) => {
                        callback(error);
                    });
            },
            (callback) => {
                iqsInvitationsViewModel.initInvitations(
                    'all',
                    (data: any) => {
                        callback();
                    },
                    (error: any) => {
                        callback(error);
                    });
            }
        ]);

    iqsLoading.push('global_search', [
        iqsDevicesViewModel.clean.bind(iqsDevicesViewModel),
        iqsLocationsViewModel.clean.bind(iqsLocationsViewModel),
        iqsObjectGroupsViewModel.clean.bind(iqsObjectGroupsViewModel),
        iqsObjectsViewModel.clean.bind(iqsObjectsViewModel),
        iqsZonesViewModel.clean.bind(iqsZonesViewModel),
    ], async.parallel, [
            (callback) => {
                iqsObjectsViewModel.initObjects(null,
                    (data: any) => {
                        callback();
                    },
                    (error: any) => {
                        callback(error);
                    });
            },
            (callback) => {
                iqsObjectGroupsViewModel.filter = null;
                iqsObjectGroupsViewModel.isSort = true;
                iqsObjectGroupsViewModel.read(
                    (data: any) => {
                        callback();
                    },
                    (error: any) => {
                        callback(error);
                    });
            },
            (callback) => {
                iqsZonesViewModel.isSort = true;
                iqsZonesViewModel.reload(
                    (data: any) => {
                        callback();
                    },
                    (error: any) => {
                        callback(error);
                    });
            },
            (callback) => {
                iqsDevicesViewModel.initDevices(null,
                    (data: any) => {
                        callback();
                    },
                    (error: any) => {
                        callback(error);
                    });
            },
            (callback) => {
                iqsLocationsViewModel.filter = null;
                iqsLocationsViewModel.isSort = true;
                iqsLocationsViewModel.reload(
                    (data: any) => {
                        callback();
                    },
                    (error: any) => {
                        callback(error);
                    });
            },
        ], (cb, error, results) => {
            if (error) {
                cb(error);
            } else {
                iqsGlobalSearch.init();
                iqsGlobalSearch.initAutocompleteParallel(
                    () => {
                        cb();
                    }
                );

            }
        });

    if (pipIdentity.identity && pipIdentity.identity.id) {
        iqsLoading.start();
    }
}

angular
    .module('iqsLoading')
    .run(initLoading);
