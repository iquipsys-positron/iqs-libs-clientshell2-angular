import './IncidentsConfigService';
import { IncidentsUpdateType, IIncidentsConfigService } from './IIncidentsConfigService';
import { AccessRole } from '../../data';
import { IIncidentsViewModel } from '../../models';
import { IAccessConfigProvider, IOrganizationService, ILoadingService } from '../../services';
import { IShellService } from '../../shell';
import { States } from '../../common';

export const IncidentsStateName = 'incidents';

function initIncidents(
    $rootScope: ng.IRootScopeService,
    $state: ng.ui.IStateService,
    $timeout: ng.ITimeoutService,
    pipTimer: pip.services.ITimerService,
    pipAuxPanel: pip.layouts.IAuxPanelService,
    pipMedia: pip.layouts.IMediaService,
    pipActions: pip.nav.IActionsService,
    pipSession: pip.services.ISessionService,
    iqsLoading: ILoadingService,
    iqsIncidentsViewModel: IIncidentsViewModel,
    iqsIncidentsConfig: IIncidentsConfigService,
    iqsShell: IShellService,
    iqsOrganization: IOrganizationService
) {
    // open panel if incidents exist
    $rootScope.$on('iqsIncidentsOpen', () => {
        // open panel
        if (iqsOrganization.orgId && pipSession.isOpened() && !notOpenIncidents($state.current.name)) {
            if (!pipAuxPanel.isOpen()) {
                pipAuxPanel.open();
                iqsIncidentsViewModel.reCalcElapsedDate();
            }
            iqsShell.panel = 'incident';
        }

        // update bage
        const cb = () => {
            $timeout(() => {
                pipActions.updateCount('global.incidents', iqsIncidentsViewModel.incidentsCount);
            }, 0);
        }
        if (iqsIncidentsViewModel.state === States.Data) cb();
        else iqsIncidentsViewModel.read(() => { cb(); });
        // $timeout(() => {
        //     pipActions.updateCount('global.incidents', iqsIncidentsViewModel.incidentsCount);
        // }, 0);
    });

    $timeout(
        () => {
            pipTimer.removeEvent('iqsReadIncident');
            pipTimer.addEvent('iqsReadIncident', 15 * 1000); // 15 sec
        }, 1000
    );

    function notOpenIncidents(stateName): boolean {
        return stateName == 'organizations' ||
            stateName == 'organizations.home' || stateName == 'verify_email' || stateName == 'verify_email_success' ||
            stateName == 'organizations.create' || stateName == 'expire_change_password' ||
            stateName == 'organizations.connection' || stateName == 'organizations.quick_start' || stateName == 'organizations.welcome' || stateName.name == 'organizations.invitation'
            || !iqsLoading.isDone;
    }

    // reread incidents evry 60 second
    $rootScope.$on('iqsReadIncident', () => {
        if (iqsOrganization.orgId && pipSession.isOpened() && !iqsIncidentsViewModel.getTransaction().busy()) {
            // if (pipAuxPanel.isOpen()) {
            if (iqsIncidentsConfig.updateType === IncidentsUpdateType.Full) {
                iqsIncidentsViewModel.filter = {
                    skip: 0,
                    take: 100,
                    total: true
                };//null;
                iqsIncidentsViewModel.isSort = false;
                iqsIncidentsViewModel.read();
            } else {
                iqsIncidentsViewModel.readIncidentsCount();
            }
        }
    });

    pipSession.addCloseListener((callback) => {
        pipAuxPanel.close();
        if (callback) {
            $timeout(callback(), 500);
        }
    });
}

function configureIncidentsAccess(
    iqsAccessConfigProvider: IAccessConfigProvider
) {
    "ngInject";

    let accessLevel: number = AccessRole.user;
    let accessConfig: any = {
        incidentClose: AccessRole.manager,
        incidentConfig: AccessRole.user
    };
    iqsAccessConfigProvider.registerStateAccess(IncidentsStateName, accessLevel);
    iqsAccessConfigProvider.registerStateConfigure(IncidentsStateName, accessConfig);
}

function declareIncidentsResources(pipTranslateProvider: pip.services.ITranslateProvider) {
    pipTranslateProvider.translations('en', {
        INCIDENT_TITLE: 'Incidents',
        INCIDENT_BUTTON_OPTIONS: 'Incidents settings',
        INCIDENT_VALUE: 'Ограничение',
        INCIDENT_TIME: 'Время',
        INCIDENT_LOCATION: 'Место',
        INCIDENT_RESOLUTION: 'Резолюция',
        INCIDENT_DEFAULT_RESOLUTION: 'Acknowledged',
        INCIDENTS_RESOLUTION_SETTINGS: 'Configure resolutions',
        INCIDENTS_RESOLUTION_EMPTY_TITLE: 'Resolutions were not found',
        INCIDENT_CLOSE_BUTTON: 'Close',
        INCIDENT_SHOW_ALL: 'Show all',
        INCIDENT_HIDE_ALL: 'Show last',
        INCIDENT_CLOSE_ALL_BUTTON: 'Close all',
        INCIDENT_CLOSE_ALL_CONFIRMATION: 'Are you sure you want to close all incidents by default resolution?',
        INCIDENT_ONLINE: 'Online',
        INCIDENT_OFFLINE: 'Offline',
        INCIDENT_GROUPS: 'Groups',
        INCIDENT_FREEZED: 'Disabled',
        INCIDENT_PHONE: 'Phone',
        INCIDENT_COUNT_EVENT: 'in 24 hours',
        INCIDENT_IMMOBILE: 'Immobile',
        INCIDENT_EXPECTED: 'Limit',
        INCIDENTS_DATA_EMPTY_TITLE: 'There are no new incidents.',
        INCIDENTS_DATA_EMPTY_SUBTITLE: 'Everything is OK!',

    });
    pipTranslateProvider.translations('ru', {
        INCIDENT_TITLE: 'Происшествия',
        INCIDENT_BUTTON_OPTIONS: 'Настройка происшествий',
        INCIDENT_VALUE: 'Ограничение',
        INCIDENT_TIME: 'Время',
        INCIDENT_LOCATION: 'Место',
        INCIDENT_RESOLUTION: 'Резолюция',
        INCIDENT_DEFAULT_RESOLUTION: 'Принято к сведению',
        INCIDENTS_RESOLUTION_SETTINGS: 'Настроить резолюции',
        INCIDENTS_RESOLUTION_EMPTY_TITLE: 'Резолюции не найдены',
        INCIDENT_CLOSE_BUTTON: 'Закрыть',
        INCIDENT_SHOW_ALL: 'Показать все',
        INCIDENT_HIDE_ALL: 'Показать последние',
        INCIDENT_CLOSE_ALL_BUTTON: 'Закрыть все',
        INCIDENT_CLOSE_ALL_CONFIRMATION: 'Вы уверены, что хотите закрыть все происшествия резолюцией по умолчанию?',
        INCIDENT_ONLINE: 'На связи',
        INCIDENT_OFFLINE: 'Не на связи',
        INCIDENT_GROUPS: 'Группы',
        INCIDENT_FREEZED: 'Отключен',
        INCIDENT_PHONE: 'Телефон',
        INCIDENT_COUNT_EVENT: 'за 24 часа',
        INCIDENT_IMMOBILE: 'Неподвижен',
        INCIDENT_EXPECTED: 'Ограничение',
        INCIDENTS_DATA_EMPTY_TITLE: 'Новых происшествий нет.',
        INCIDENTS_DATA_EMPTY_SUBTITLE: 'Все в порядке!',

    });
}

angular
    .module('iqsIncidents.Panel', [
        'iqsIncidents.Panel.Details',
        'iqsIncidents.Panel.List',
        'iqsIncidents.Panel.Map',
        'iqsIncidents.ViewModel',
        'iqsIncidentsConfig'
    ])
    .config(configureIncidentsAccess)
    .config(declareIncidentsResources)
    .run(initIncidents);
