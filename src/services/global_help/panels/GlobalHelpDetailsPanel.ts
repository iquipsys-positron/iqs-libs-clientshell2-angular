import { GlobalHelpConfigSection } from '../GlobalHelpConfig';
import { IShellService } from '../../../shell';

interface IGlobalHelpDetailsPanelBindings {
    [key: string]: any;

    section: any;
    onGlobalHelpList: any;
}

const GlobalHelpDetailsPanelBindings: IGlobalHelpDetailsPanelBindings = {
    section: '<?iqsGlobalHelp',
    onGlobalHelpList: '&iqsGlobalHelpList'
}

class GlobalHelpDetailsPanelChanges implements ng.IOnChangesObject, IGlobalHelpDetailsPanelBindings {
    [key: string]: ng.IChangesObject<any>;

    section: ng.IChangesObject<GlobalHelpConfigSection>;
    onGlobalHelpList: ng.IChangesObject<() => ng.IPromise<void>>;
}

class GlobalHelpDetailsPanelController implements ng.IController {
    public $onInit() { }
    public section: GlobalHelpConfigSection;
    public current: GlobalHelpConfigSection = new GlobalHelpConfigSection();

    public onGlobalHelpList: () => void;

    public hideButton: boolean;
    private server: string = 'http://www.positron.stage.iquipsys.net/#/';

    constructor(
        private $element: JQuery,
        private $state: ng.ui.IStateService,
        public pipMedia: pip.layouts.IMediaService,
        private pipAuxPanel: pip.layouts.IAuxPanelService,
        private pipTranslate: pip.services.ITranslateService,
        private iqsShell: IShellService
    ) {
        "ngInject";

        $element.addClass('iqs-emergency-plan-details-panel');

        this.init();
    }

    private init(): void {
        if (!this.section) {

            return
        }

        let lang: string = this.pipTranslate.language;
        this.current.src = this.section.src[lang];
        this.current.title = this.pipTranslate.translate(this.section.title);
        this.current.text = this.pipTranslate.translate(this.section.text);

        this.hideButton = false;
    }

    public closeAuxPanel(): void {
        this.pipAuxPanel.close();
        this.hideButton = true;
        this.iqsShell.panel = '';
        setTimeout(() => {
            this.hideButton = false;
            // this.onGlobalHelpList();
        }, 600);
    }

    public onSateClick() {
        if (this.section && this.section.url) {
            window.location.href = window.location.origin + this.section.url;
        } else if (this.section && this.section.state) {
            this.$state.go(this.section.state, this.section.stateParams);
        }
    }

}

(() => {
    angular
        .module('iqsGlobalHelpDetailsPanel', [])
        .component('iqsGlobalHelpDetailsPanel', {
            bindings: GlobalHelpDetailsPanelBindings,
            // templateUrl: 'services/global_help/panels/GlobalHelpDetailsPanel.html',
            controller: GlobalHelpDetailsPanelController,
            controllerAs: '$ctrl',
            template: `
                <div class="aux-btn-close pointer" ng-click="$ctrl.closeAuxPanel()" ng-if="!$ctrl.hideButton">
                    <md-icon md-svg-icon="icons:cross"></md-icon>
                </div>

                <div class="text-title layout-row layout-align-start-start">
                    <md-button class="md-icon-button flex-fixed" ng-click="$ctrl.onGlobalHelpList()">
                        <md-icon md-svg-icon="icons:arrow-left"></md-icon>
                    </md-button>
                    <div>
                        {{ $ctrl.current.title }}
                    </div>
                </div>

                <div class="pip-ref-list pip-scroll-y layout-column p16 tp0 flex">


                    <iframe width="288" height="166" frameborder="0" allowfullscreen ng-src="{{ $ctrl.current.src }}" style="margin: 0 auto;"
                            ng-if="$ctrl.current.src">
                    </iframe>

                    <pip-markdown class="tm24" pip-text="$ctrl.current.text" pip-rebind="true">
                    </pip-markdown>

                    <div ng-if="$ctrl.section.state">
                        <md-button class="color-primary" style="margin-left: -6px;" ng-click="$ctrl.onSateClick()">

                            <span ng-if="$ctrl.section.stateName">
                                {{ $ctrl.section.stateName | translate }}
                            </span>
                            <span ng-if="!$ctrl.section.stateName">
                                {{ 'GLOBAL_HELP_STATE_DEFAULT_NAME' | translate }}
                            </span>
                        </md-button>
                    </div>
                </div>
            `
        })
})();
