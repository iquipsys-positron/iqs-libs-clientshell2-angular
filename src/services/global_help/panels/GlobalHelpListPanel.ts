import { GLOBAL_HELP, GlobalHelpConfigSection, GlobalHelpConfig } from '../GlobalHelpConfig';
import { IHelpTopicsDataService } from '../../../data';
import { IShellService } from '../../../shell';

interface IGlobalHelpListPanelBindings {
    [key: string]: any;

    onGlobalHelpDetails: any;
}

const GlobalHelpListPanelBindings: IGlobalHelpListPanelBindings = {
    onGlobalHelpDetails: '&iqsGlobalHelpDetails',
}

class GlobalHelpListPanelChanges implements ng.IOnChangesObject, IGlobalHelpListPanelBindings {
    [key: string]: ng.IChangesObject<any>;

    onGlobalHelpDetails: ng.IChangesObject<() => ng.IPromise<void>>;
}

class SelectedItem {
    item: GlobalHelpConfigSection
}

class GlobalHelpListPanelController implements ng.IController {          public $onInit() {}
    public onGlobalHelpDetails: (param: SelectedItem) => void;
    public hideButton: boolean;
    public collection: GlobalHelpConfigSection[] = GLOBAL_HELP.sections;
    public language: string;

    constructor(
        private $element: JQuery,
        private $location: ng.ILocationService,
        private $rootScope: ng.IRootScopeService,
        private $state: ng.ui.IStateService,
        public pipMedia: pip.layouts.IMediaService,
        private pipAuxPanel: pip.layouts.IAuxPanelService,
        private iqsShell: IShellService,
        private iqsHelpTopicsData: IHelpTopicsDataService,
        private pipTranslate: pip.services.ITranslateService
    ) {
        "ngInject";

        $element.addClass('iqs-global-help-list-panel');
        this.hideButton = false;
        this.language = this.pipTranslate.language || 'en';
    }


    public onDetails(item: GlobalHelpConfigSection): void {

        this.onGlobalHelpDetails({ item: item});
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

    public onOpenHelp() {
        this.$rootScope.$broadcast('iqsHelp');
    }

}

(() => {
    angular
        .module('iqsGlobalHelpListPanel', [])
        .component('iqsGlobalHelpListPanel', {
            bindings: GlobalHelpListPanelBindings,
            // templateUrl: 'services/global_help/panels/GlobalHelpListPanel.html',
            controller: GlobalHelpListPanelController,
            controllerAs: '$ctrl',
            template: `
                <div class="text-title">
                    {{ ::'GLOBAL_HELP_AUX_TITLE' | translate }}
                </div>

                <div class="aux-btn-close pointer" ng-click="$ctrl.closeAuxPanel()" ng-if="!$ctrl.hideButton">
                    <md-icon md-svg-icon="icons:cross"></md-icon>
                </div>

                <div class="global-help-list pip-scroll-y layout-column bp0 tp0 flex">
                    <md-list class="pip-ref-list p0">

                        <md-list-item class="pip-ref-list-item pointer lp16 tp0 divider-bottom" ng-repeat="item in $ctrl.collection track by $index"
                                      md-ink-ripple>
                            <div class="layout-row layout-align-start-start pip-content " ng-click="$ctrl.onDetails(item)">
                                <p class="text-subhead2 incidents-description text-overflow flex">
                                    {{ item.title | translate }}
                                </p>
                                <div class="flex-fixed">
                                    <md-icon class="m0 flex-fixed" md-svg-icon="icons:chevron-right"></md-icon>
                                </div>
                            </div>
                        </md-list-item>
                    </md-list>

                    <div class="tm48 bm48 lm24 rm24 text-subhead1 text-center tm16">
                        {{ ::'GLOBAL_HELP_SUPPORT_MAIL' | translate }}
                        <a href="mailto:support@iquipsys.com">support@iquipsys.com</a>
                        <br><br>
                        {{ ::'GLOBAL_HELP_SUPPORT_PORTAL_PRE' | translate }}
                        <a href="http://help.positron.iquipsys.net?lang={{ $ctrl.language }}" target="_blank">{{ ::'GLOBAL_HELP_SUPPORT_PORTAL_LINK' | translate }}</a>
                        {{ ::'GLOBAL_HELP_SUPPORT_PORTAL_POST' | translate }}
                    </div>

                    <div class="layout-column layout-align-center-center flex iqs-empty" ng-if="$ctrl.state == 'empty'">
                        <div class="pip-empty" style="display: block; height: calc(100%);">
                            <img src="images/empty/empty.svg" class="pip-pic" style="display: block;">
                            <div class="text-subhead1 text-center tm16">
                                {{ ::'GLOBAL_HELP_AUX_DATA_EMPTY_TITLE' | translate }}
                            </div>
                            <div class="text-subhead1 text-center">
                                {{ ::'GLOBAL_HELP_AUX_DATA_EMPTY_SUBTITLE' | translate }}
                            </div>
                        </div>
                    </div>
                </div>
            `
        })
})();
