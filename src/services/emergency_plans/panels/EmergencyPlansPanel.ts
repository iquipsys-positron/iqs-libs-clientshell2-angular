import './EmergencyPlansDetailsPanel';
import './EmergencyPlansListPanel';
import { IEmergencyPlansViewModel } from '../../../models';
import { EmergencyPlan } from '../../../data';
import { EmergencyPlanPanelState } from './EmergencyPlanPanelState';

interface IEmergencyPlansPanelBindings {
    [key: string]: any;
}

const EmergencyPlansPanelBindings: IEmergencyPlansPanelBindings = {

}

class EmergencyPlansPanelChanges implements ng.IOnChangesObject, IEmergencyPlansPanelBindings {
    [key: string]: ng.IChangesObject<any>;
}

class EmergencyPlansPanelController implements ng.IController {
    public $onInit() { }
    public _panelState: string;
    public cleanupFn: Function;
    public cleanUpFunc: Function;
    private mediaSizeGtSm: boolean;

    constructor(
        private $element: JQuery,
        private $location: ng.ILocationService,
        $rootScope: ng.IRootScopeService,
        private $timeout: ng.ITimeoutService,
        $state: ng.ui.IStateService,
        private pipActions: pip.nav.IActionsService,
        public pipMedia: pip.layouts.IMediaService,
        private pipAuxPanel: pip.layouts.IAuxPanelService,
        private iqsEmergencyPlansViewModel: IEmergencyPlansViewModel,
    ) {
        "ngInject";

        $element.addClass('iqs-emergency-plans-panel');
        this.mediaSizeGtSm = this.pipMedia('gt-sm');

        // lisener open eventfor update panel
        this.cleanupFn = $rootScope.$on('iqsEmergencyPlansOpen', () => {
            this.init();
        });

        this.init();

        this.cleanUpFunc = $rootScope.$on('pipMainResized', () => {
            if (this.mediaSizeGtSm !== this.pipMedia('gt-sm')) {
                this.mediaSizeGtSm = this.pipMedia('gt-sm');
                if (this.pipMedia('gt-sm')) {
                    this.panelState = this._panelState;
                }
            }
        });
    }

    public $onDestroy(): void {
        if (this.cleanupFn) {
            this.cleanupFn();
        }
        if (this.cleanUpFunc) {
            this.cleanUpFunc();
        }
    }

    private init() {
        // open panel
        let currentEmergencyPlan = this.iqsEmergencyPlansViewModel.mustOpened;
        let index: number = currentEmergencyPlan && currentEmergencyPlan.id ? _.findIndex(this.iqsEmergencyPlansViewModel.getCollection(), { id: currentEmergencyPlan.id }) : -1;
        if (index > -1) {
            this.iqsEmergencyPlansViewModel.selectItem(index);
            this.panelState = EmergencyPlanPanelState.Details;
        } else {
            this.panelState = EmergencyPlanPanelState.List;
            this.iqsEmergencyPlansViewModel.mustOpened = null;
        }
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
    }

    public get selectedItem(): EmergencyPlan {
        return this.iqsEmergencyPlansViewModel.selectedItem;
    }

    public onList(): void {
        this.iqsEmergencyPlansViewModel.mustOpened = null;
        this.panelState = EmergencyPlanPanelState.List;
    }

    public onDetails(): void {
        this.iqsEmergencyPlansViewModel.mustOpened = this.iqsEmergencyPlansViewModel.selectedItem;
        this.panelState = EmergencyPlanPanelState.Details;
    }

    public get panelState(): string {
        return this._panelState;
    }

    public set panelState(state: string) {
        this._panelState = state;
        if (this._panelState == EmergencyPlanPanelState.Details) {
            // show bage
            this.$timeout(() => {
                this.pipActions.updateCount('global.emergency', 100);
            }, 0);
        } else {
            // hide bage 
            this.$timeout(() => {
                this.pipActions.updateCount('global.emergency', 0);
            }, 0);
        }
    }

}

(() => {
    angular
        .module('iqsEmergencyPlansPanel', ['iqsEmergencyPlansDetailsPanel', 'iqsEmergencyPlansListPanel', 'iqsEmergencyPlans.ViewModel'])
        .component('iqsEmergencyPlansPanel', {
            bindings: EmergencyPlansPanelBindings,
            // templateUrl: 'services/emergency_plans/panels/EmergencyPlansPanel.html',
            controller: EmergencyPlansPanelController,
            controllerAs: '$ctrl',
            template: `
                <iqs-emergency-plans-list-panel ng-if="$ctrl.panelState == 'list'" iqs-emergency-plan-details="$ctrl.onDetails()">

                </iqs-emergency-plans-list-panel>

                <iqs-emergency-plans-details-panel ng-if="$ctrl.panelState == 'details'" iqs-emergency-plan="$ctrl.selectedItem"
                                                   iqs-emergency-plan-list="$ctrl.onList()">

                </iqs-emergency-plans-details-panel>
            `
        })
})();
