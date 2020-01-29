import { AccessRole, Organization } from '../../../data';
import { IOrganizationsViewModel } from '../../../models';
import { IAccessConfigService, ILoadingService, IOrganizationService } from '../../../services';

export const OrganizationWelcomeStateName: string = 'organizations.welcome';

class OrganizationWelcomeController implements ng.IController {
    public $onInit() { }

    private transaction: pip.services.Transaction;
    public organization: Organization;

    constructor(
        private $window: ng.IWindowService,
        private $state: ng.ui.IStateService,
        private $location: ng.ILocationService,
        private $rootScope: ng.IRootScopeService,
        private pipMedia: pip.layouts.IMediaService,
        private pipNavService: pip.nav.INavService,
        private pipIdentity: pip.services.IIdentityService,
        private pipTransaction: pip.services.ITransactionService,
        private iqsOrganization: IOrganizationService,
        private iqsOrganizationsViewModel: IOrganizationsViewModel,
        private pipAuthState: pip.rest.IAuthStateService,
        pipAuxPanel: pip.layouts.IAuxPanelService,
        private iqsAccessConfig: IAccessConfigService,
        private iqsLoading: ILoadingService,
    ) {
        "ngInject";
        this.transaction = pipTransaction.create('SITE_WELCOME');
        if (this.$state.params && this.$state.params.organization && this.$state.params.organization.id) {
            this.organization = this.$state.params.organization;
        } else {
            if (this.$location.search()['org_id']) {
                // read organizations
                this.iqsOrganizationsViewModel.initOrganizations(
                    (data: Organization[]) => {
                        let index: number = _.findIndex(data, { id: this.$state.params.org_id });
                        if (index == -1) {
                            // todo show toast and redirect to organization.home
                            this.$state.go('organizations.home');

                            return;
                        } else {
                            this.organization = _.cloneDeep(data[index]);
                        }
                    },
                    (error: any) => {
                        // todo show toast and redirect to organization.home
                        this.$state.go('organizations.home');

                        return;
                    }
                )
            } else {
                // todo show toast and redirect to organization.home
                this.$state.go('organizations.home');

                return;
            }
        }

        this.appHeader();
        pipAuxPanel.close();
    }

    private appHeader(): void {
        this.pipNavService.appbar.parts = { 'icon': true, 'menu': true, 'title': 'breadcrumb' };
        if (this.iqsOrganization.orgId) {
            this.pipNavService.actions.secondaryGlobalActions = [
                {
                    name: 'global.signal', title: 'ACTION_SEND_SIGNAL', event: 'iqsSendSignalEvent',
                    access: () => { return this.iqsAccessConfig.roleLevel >= AccessRole.manager }
                },
                { name: 'global.settings', title: 'User settings', /* state: 'settings.user' */ event: 'iqsUserSettings' },
                { name: 'global.guide', title: 'SHOW_GUIDE', event: 'iqsShowGuide' },
                { name: 'global.signout', title: 'Sign out', state: 'signout' }
            ];
        } else {
            this.pipNavService.actions.secondaryGlobalActions = [
                { name: 'global.signout', title: 'Sign out', state: 'signout' }
            ];
        }
        this.pipNavService.actions.hide();
        this.pipNavService.breadcrumb.text = 'SITES_SITE_WELCOME_TITLE';
        this.pipNavService.appbar.removeShadow();
        this.pipNavService.icon.showBack(() => {
            this.onBack();
        });
    }

    public onBack() {
        this.$state.go('organizations.home');
    }

    public onFinish(): void {
        // change organization
        this.iqsOrganization.organization = _.cloneDeep(this.organization);
        // clean data
        this.iqsLoading.restart(() => {
            this.$state.go(this.pipAuthState.authorizedState(), {});
        });
    }

}

function configureOrganizationsRoute(
    $injector: angular.auto.IInjectorService,
    $stateProvider: pip.rest.IAuthStateService
) {
    "ngInject";

    $stateProvider
        .state(OrganizationWelcomeStateName, {
            url: '/welcome?org_id',
            auth: true,
            reloadOnSearch: false,
            params: {
                organization: null
            },
            controller: OrganizationWelcomeController,
            controllerAs: '$ctrl',
            // templateUrl: 'states/organizations/organization_welcome/OrganizationWelcome.html'
            template: `
                <div class="iqs-organizations pip-card-container pip-outer-scroll pip-entry layout-column layout-align-center-center">

                    <div class="iqs-organizations pip-card-container layout-column layout-align-center-center">
                        <div class="scroll-y iqs-organization-details" syles="min-height: 600px; max-height: 90%">

                            <div class="pip-body {{$ctrl.pipMedia('gt-sm') ? 'p24' : 'p16' }}">


                                <h2 class="text-center bm24 lm24 rm24">
                                    {{:: 'SITES_WELCOME_END_TITLE' | translate}}

                                </h2>

                                <div class="text-body1 min-h136 bm16 iqs-info">
                                    <p>
                                        {{:: 'SITES_WELCOME_END_SUBTITLE1' | translate}}

                                    </p>
                                    <p>
                                        {{:: 'SITES_WELCOME_END_SUBTITLE2' | translate}}


                                    </p>
                                    <p>
                                        {{:: 'SITES_WELCOME_END_SUBTITLE3' | translate}}
                                    </p>
                                    <p>
                                        {{:: 'SITES_WELCOME_END_SUBTITLE4' | translate}}

                                    </p>
                                    <p>
                                        {{:: 'SITES_WELCOME_END_SUBTITLE5' | translate}}


                                    </p>
                                    <p>
                                        {{:: 'SITES_WELCOME_END_SUBTITLE6' | translate}}

                                    </p>
                                </div>


                            </div>
                            <div class="pip-footer {{$ctrl.pipMedia('gt-sm') ? 'p24' : 'p16' }} tp0">
                                <div class="layout-row layout-align-start-center tm16" ng-if="$ctrl.pipMedia('gt-sm')">
                                    <md-button iqs-test-cancel class="md-primary md-raised w-stretch flex" ng-disabled="$ctrl.transaction.busy()"
                                               ng-click="$ctrl.onFinish()">
                                        {{ ::'SITES_WELCOME_END_BUTTON' | translate }}
                                    </md-button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            `
        });
}

(() => {




    angular
        .module('iqsOrganizationWelcome', ['pipNav'])
        .config(configureOrganizationsRoute);

})();

import './OrganizationWelcomeResource';
