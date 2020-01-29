import { Organization } from '../../../../data';

interface IMobileMorePanelBindings {
    [key: string]: any;

    organization: any;
    onNext: any;
    onAddPhone: any;
    ngDisabled: any;
}

const MobileMorePanelBindings: IMobileMorePanelBindings = {

    organization: '<?iqsOrganization',
    onNext: '&?iqsNext',
    onAddPhone: '&?iqsAddPhone',
    ngDisabled: '&?'
}

class MobileMorePanelChanges implements ng.IOnChangesObject, IMobileMorePanelBindings {
    [key: string]: ng.IChangesObject<any>;
    organization: ng.IChangesObject<Organization>;
    onNext: ng.IChangesObject<() => ng.IPromise<void>>;
    onAddPhone: ng.IChangesObject<() => ng.IPromise<void>>;
    ngDisabled: ng.IChangesObject<() => ng.IPromise<void>>;
}

class MobileMorePanelController implements ng.IController {
    public $onInit() { }
    public ngDisabled: () => boolean;
    public onNext: () => void;
    public onAddPhone: () => void;
    public organization: Organization;

    constructor(
        private $element: JQuery,
        private $state: ng.ui.IStateService,
        private $timeout: ng.ITimeoutService,
        public pipMedia: pip.layouts.IMediaService,
    ) {
        "ngInject";

        $element.addClass('iqs-mobile-more-panel');
    }

    public next() {
        if (this.onNext) {
            this.onNext();
        }
    }

    public onAdd() {
        if (this.onAddPhone) {
            this.onAddPhone();
        }
    }

}

(() => {
    angular
        .module('iqsMobileMorePanel', [])
        .component('iqsMobileMorePanel', {
            bindings: MobileMorePanelBindings,
            // templateUrl: 'states/organizations/organization_quick_start/panels/MobileMorePanel.html',
            controller: MobileMorePanelController,
            controllerAs: '$ctrl',
            template: `
                <div class="pip-body {{$ctrl.pipMedia('gt-sm') ? 'p24' : 'p16' }}">
                    <h2 class="text-center bm24 lm24 rm24">
                        {{:: 'SITES_CREATE_MOBILE_MORE_TITLE' | translate}}
                    </h2>

                    <p class="text-body1 min-h136 bm16 iqs-info">
                        {{:: 'SITES_CREATE_MOBILE_MORE_SUBTITLE1' | translate}}{{ $ctrl.organization.code }}{{::
                        'SITES_CREATE_MOBILE_MORE_SUBTITLE2' | translate}}
                    </p>
                </div>
                <div class="pip-footer {{$ctrl.pipMedia('gt-sm') ? 'p24' : 'p16' }} tp0">
                    <div ng-if="!$ctrl.pipMedia('gt-sm')">
                        <md-button iqs-test-cancel class="md-primary md-raised w-stretch flex lm0 rm0 tm16" ng-disabled="$ctrl.transaction.busy()"
                                   ng-click="$ctrl.next()">
                            {{ ::'SITES_CREATE_MOBILE_MORE_BUTTON_NEXT' | translate }}
                        </md-button>
                        <md-button iqs-test-next class="md-primary md-raised w-stretch flex lm0 rm0 bm0" ng-disabled="$ctrl.transaction.busy()"
                                   ng-click="$ctrl.onAdd()">
                            {{ ::'SITES_CREATE_MOBILE_MORE_BUTTON_ADD_MORE' | translate }}
                        </md-button>
                    </div>
                    <div class="layout-row layout-align-start-center tm16" ng-if="$ctrl.pipMedia('gt-sm')">
                        <md-button iqs-test-cancel class="md-primary md-raised w-stretch flex lm0 rm8 bm0" ng-disabled="$ctrl.transaction.busy()"
                                   ng-click="$ctrl.next()">
                            {{ ::'SITES_CREATE_MOBILE_MORE_BUTTON_NEXT' | translate }}
                        </md-button>
                        <md-button iqs-test-next class="md-primary md-raised w-stretch flex lm8 rm0 bm0" ng-disabled="$ctrl.transaction.busy()"
                                   ng-click="$ctrl.onAdd()">
                            {{ ::'SITES_CREATE_MOBILE_MORE_BUTTON_ADD_MORE' | translate }}
                        </md-button>
                    </div>
                        
                </div>
            `
        })
})();
