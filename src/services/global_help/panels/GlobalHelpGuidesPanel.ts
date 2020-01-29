import { IGuidesViewModel } from '../../../models';
import { IShellService } from '../../../shell';

interface IGlobalHelpGuidesPanelBindings {
    [key: string]: any;

}

const GlobalHelpGuidesPanelBindings: IGlobalHelpGuidesPanelBindings = {

}

class GlobalHelpGuidesPanelChanges implements ng.IOnChangesObject, IGlobalHelpGuidesPanelBindings {
    [key: string]: ng.IChangesObject<any>;

    onGlobalHelpDetails: ng.IChangesObject<() => ng.IPromise<void>>;
}

class GlobalHelpGuidesPanelController implements ng.IController {          
    public hideButton: boolean;

    constructor(
        private $element: JQuery,
        private $location: ng.ILocationService,
        private $rootScope: ng.IRootScopeService,
        private $state: ng.ui.IStateService,
        public pipMedia: pip.layouts.IMediaService,
        private pipAuxPanel: pip.layouts.IAuxPanelService,
        private iqsGuideViewModel: IGuidesViewModel,
        private iqsShell: IShellService
    ) {
        "ngInject";

        $element.addClass('iqs-global-help-guides-panel');
        this.hideButton = false;
    }

    public $onInit() {
        this.iqsGuideViewModel.read(
            (data: pip.guidance.Guide[]) => {
                let collection = this.collection;
            }, (error: any) => {}
        );
    }

    public onDetails(item: pip.guidance.Guide): void {
        this.iqsGuideViewModel.showGuide(item)
    }

    public get collection(): pip.guidance.Guide[] {
        return this.iqsGuideViewModel.get();
    }

    public get state(): string {
        return this.iqsGuideViewModel.state;
    }

    public get transaction(): pip.services.Transaction {
        return this.iqsGuideViewModel.getTransaction();
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
}

(() => {
    angular
        .module('iqsGlobalHelpGuidesPanel', [])
        .component('iqsGlobalHelpGuidesPanel', {
            bindings: GlobalHelpGuidesPanelBindings,
            // templateUrl: 'services/global_help/panels/GlobalHelpGuidesPanel.html',
            controller: GlobalHelpGuidesPanelController,
            controllerAs: '$ctrl',
            template: `
                <div class="aux-btn-close pointer" ng-click="$ctrl.closeAuxPanel()" ng-if="!$ctrl.hideButton">
                    <md-icon md-svg-icon="icons:cross"></md-icon>
                </div>

                <div class="global-help-guide-list pip-scroll-y layout-column bp0 tp0 flex">
                    <md-list class="pip-ref-list p0">

                        <md-list-item class="pip-ref-list-item pointer lp16 tp0 divider-bottom" ng-repeat="item in $ctrl.collection track by $index"
                                      md-ink-ripple>
                            <div class="layout-row layout-align-start-start pip-content " ng-click="$ctrl.onDetails(item)">
                                <p class="text-subhead2 incidents-description text-overflow flex">
                                    {{ item.app }}, {{ item.version }}
                                    <span ng-if="item.type == 'introduction'">
                                        {{ ::'GUIDES_INTRODUCTION' | translate }}
                                    </span>
                                    <span ng-if="item.type == 'new release'">
                                        {{ ::'GUIDES_RELEASE' | translate }}
                                    </span>
                                </p>
                            </div>
                        </md-list-item>
                    </md-list>

                    <div class="layout-column layout-align-center-center flex iqs-empty" ng-if="$ctrl.state == 'empty'">
                        <div class="pip-empty" style="display: block; height: calc(100%);">
                            <img src="images/empty/empty.svg" class="pip-pic" style="display: block;">
                            <div class="text-subhead1 text-center tm16">
                                {{ ::'GLOBAL_HELP_GUIDES_AUX_DATA_EMPTY_TITLE' | translate }}
                            </div>
                            <div class="text-subhead1 text-center">
                                {{ ::'GLOBAL_HELP_GUIDES_AUX_DATA_EMPTY_SUBTITLE' | translate }}
                            </div>
                        </div>
                    </div>
                </div>
            `
        })
})();
