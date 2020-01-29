import { Incident, Severity, Resolution } from '../../data';
import {
    IIncidentsViewModel,
    IResolutionsViewModel
} from '../../models';
import { IncidentsStateName } from './Incidents';
import {
    IAccessConfigService,
    ILoadingService,
    LoadingCompleteEvent
} from '../../services';
import { IShellService } from '../../shell';

interface IIncidentsListPanelBindings {
    [key: string]: any;

    onIncidentDetails: any;
}

const IncidentsListPanelBindings: IIncidentsListPanelBindings = {
    onIncidentDetails: '&iqsIncidentDetails',
}

class IncidentsListPanelController implements ng.IController {
    public $onInit() { }
    public severityHigh: number = Severity.High;
    private cf: Function[] = [];
    public onIncidentDetails: () => void;
    public hideButton: boolean;
    public accessConfig: any;
    public transactionAll: pip.services.Transaction;

    constructor(
        private $element: JQuery,
        private $location: ng.ILocationService,
        private $state: ng.ui.IStateService,
        private $rootScope: ng.IRootScopeService,
        public $scope: ng.IScope,
        private $interval: ng.IIntervalService,
        public pipMedia: pip.layouts.IMediaService,
        private pipDateFormat: pip.dates.IDateFormatService,
        private pipTranslate: pip.services.ITranslateService,
        private pipAuxPanel: pip.layouts.IAuxPanelService,
        private iqsIncidentsViewModel: IIncidentsViewModel,
        private iqsShell: IShellService,
        private iqsAccessConfig: IAccessConfigService,
        private pipConfirmationDialog: pip.dialogs.IConfirmationDialogService,
        private iqsResolutionsViewModel: IResolutionsViewModel,
        private pipTransaction: pip.services.ITransactionService,
        private iqsLoading: ILoadingService
    ) {
        "ngInject";

        $element.addClass('iqs-incidents-list-panel');
        const runWhenReady = () => {
            this.hideButton = false;
            this.accessConfig = this.iqsAccessConfig.getStateConfigure(IncidentsStateName).access;
            let collection = this.iqsIncidentsViewModel.getCollection();
        }

        this.cf.push($rootScope.$on('iqsReadIncident', () => {
            if (pipAuxPanel.isOpen() && iqsShell.panel == 'incident') {
                this.iqsIncidentsViewModel.reCalcElapsedDate();
            }
        }));
        if (this.iqsLoading.isDone) { runWhenReady(); }
        this.cf.push(this.$rootScope.$on(LoadingCompleteEvent, runWhenReady.bind(this)));

        this.transactionAll = this.pipTransaction.create('INCIDENT_ALL');
    }

    public $onDestroy() {
        for (const f of this.cf) { f(); }
    }

    public get collection(): Incident[] {
        return this.iqsIncidentsViewModel.getCollection();
    }

    public get state(): string {
        return this.iqsIncidentsViewModel.state;
    }

    public get transaction(): pip.services.Transaction {
        return this.iqsIncidentsViewModel.getTransaction();
    }

    public selectItem(index?: number) {
        this.iqsIncidentsViewModel.selectItem(index);
        this.onIncidentDetails();
    }

    public onDetails(item: Incident): void {
        if (this.transactionAll.busy()) {
            return;
        }

        this.iqsIncidentsViewModel.selectItemById(item.id);
        this.onIncidentDetails();
    }

    public get shortIncidentListCount(): number {
        return this.iqsIncidentsViewModel.shortIncidentListCount;
    }

    public get selectedItem(): Incident {
        return this.iqsIncidentsViewModel.selectedItem;
    }

    public get hideAll(): boolean {
        return this.iqsIncidentsViewModel.hideAll;
    }

    // public getElapsedTime(time): string {
    //     return this.pipDateFormat.formatMiddleElapsed(time);
    // }
    public onShowAll() {
        this.iqsIncidentsViewModel.hideAll = !this.iqsIncidentsViewModel.hideAll;

        let collection = this.iqsIncidentsViewModel.getCollection();
    }

    public get selectedIndex(): number {
        return this.iqsIncidentsViewModel.selectedIndex;
    }

    public get total(): number {
        return this.iqsIncidentsViewModel.total;
    }

    public set selectedIndex(value: number) {
        this.iqsIncidentsViewModel.selectedIndex = value;
    }

    public closeAuxPanel() {
        this.hideButton = true;
        this.iqsIncidentsViewModel.hideAll = true;
        this.iqsShell.panel = '';

        this.pipAuxPanel.close();
        setTimeout(() => {
            this.hideButton = false;
            this.$rootScope.$broadcast('pipMainResized');
        }, 600);

    }

    public onConfigure() {
        // this.$state.go('settings_system.incidents');
        window.location.href = window.location.origin + `/incidents/index.html#/app`;
    }

    public getResolution(rule_id: string): Resolution {
        let resolution: Resolution = new Resolution();

        let resolutions = this.iqsResolutionsViewModel.getResolutionsByEventRuleId(rule_id);

        if (resolutions && resolutions.length > 0) {
            // search default resolution for this rule
            let defaultResolutionIndex = _.findIndex(resolutions, (r: Resolution) => {
                return r.default == true && r.rule_ids && r.rule_ids.length > 0;
            });
            // search default resolution for all rule
            if (defaultResolutionIndex == -1) {
                defaultResolutionIndex = _.findIndex(resolutions, (r: Resolution) => {
                    return r.default == true;
                });
            }
            if (defaultResolutionIndex > -1) {
                resolution = resolutions[defaultResolutionIndex];
            } else {
                resolution.resolution = this.pipTranslate.translate('INCIDENT_DEFAULT_RESOLUTION');
            }
        } else {
            resolution.resolution = this.pipTranslate.translate('INCIDENT_DEFAULT_RESOLUTION');
        }

        return resolution;
    }

    public onCloseAll(): void {
        if (this.transactionAll.busy()) {
            return;
        }
        this.pipConfirmationDialog.show(
            {
                event: null,
                title: this.pipTranslate.translate('INCIDENT_CLOSE_ALL_CONFIRMATION'),
                ok: 'INCIDENT_CLOSE_ALL_BUTTON',
                cancel: 'CANCEL'
            },
            () => {
                this.transactionAll.begin('START_CLOSE_ALL');

                let collection = this.iqsIncidentsViewModel.getAll();
                async.each(collection,
                    (incident: Incident, callback) => {
                        let res = this.getResolution(incident.rule_id);
                        let updateIncident: Incident = <Incident>{ resolution: res.resolution };
                        if (res && res.id) {
                            updateIncident.resolution_id = res.id;
                        } else {
                            updateIncident.resolution_id = 'all';
                        }
                        this.iqsIncidentsViewModel.updateIncidentById(incident.id,
                            updateIncident,
                            (data: Incident) => {
                                this.iqsIncidentsViewModel.removeItem(data.id);
                                callback();
                            },
                            (error: any) => {
                                // todohandle error
                                callback(error);
                            });
                    },
                    (error) => {
                        if (!error) {
                            this.transactionAll.end();
                        } else {
                            // show toast
                            this.transactionAll.end(error);
                        }
                    });
            });


    }
}

(() => {
    angular
        .module('iqsIncidents.Panel.List', [
            'iqsIncidents.ViewModel',
            'iqsResolutions.ViewModel'
        ])
        .component('iqsIncidentsListPanel', {
            bindings: IncidentsListPanelBindings,
            // templateUrl: 'incidents/panels/IncidentsListPanel.html',
            controller: IncidentsListPanelController,
            controllerAs: '$ctrl',
            template: `
                <div class="aux-btn-close pointer" ng-click="$ctrl.closeAuxPanel()" ng-if="!$ctrl.hideButton">
                    <md-icon md-svg-icon="icons:cross"></md-icon>
                </div>

                <div class="text-title">
                    {{ ::'INCIDENT_TITLE' | translate }}
                </div>

                <md-list class="pip-ref-list insidents-list pip-scroll-y bp0 tp0" ng-if="$ctrl.state == 'data'" pip-selected="$ctrl.selectedIndex"
                    pip-select="$ctrl.selectItem($event.index)">

                    <md-list-item class="pip-ref-list-item pointer lp16 tp0 pip-selectable" ng-repeat="item in $ctrl.collection track by item.id"
                        md-ink-ripple>
                        <div class="layout-row layout-align-start-start pip-ref-list-item-clicked" ng-click="$ctrl.onDetails(item)">
                            <pip-avatar class="pip-face pip-pic" pip-rebind="true" pip-id="item.ref_id" pip-name="item.ref_name">
                            </pip-avatar>
                            <div class="pip-content divider-bottom">
                                <div class="layout-row layout-align-start-start bm4">
                                    <div class="flex">
                                        <p class="text-subhead2 incidents-description text-overflow">
                                            {{ ::item.description }}
                                        </p>
                                    </div>
                                    <div class="incidents-icon flex-fixed">
                                        <md-icon md-svg-icon="icons:stop" ng-if="item.severity == $ctrl.severityHigh" class="color-error">
                                        </md-icon>
                                    </div>
                                </div>
                                <div class="layout-row layout-align-start-start bm4">
                                    <div class="text-body1 incidents-subtitle text-overflow flex">
                                        {{ ::item.object.name }}
                                    </div>
                                </div>
                                <div class="layout-row layout-align-start-start">
                                    <div class="text-body1 incidents-time flex-fixed">
                                        {{ item.timeString }}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </md-list-item>

                    <md-list-item class="pip-ref-list-item pointer iqs-ref-list-button divider-bottom" md-ink-ripple>
                        <md-button class="md-accent lp8 rp8" ng-click="$ctrl.onCloseAll()" ng-disabled="!$ctrl.accessConfig.incidentClose || $ctrl.transactionAll.busy()">
                            {{ 'Закрыть все' }}
                        </md-button>
                        <div class="flex"></div>
                        <md-button class="md-accent lm16 lp8 rp8" ng-if="$ctrl.total > $ctrl.shortIncidentListCount && $ctrl.hideAll" ng-click="$ctrl.onShowAll()"
                            ng-disabled="$ctrl.transactionAll.busy()">
                            {{ ::'INCIDENT_SHOW_ALL' | translate }}
                        </md-button>
                        <md-button class="md-accent lm16 rm16 lp8 rp8" ng-if="$ctrl.total > $ctrl.shortIncidentListCount && !$ctrl.hideAll" ng-click="$ctrl.onShowAll()"
                            ng-disabled="$ctrl.transactionAll.busy()">
                            {{ ::'INCIDENT_HIDE_ALL' | translate }}
                        </md-button>
                    </md-list-item>

                </md-list>

                <div class="insidents-list pip-scroll-y layout-column bp0 tp0 flex" ng-if="$ctrl.state == 'empty'">
                    <div class="layout-column layout-align-center-center flex iqs-empty">
                        <div class="pip-empty layout-column layout-align-center-center" xxxstyle="display: block; height: calc(100%);">
                            <img src="images/empty/empty.svg" class="pip-pic" style="display: block;">
                            <div class="text-title text-center tm16">
                                {{ ::'INCIDENTS_DATA_EMPTY_TITLE' | translate }}
                            </div>
                            <div class="text-subhead1 text-center">
                                {{ ::'INCIDENTS_DATA_EMPTY_SUBTITLE' | translate }}
                            </div>
                        </div>
                    </div>
                </div>

                <div class="iqs-footer" ng-if="$ctrl.accessConfig.incidentConfig">
                    <md-list class="pip-ref-list">
                        <md-list-item class="pip-ref-list-item layout-row md-list-item layout-align-start-start" md-ink-ripple ng-click="$ctrl.onConfigure()">
                            <div class="pip-content">
                                <div class="text-body1 text-overflow">
                                    {{ ::'INCIDENT_BUTTON_OPTIONS' | translate }}
                                </div>
                            </div>
                            <div class="flex-fixed">
                                <md-icon class="m0 flex-fixed" md-svg-icon="icons:chevron-right"></md-icon>
                            </div>
                        </md-list-item>
                    </md-list>
                </div>
                <!--  do not have access -->
                <div class="iqs-footer tp4" ng-if="!$ctrl.accessConfig.incidentConfig">
                    <md-list class="pip-ref-list">
                        <md-list-item class="pip-ref-list-item layout-row md-list-item layout-align-start-start">
                            <div class="pip-content">
                                <div class="text-body1 text-overflow color-secondary-text tp2">
                                    {{ ::'INCIDENT_BUTTON_OPTIONS' | translate }}
                                </div>
                            </div>
                            <div class="tp8 flex-fixed color-secondary-text">
                                <md-icon class="m0 flex-fixed" md-svg-icon="icons:chevron-right"></md-icon>
                            </div>
                        </md-list-item>
                    </md-list>
                </div>
            `
        })
})();
