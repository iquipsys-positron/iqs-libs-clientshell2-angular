import { Organization } from '../../../../data';

interface IMobileStartPanelBindings {
    [key: string]: any;
    organization: any;
    onNext: any;
    onPhone: any;
    ngDisabled: any;
}

const MobileStartPanelBindings: IMobileStartPanelBindings = {
    organization: '<?iqsOrganization',
    onNext: '&?iqsNext',
    onPhone: '&?iqsPhone',
    ngDisabled: '&?'
}

class MobileStartPanelChanges implements ng.IOnChangesObject, IMobileStartPanelBindings {
    [key: string]: ng.IChangesObject<any>;
    organization: ng.IChangesObject<Organization>;
    onNext: ng.IChangesObject<() => ng.IPromise<void>>;
    onPhone: ng.IChangesObject<() => ng.IPromise<void>>;
    ngDisabled: ng.IChangesObject<() => ng.IPromise<void>>;
}

class MobileStartPanelController implements ng.IController {
    public $onInit() { }
    public ngDisabled: () => boolean;
    public onNext: () => void;
    public onPhone: () => void;
    public organization: Organization;

    constructor(
        private $element: JQuery,
        private $state: ng.ui.IStateService,
        private $timeout: ng.ITimeoutService,
        public pipMedia: pip.layouts.IMediaService,
    ) {
        "ngInject";

        $element.addClass('iqs-mobile-start-panel');
    }

    public onSkip() {
        if (this.onNext) {
            this.onNext();
        }
    }

    public onNextPhone() {
        if (this.onPhone) {
            this.onPhone();
        }
    }

}

(() => {
    angular
        .module('iqsMobileStartPanel', [])
        .component('iqsMobileStartPanel', {
            bindings: MobileStartPanelBindings,
            // templateUrl: 'states/organizations/organization_quick_start/panels/MobileStartPanel.html',
            controller: MobileStartPanelController,
            controllerAs: '$ctrl',
            template: `
                <div class="pip-body {{$ctrl.pipMedia('gt-sm') ? 'p24' : 'p16' }}">
                    <h2 class="text-center bm24 lm24 rm24">
                        {{:: 'SITES_CREATE_MOBILE_START_TITLE' | translate}}
                    </h2>

                    <div class="text-body1 min-h136 bm16 iqs-info">
                        <p>
                            {{:: 'SITES_CREATE_MOBILE_START_SUBTITLE1' | translate}}

                        </p>
                        <p>
                            {{:: 'SITES_CREATE_MOBILE_START_SUBTITLE2' | translate}}

                        </p>
                        <p>
                            {{:: 'SITES_CREATE_MOBILE_START_SUBTITLE3' | translate}}
                            {{ $ctrl.organization.code }}
                            {{:: 'SITES_CREATE_MOBILE_START_SUBTITLE4' | translate}}

                        </p>
                        <p>
                            {{:: 'SITES_CREATE_MOBILE_START_SUBTITLE5' | translate}}

                        </p>
                    </div>

                </div>
                <div class="pip-footer {{$ctrl.pipMedia('gt-sm') ? 'p24' : 'p16' }} tp0">
                    <div ng-if="!$ctrl.pipMedia('gt-sm')">
                        <md-button iqs-test-cancel class="md-primary md-raised w-stretch flex lm0 rm0 tm16" ng-disabled="$ctrl.transaction.busy()"
                                   ng-click="$ctrl.onSkip()">
                            {{ ::'SITES_CREATE_MOBILE_START_BUTTON_SKIP' | translate }}
                        </md-button>
                        <md-button iqs-test-next class="md-primary md-raised w-stretch flex lm0 rm0 bm0" ng-disabled="$ctrl.transaction.busy()"
                                   ng-click="$ctrl.onNextPhone()">
                            {{ ::'SITES_CREATE_MOBILE_START_BUTTON_PHONE' | translate }}
                        </md-button>
                    </div>
                    <div class="layout-row layout-align-start-center tm16" ng-if="$ctrl.pipMedia('gt-sm')">
                        <md-button iqs-test-cancel class="md-primary md-raised w-stretch flex lm0 rm8 bm0" ng-disabled="$ctrl.transaction.busy()"
                                   ng-click="$ctrl.onSkip()">
                            {{ ::'SITES_CREATE_MOBILE_START_BUTTON_SKIP' | translate }}
                        </md-button>
                        <md-button iqs-test-next class="md-primary md-raised w-stretch flex lm8 rm0 bm0" ng-disabled="$ctrl.transaction.busy()"
                                   ng-click="$ctrl.onNextPhone()">
                            {{ ::'SITES_CREATE_MOBILE_START_BUTTON_PHONE' | translate }}
                        </md-button>
                    </div>
                </div>
            `
        })
})();
