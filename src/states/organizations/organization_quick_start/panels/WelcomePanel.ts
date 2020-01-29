import { Organization } from '../../../../data';

interface IWelcomePanelBindings {
    [key: string]: any;

    onNext: any;
    onSkip: any;
    organization: any;
    ngDisabled: any;
}

const WelcomePanelBindings: IWelcomePanelBindings = {
    onNext: '&?iqsNext',
    onSkip: '&?iqsSkip',
    organization: '<?iqsOrganization',
    ngDisabled: '&?'
}

class WelcomePanelChanges implements ng.IOnChangesObject, IWelcomePanelBindings {
    [key: string]: ng.IChangesObject<any>;

    onNext: ng.IChangesObject<() => ng.IPromise<void>>;
    onSkip: ng.IChangesObject<() => ng.IPromise<void>>;
    organization: ng.IChangesObject<Organization>;
    ngDisabled: ng.IChangesObject<() => ng.IPromise<void>>;
}

class WelcomePanelController implements ng.IController {
    public $onInit() { }
    public ngDisabled: () => boolean;
    public onNext: () => void;
    public onSkip: () => void;
    public organization: Organization;

    constructor(
        private $element: JQuery,
        private $state: ng.ui.IStateService,
        private $timeout: ng.ITimeoutService,
        public pipMedia: pip.layouts.IMediaService,
    ) {
        "ngInject";

        $element.addClass('iqs-welcome-panel');
    }

    public onMonitoring() {
        if (this.onSkip) {
            this.onSkip();
        }
    }

    public next() {
        if (this.onNext) {
            this.onNext();
        }
    }
}

(() => {
    angular
        .module('iqsWelcomePanel', [])
        .component('iqsWelcomePanel', {
            bindings: WelcomePanelBindings,
            // templateUrl: 'states/organizations/organization_quick_start/panels/WelcomePanel.html',
            controller: WelcomePanelController,
            controllerAs: '$ctrl',
            template: `
                <div class="pip-body {{$ctrl.pipMedia('gt-sm') ? 'p24' : 'p16' }}">
                    <h2 class="text-center bm24 lm24 rm24">
                        {{ :: 'SITES_MOBILE_WELCOME_TITLE' | translate }}
                        "{{ ::$ctrl.organization.name }}"
                        {{ :: 'SITES_MOBILE_WELCOME_TITLE1' | translate }}
                    </h2>

                    <div class="min-h136 bm16">
                        <p class="text-body1 bm16 iqs-info">
                            {{ :: 'SITES_MOBILE_WELCOME_DESCRIPTION' | translate }}
                        </p>
                        <p class="text-body1 iqs-info">
                            {{ :: 'SITES_MOBILE_WELCOME_DESCRIPTION1' | translate }}
                        </p>
                    </div>


                </div>

                <div class="pip-footer {{$ctrl.pipMedia('gt-sm') ? 'p24' : 'p16' }} tp0">
                    <div ng-if="!$ctrl.pipMedia('gt-sm')">
                        <md-button iqs-test-cancel class="md-primary md-raised w-stretch flex lm0 rm0 tm16" ng-disabled="$ctrl.transaction.busy()"
                                   ng-click="$ctrl.onMonitoring()">
                            {{ :: 'SITES_MOBILE_WELCOME_SKIP_BUTTON' | translate }}
                        </md-button>
                        <md-button iqs-test-next class="md-primary md-raised w-stretch flex lm0 rm0 bm0" ng-disabled="$ctrl.transaction.busy()"
                                   ng-click="$ctrl.next()">
                            {{ :: 'SITES_MOBILE_WELCOME_PROCESS_BUTTON' | translate }}
                        </md-button>
                    </div>
                    <div class="layout-row layout-align-start-center tm16" ng-if="$ctrl.pipMedia('gt-sm')">
                        <md-button iqs-test-cancel class="md-primary md-raised w-stretch flex lm0 rm8 bm0" ng-disabled="$ctrl.transaction.busy()"
                                   ng-click="$ctrl.onMonitoring()">
                            {{ :: 'SITES_MOBILE_WELCOME_SKIP_BUTTON' | translate }}
                        </md-button>
                        <md-button iqs-test-next class="md-primary md-raised w-stretch flex lm8 rm0 bm0" ng-disabled="$ctrl.transaction.busy()"
                                   ng-click="$ctrl.next()">
                            {{ :: 'SITES_MOBILE_WELCOME_PROCESS_BUTTON' | translate }}
                        </md-button>
                    </div>
                </div>
            `
        })
})();
