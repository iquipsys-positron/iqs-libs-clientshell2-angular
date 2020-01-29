import '../EmergencyPlanActionPageManager';
import { EmergencyPlan, EmergencyStep, EmergencyAction, EmergencyActionType, } from '../../../data';
import { IEmergencyPlansViewModel } from '../../../models';
import { TypeCollection } from '../../type_collections';
import { IEmergencyPlanActionPageManager } from '../../emergency_plans/IEmergencyPlanActionPageManager';
import { IShellService } from '../../../shell';

interface IEmergencyPlansDetailsPanelBindings {
    [key: string]: any;

    emergencyPlan: any;
    onEmergencyPlanList: any;
}

const EmergencyPlansDetailsPanelBindings: IEmergencyPlansDetailsPanelBindings = {
    emergencyPlan: '<?iqsEmergencyPlan',
    onEmergencyPlanList: '&iqsEmergencyPlanList'
}

class EmergencyPlansDetailsPanelChanges implements ng.IOnChangesObject, IEmergencyPlansDetailsPanelBindings {
    [key: string]: ng.IChangesObject<any>;

    emergencyPlan: ng.IChangesObject<EmergencyPlan>;
    onEmergencyPlanList: ng.IChangesObject<() => ng.IPromise<void>>;
}

class EmergencyPlansDetailsPanelController implements ng.IController {
    public $onInit() { }
    private emergencyPlan: EmergencyPlan;
    public typeCollection: TypeCollection;

    public onEmergencyPlanList: () => void;

    public hideButton: boolean;

    constructor(
        private $element: JQuery,
        private $state: ng.ui.IStateService,
        private pipAuxPanel: pip.layouts.IAuxPanelService,
        private pipTranslate: pip.services.ITranslateService,
        private iqsEmergencyPlansViewModel: IEmergencyPlansViewModel,
        private iqsEmergencyPlanActionPageManager: IEmergencyPlanActionPageManager,
        private iqsShell: IShellService
    ) {
        "ngInject";

        $element.addClass('iqs-emergency-plan-details-panel');

        this.init();
    }

    private init(): void {
        if (!this.emergencyPlan) {

            return
        }

        _.each(this.emergencyPlan.steps, (step: EmergencyStep) => {
            _.each(step.actions, (action: EmergencyAction) => {
                if (action.type == EmergencyActionType.LocalLink) {
                    action.params.pageTitle = this.iqsEmergencyPlanActionPageManager.getPageTitle(action);
                }
            });
        });
        this.hideButton = false;
        // this.typeCollection = this.iqsTypeCollectionService.getEventRuleType();

    }

    public closeAuxPanel(): void {
        this.pipAuxPanel.close();
        this.hideButton = true;
        this.iqsShell.panel = '';
        setTimeout(() => {
            this.hideButton = false;
            // this.onEmergencyPlanList();
        }, 600);
    }

    public get transaction(): pip.services.Transaction {
        return this.iqsEmergencyPlansViewModel.getTransaction();
    }

    public onCheck(index: number): void {
        if (index < 0 || index >= this.emergencyPlan.steps.length) { return }

        this.emergencyPlan.steps[index].checked = !this.emergencyPlan.steps[index].checked;
    }

    public onPageClick(page: string): void {
        this.iqsEmergencyPlanActionPageManager.onPageClick(page);
    }

    public isEPComplete(): boolean {
        let index = _.findIndex(this.emergencyPlan.steps, (step: EmergencyStep) => {
            return !step.checked
        });

        return index == -1;
    }

    public onEPComplete(): void {
        this.onEmergencyPlanList();
    }
}

(() => {
    angular
        .module('iqsEmergencyPlansDetailsPanel', ['iqsEmergencyPlanActionPageManager', 'iqsEmergencyPlans.ViewModel'])
        .component('iqsEmergencyPlansDetailsPanel', {
            bindings: EmergencyPlansDetailsPanelBindings,
            // templateUrl: 'services/emergency_plans/panels/EmergencyPlansDetailsPanel.html',
            controller: EmergencyPlansDetailsPanelController,
            controllerAs: '$ctrl',
            template: `
                <div class="aux-btn-close pointer" ng-click="$ctrl.closeAuxPanel()" ng-if="!$ctrl.hideButton">
                	<md-icon md-svg-icon="icons:cross"></md-icon>
                </div>

                <div class="text-title layout-row layout-align-start-start">
                	<md-button class="md-icon-button flex-fixed" ng-click="$ctrl.onEmergencyPlanList()">
                		<md-icon md-svg-icon="icons:arrow-left"></md-icon>
                	</md-button>
                	<div>
                		{{ $ctrl.emergencyPlan.name }}
                	</div>
                </div>


                <div class="pip-ref-list pip-scroll-y layout-column p16 tp0 flex">

                	<div ng-repeat="estep in $ctrl.emergencyPlan.steps track by estep.index">
                		<div class="layout-row layout-align-start-start pointer" ng-click="$ctrl.onCheck($index)">
                			<div class="flex-fixed">
                				<md-button class="md-icon-button m0 tm4  rm16">
                					<div class="iqs-bulet color-content {{ estep.checked ? 'color-disabled-bg' : 'color-primary-bg' }}" style="border-radius: 12px; width:24px; height: 24px; line-height: 24px; text-align: center">
                						{{ estep.index }}
                					</div>
                				</md-button>
                			</div>
                			<div class="text-body1 flex tp16 {{ estep.checked ? 'ep-step-name-uncheck' : '' }}">
                				{{ estep.name }}
                			</div>
                		</div>
                		<div ng-repeat="action in estep.actions track by $index" style="margin-left: 56px;">
                			<!--note-->
                			<div class="tm16 text-body1" ng-if="action.type == 'note' && action.params['text']">
                				{{ action.params['text'] }}
                			</div>
                			<!--phone-->
                			<div class="text-body1" ng-if="action.type == 'call phone' && action.params['phone']">
                				{{ action.params['phone'] }}
                			</div>
                			<!--local link-->
                			<div ng-if="action.type == 'local link' && action.params['page']">
                				<md-button class="color-primary" style="margin-left: -6px;" ng-click="$ctrl.onPageClick(action.params['page'])"
                				           ng-if="action.params['pageTitle']">
                					{{ action.params['pageTitle'] | translate }}
                				</md-button>

                				<div class="tm8 text-body1" ng-if="action.params['text']">
                					{{ action.params['text'] }}
                				</div>
                			</div>
                			<!--global link-->
                			<div class="text-body1" ng-if="action.type == 'global link' && action.params['uri']">
                				<a href="{{ action.params['uri'] }}" target="_bank">{{ action.params['uri'] }}</a>
                			</div>
                		</div>
                	</div>
                	<div class="layout-row layout-align-center-center tm16 bm16" ng-if="$ctrl.isEPComplete()">
                		<md-button class="color-primary-bg" ng-click="$ctrl.onEPComplete()">
                			{{ ::'EMERGENCY_DATAILS_COMPLETE_BUTTON' | translate }}
                		</md-button>
                	</div>

                </div>
            `
        })
})();
