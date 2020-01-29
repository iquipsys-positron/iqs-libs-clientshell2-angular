import { IEmergencyPlansViewModel } from '../../../models';
import { EmergencyPlan, Severity, EmergencyStep } from '../../../data';
import { IAccessConfigService } from '../../access_config';
import { EmargencyPlanStateName } from '../EmergencyPlansInit';
import { IShellService } from '../../../shell';

interface IEmergencyPlansListPanelBindings {
    [key: string]: any;

    onEmergencyPlanDetails: any;
}

const EmergencyPlansListPanelBindings: IEmergencyPlansListPanelBindings = {
    onEmergencyPlanDetails: '&iqsEmergencyPlanDetails',
}

class EmergencyPlansListPanelChanges implements ng.IOnChangesObject, IEmergencyPlansListPanelBindings {
    [key: string]: ng.IChangesObject<any>;

    onEmergencyPlanDetails: ng.IChangesObject<() => ng.IPromise<void>>;
}

class EmergencyPlansListPanelController implements ng.IController {
    public $onInit() { }
    public severityHigh: number = Severity.High;
    public accessConfig: any;
    public onEmergencyPlanDetails: () => void;
    public hideButton: boolean;

    constructor(
        private $element: JQuery,
        private $location: ng.ILocationService,
        private $rootScope: ng.IRootScopeService,
        private $state: ng.ui.IStateService,
        public pipMedia: pip.layouts.IMediaService,
        private pipAuxPanel: pip.layouts.IAuxPanelService,
        private iqsEmergencyPlansViewModel: IEmergencyPlansViewModel,
        private iqsShell: IShellService,
        private iqsAccessConfig: IAccessConfigService
    ) {
        "ngInject";

        $element.addClass('iqs-emergency-plans-list-panel');
        this.accessConfig = iqsAccessConfig.getStateConfigure(EmargencyPlanStateName).access;
        this.hideButton = false;
    }


    public get collection(): EmergencyPlan[] {
        return this.iqsEmergencyPlansViewModel.getCollection();
    }

    public get state(): string {
        return this.iqsEmergencyPlansViewModel.state;
    }

    public get transaction(): pip.services.Transaction {
        return this.iqsEmergencyPlansViewModel.getTransaction();
    }

    public selectItem(index?: number) {
        this.iqsEmergencyPlansViewModel.selectItem(index);
        this.onEmergencyPlanDetails();
    }

    public onDetails(item: EmergencyPlan): void {
        this.iqsEmergencyPlansViewModel.selectItemById(item.id);
        if (this.iqsEmergencyPlansViewModel.selectedItem) {
            _.each(this.iqsEmergencyPlansViewModel.selectedItem.steps, (step: EmergencyStep) => {
                step.checked = false;
            });
        }

        this.onEmergencyPlanDetails();
    }

    public get selectedItem(): EmergencyPlan {
        return this.iqsEmergencyPlansViewModel.selectedItem;
    }

    public get selectedIndex(): number {
        return this.iqsEmergencyPlansViewModel.selectedIndex;
    }

    public set selectedIndex(index: number) {
        // this.iqsEmergencyPlansViewModel.selectedIndex = value;
    }

    public closeAuxPanel() {
        this.hideButton = true;
        this.pipAuxPanel.close();

        this.iqsShell.panel = '';
        setTimeout(() => {
            this.hideButton = false;
            this.$rootScope.$broadcast('pipMainResized');
        }, 600);

    }

    public onConfigure() {
        // this.$state.go('settings_system.emergency_plans');
        window.location.href = window.location.origin + '/config_emergency/index.html#';
    }
}

(() => {
    angular
        .module('iqsEmergencyPlansListPanel', ['iqsEmergencyPlans.ViewModel', 'iqsShellService'])
        .component('iqsEmergencyPlansListPanel', {
            bindings: EmergencyPlansListPanelBindings,
            // templateUrl: 'services/emergency_plans/panels/EmergencyPlansListPanel.html',
            controller: EmergencyPlansListPanelController,
            controllerAs: '$ctrl',
            template: `
                <div class="aux-btn-close pointer" ng-click="$ctrl.closeAuxPanel()" ng-if="!$ctrl.hideButton">
                    <md-icon md-svg-icon="icons:cross"></md-icon>
                </div>

                <div class="text-title">
                    {{ ::'EMERGENCY_PLANS_AUX_TITLE' | translate }}
                </div>


                <div class="emergency-plans-list pip-scroll-y layout-column bp0 tp0 flex">

                    <md-list class="pip-ref-list p0" ng-if="$ctrl.state == 'data'">

                        <md-list-item class="pip-ref-list-item pointer lp16 tp0 divider-bottom" ng-repeat="item in $ctrl.collection track by $index"
                                      md-ink-ripple>
                            <div class="layout-row layout-align-start-start pip-content" ng-click="$ctrl.onDetails(item)">
                                <p class="text-subhead2 incidents-description text-overflow flex">
                                    {{ item.name }}
                                </p>
                                <div class="flex-fixed">
                                    <md-icon class="m0 flex-fixed" md-svg-icon="icons:chevron-right"></md-icon>
                                </div>
                            </div>
                        </md-list-item>
                    </md-list>


                    <div class="layout-column layout-align-center-center flex iqs-empty" ng-if="$ctrl.state == 'empty'">
                        <div class="pip-empty" style="display: block;">
                            <img src="images/empty/empty.svg" class="pip-pic" style="display: block;">
                            <div class="text-subhead1 text-center tm16">
                                {{ ::'EMERGENCY_PLANS_AUX_DATA_EMPTY_TITLE' | translate }}
                            </div>
                            <div class="text-subhead1 text-center">
                                {{ ::'EMERGENCY_PLANS_AUX_DATA_EMPTY_SUBTITLE' | translate }}
                            </div>
                        </div>
                    </div>
                </div>

                <div class="iqs-footer" ng-if="$ctrl.accessConfig.emergencyPlanConfig">
                    <md-list class="pip-ref-list">
                        <md-list-item class="pip-ref-list-item layout-row layout-align-start-start" md-ink-ripple ng-click="$ctrl.onConfigure()">
                            <div class="pip-content">
                                <div class="text-body1 text-overflow">
                                    {{ ::'EMERGENCY_PLANS_AUX_BUTTON_OPTIONS' | translate }}
                                </div>
                            </div>
                            <div class="flex-fixed">
                                <md-icon class="m0 flex-fixed" md-svg-icon="icons:chevron-right"></md-icon>
                            </div>
                        </md-list-item>
                    </md-list>
                </div>

                <div class="iqs-footer" ng-if="!$ctrl.accessConfig.emergencyPlanConfig">
                    <md-list class="pip-ref-list">
                        <md-list-item class="pip-ref-list-item tp4 layout-row md-list-item layout-align-start-start">
                            <div class="pip-content">
                                <div class="text-body1 text-overflow color-secondary-text tp2">
                                    {{ ::'EMERGENCY_PLANS_AUX_BUTTON_OPTIONS' | translate }}
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
