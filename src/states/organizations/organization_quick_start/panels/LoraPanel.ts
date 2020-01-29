interface ILoraPanelBindings {
    [key: string]: any;

    onNext: any;
    ngDisabled: any;
}

const LoraPanelBindings: ILoraPanelBindings = {
    onNext: '&?iqsNext',
    ngDisabled: '&?'
}

class LoraPanelChanges implements ng.IOnChangesObject, ILoraPanelBindings {
    [key: string]: ng.IChangesObject<any>;

    onNext: ng.IChangesObject<() => ng.IPromise<void>>;
    ngDisabled: ng.IChangesObject<() => ng.IPromise<void>>;
}

class LoraPanelController implements ng.IController {
    public $onInit() { }
    public ngDisabled: () => boolean;
    public onNext: () => void;

    constructor(
        private $element: JQuery,
        private $state: ng.ui.IStateService,
        private $timeout: ng.ITimeoutService,
        public pipMedia: pip.layouts.IMediaService,
    ) {
        "ngInject";

        $element.addClass('iqs-lora-panel');
    }

    public next() {
        if (this.onNext) {
            this.onNext();
        }
    }
}

(() => {
    angular
        .module('iqsLoraPanel', [])
        .component('iqsLoraPanel', {
            bindings: LoraPanelBindings,
            // templateUrl: 'states/organizations/organization_quick_start/panels/LoraPanel.html',
            controller: LoraPanelController,
            controllerAs: '$ctrl',
            template: `
                <div class="pip-body {{$ctrl.pipMedia('gt-sm') ? 'p24' : 'p16' }}">
                    <h2 class="text-center bm24 lm24 rm24">
                        {{:: 'SITES_CREATE_LORA_TITLE' | translate}}
                    </h2>

                    <div class="text-body1 min-h136 bm16 iqs-info">
                        <p>
                            {{:: 'SITES_CREATE_LORA_SUBTITLE1' | translate}}
                        </p>
                        <p>
                            <pip-translate-html key="SITES_CREATE_LORA_SUBTITLE2" />
                            </pip-translate-html>
                        </p>
                        <p>
                            {{:: 'SITES_CREATE_LORA_SUBTITLE3' | translate}}
                        </p>
                    </div>
                </div>

                <div class="pip-footer {{$ctrl.pipMedia('gt-sm') ? 'p24' : 'p16' }} tp0">
                    <div class="layout-row layout-align-start-center tm16" ng-if="$ctrl.pipMedia('gt-sm')">
                        <md-button iqs-test-cancel class="md-primary md-raised w-stretch flex lm0 rm8 bm0" ng-disabled="$ctrl.transaction.busy()"
                                   ng-click="$ctrl.next()">
                            {{ ::'SITES_CREATE_LORA_BUTTON' | translate }}
                        </md-button>
                    </div>
                </div>
            `
        })
})();
