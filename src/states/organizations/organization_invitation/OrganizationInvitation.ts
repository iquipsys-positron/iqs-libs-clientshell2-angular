import './panels/InvitationPanel';

import { IRolesDataService, AccessRole, Organization } from '../../../data';
import { IAccessConfigService, IAccessConfigProvider, IOrganizationService } from '../../../services';
import { IAccountsViewModel, IInvitationsViewModel, IOrganizationsViewModel } from '../../../models';

export const OrganizationInvitationStateName: string = 'organizations.invitation';


class OrganizationInvitationController implements ng.IController {
    public $onInit() { }

    private transaction: pip.services.Transaction;
    public organization: Organization;
    public step: number;
    public state: string;

    constructor(
        private $window: ng.IWindowService,
        private $location: ng.ILocationService,
        private $rootScope: ng.IRootScopeService,
        private $cookieStore: any,
        private $timeout: ng.ITimeoutService,
        private $state: ng.ui.IStateService,
        private $scope: ng.IScope,
        private $q: ng.IQService,
        private localStorageService: any,
        private pipRest: pip.rest.IRestService,
        public pipMedia: pip.layouts.IMediaService,
        pipAuxPanel: pip.layouts.IAuxPanelService,
        private pipNavService: pip.nav.INavService,
        private pipIdentity: pip.services.IIdentityService,
        private pipFormErrors: pip.errors.IFormErrorsService,
        private pipTranslate: pip.services.ITranslateService,
        private pipTransaction: pip.services.ITransactionService,
        private iqsOrganization: IOrganizationService,
        private iqsOrganizationsViewModel: IOrganizationsViewModel,
        private iqsRolesData: IRolesDataService,
        private iqsAccessConfig: IAccessConfigService,
        private iqsAccountsViewModel: IAccountsViewModel,
        private iqsInvitationsViewModel: IInvitationsViewModel,
    ) {
        "ngInject";
        this.transaction = pipTransaction.create('organization_invitation');

        this.step = -1;
        if (this.$state.params && this.$state.params.organization && this.$state.params.organization.id) {
            this.state = 'data';
            this.step = 0;
            this.organization = this.$state.params.organization;
        } else {
            if (this.$location.search()['org_id']) {
                this.state = 'progress';
                this.transaction.begin('saveOrganization');
                // read organizations
                this.iqsOrganizationsViewModel.initOrganizations(
                    (data: Organization[]) => {
                        let index: number = _.findIndex(data, { id: this.$state.params.org_id });
                        if (index == -1) {
                            // todo show toast and redirect to organization.home
                            this.$state.go('organizations.home');
                            this.transaction.end();
                            return;
                        } else {
                            this.organization = _.cloneDeep(data[index]);
                            this.state = 'data';
                            this.step = 0;
                            this.transaction.end();
                        }
                    },
                    (error: any) => {
                        // todo show toast and redirect to organization.home
                        this.$state.go('organizations.home');
                        this.transaction.end(error);
                        return;
                    }
                )
            } else {
                // todo show toast and redirect to organization.home
                this.$state.go('organizations.home');

                return;
            }
        }

        pipAuxPanel.close();
        this.appHeader();
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
        this.pipNavService.breadcrumb.text = 'SITES_INVITATION_TITLE';
        this.pipNavService.appbar.removeShadow();
        this.pipNavService.icon.showBack(() => {
            this.onBack();
        });
    }

    public onBack() {
        this.$state.go('organizations.home');
    }

    public onNext() {
        this.$state.go('organizations.welcome', { organization: this.organization, org_id: this.organization.id });
        // this.$state.go('organizations.quick_start', { organization: this.organization, org_id: this.organization.id });
    }

}

function configureOrganizationInvitationRoute(
    $injector: angular.auto.IInjectorService,
    $stateProvider: pip.rest.IAuthStateService
) {
    "ngInject";

    $stateProvider
        .state(OrganizationInvitationStateName, {
            url: '/invitation?org_id',
            auth: true,
            params: {
                organization: null
            },
            controller: OrganizationInvitationController,
            controllerAs: '$ctrl',
            // templateUrl: 'states/organizations/organization_invitation/OrganizationInvitation.html'
            template: `
                <div ng-show="$ctrl.error" class="pip-page-errors bm16">
                    <span class="pip-error-text color-error flex"> {{ $ctrl.error | translate }}</span>
                    <md-icon md-svg-icon="icons:warn-circle" class="color-error"></md-icon>
                </div>

                <div class="iqs-organizations pip-card-container layout-column layout-align-center-center" ng-if="$ctrl.state == 'data'">
                    <div class="scroll-y iqs-organization-details" syles="min-height: 500px; max-height: 90%">
                        <md-progress-linear md-mode="indeterminate" style="position: absolute;" ng-show="$ctrl.transaction && $ctrl.transaction.busy()">
                        </md-progress-linear>

                        <iqs-invitation-panel iqs-organization="$ctrl.organization" iqs-next="$ctrl.onNext()">
                        </iqs-invitation-panel>
                    </div>
                </div>

                <!-- load data  -->
                <div class="iqs-organizations pip-card-container layout-column layout-align-center-center" ng-if="$ctrl.state == 'progress'">
                    <div class="scroll-y iqs-organization-details" syles="min-height: 500px; max-height: 90%">
                        <div class="pip-body rp0 layout-column layout-align-center-center flex ">
                            <div class="layout-column layout-align-center-center flex iqs-empty ">
                                <div class="pip-empty" ng-if="$ctrl.state == 'progress'">
                                    <img src="images/empty/progress.svg" class="pip-pic">
                                    <div class="pip-text">
                                        {{ ::'QUICK_START_LOADING_TITLE' | translate }}
                                        <md-progress-linear md-mode="indeterminate" class="tm24"></md-progress-linear>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            `
        });
}

function configureOrganizationInvitationAccess(
    iqsAccessConfigProvider: IAccessConfigProvider
) {
    "ngInject";

    let accessLevel: number = AccessRole.empty;
    let accessConfig: any = {};
    iqsAccessConfigProvider.registerStateAccess(OrganizationInvitationStateName, accessLevel);
    iqsAccessConfigProvider.registerStateConfigure(OrganizationInvitationStateName, accessConfig);
}

(() => {

    angular
        .module('iqsOrganizationInvitation', ['iqsInvitationPanel'])
        .config(configureOrganizationInvitationRoute)
        .config(configureOrganizationInvitationAccess);

})();

import './OrganizationInvitationResource';
