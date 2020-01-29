import './GlobalHelpDetailsPanel';
import './GlobalHelpGuidesPanel';
import './GlobalHelpListPanel';
import { GlobalHelpPanelState } from './GlobalHelpPanelState';
import { GlobalHelpConfigSection } from '../GlobalHelpConfig';

interface IGlobalHelpPanelBindings {
    [key: string]: any;
}

const GlobalHelpPanelBindings: IGlobalHelpPanelBindings = {

}

class GlobalHelpPanelChanges implements ng.IOnChangesObject, IGlobalHelpPanelBindings {
    [key: string]: ng.IChangesObject<any>;
}

class GlobalHelpPanelController implements ng.IController {
    public $onInit() { }
    public _panelState: string;
    public cleanupFn: Function;
    public cleanUpFunc: Function;
    private mediaSizeGtSm: boolean;
    public selectedItem: GlobalHelpConfigSection;
    public section: number;
    public sections: any[] = [
        { title: 'GLOBAL_HELP_VIDEOS', id: 0 },
        { title: 'GLOBAL_HELP_GUIDES', id: 1 }
    ];

    constructor(
        private $element: JQuery,
        private $location: ng.ILocationService,
        $rootScope: ng.IRootScopeService,
        private $timeout: ng.ITimeoutService,
        $state: ng.ui.IStateService,
        private pipActions: pip.nav.IActionsService,
        public pipMedia: pip.layouts.IMediaService,
        private pipAuxPanel: pip.layouts.IAuxPanelService
    ) {
        "ngInject";

        $element.addClass('iqs-global-help-panel');
        this.mediaSizeGtSm = this.pipMedia('gt-sm');

        // lisener open eventfor update panel
        this.cleanupFn = $rootScope.$on('iqsGlobalHelpOpen', () => {
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
        this.panelState = GlobalHelpPanelState.List;
        this.section = 0;
    }

    public onList(): void {
        this.panelState = GlobalHelpPanelState.List;
    }

    public onDetails(item: GlobalHelpConfigSection): void {
        this.selectedItem = item;
        this.panelState = GlobalHelpPanelState.Details;
    }

    public get panelState(): string {
        return this._panelState;
    }

    public set panelState(state: string) {
        this._panelState = state;
        // if (this._panelState == GlobalHelpPanelState.Details) {
        //     // show bage
        //     this.$timeout(() => {
        //         this.pipActions.updateCount('global.emergency', 100);
        //     }, 0);
        // } else {
        //     // hide bage 
        //     this.$timeout(() => {
        //         this.pipActions.updateCount('global.emergency', 0);
        //     }, 0);
        // }
    }

    public selectSection(id: number) {
        this.section = id;
    }
}

(() => {
    angular
        .module('iqsGlobalHelpPanel', ['iqsGlobalHelpDetailsPanel', 'iqsGlobalHelpListPanel', 'iqsGlobalHelpGuidesPanel'])
        .component('iqsGlobalHelpPanel', {
            bindings: GlobalHelpPanelBindings,
            // templateUrl: 'services/global_help/panels/GlobalHelpPanel.html',
            controller: GlobalHelpPanelController,
            controllerAs: '$ctrl',
            template: `
                <iqs-global-help-list-panel ng-if="$ctrl.section == 0 && $ctrl.panelState == 'list'" iqs-global-help-details="$ctrl.onDetails(item)">
                </iqs-global-help-list-panel>

                <iqs-global-help-details-panel ng-if="$ctrl.section == 0 && $ctrl.panelState == 'details'" iqs-global-help="$ctrl.selectedItem" iqs-global-help-list="$ctrl.onList()">
                </iqs-global-help-details-panel>
            `
        })
})();
