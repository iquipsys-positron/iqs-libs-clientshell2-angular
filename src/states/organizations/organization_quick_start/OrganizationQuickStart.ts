import './panels/LoraPanel';
import './panels/MobileMorePanel';
import './panels/MobilePanel';
import './panels/MobileStartPanel';
import './panels/MobileWelcomePanel';
import './panels/WelcomePanel';
import { IRolesDataService, AccessRole, Organization } from '../../../data';
import { IAccessConfigService, IAccessConfigProvider, IMapService, ILoadingService, IOrganizationService } from '../../../services';
import { IValidatorsService } from '../../../validators';
import { IAccountsViewModel, IDevicesViewModel, IInvitationsViewModel, IOrganizationsViewModel } from '../../../models';

export const OrganizationQuickStartStateName: string = 'organizations.quick_start';


class OrganizationQuickStartController implements ng.IController {
    public $onInit() { }

    private transaction: pip.services.Transaction;
    public organization: Organization;
    public step: number;
    public state: string;
    public trackerType: string;

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
        private iqsMapConfig: IMapService,
        private iqsOrganizationsViewModel: IOrganizationsViewModel,
        private iqsRolesData: IRolesDataService,
        private iqsLoading: ILoadingService,
        private iqsAccessConfig: IAccessConfigService,
        private iqsDevicesViewModel: IDevicesViewModel,
        private iqsAccountsViewModel: IAccountsViewModel,
        private iqsInvitationsViewModel: IInvitationsViewModel,
        private iqsValidatorsService: IValidatorsService
    ) {
        "ngInject";
        
        this.transaction = pipTransaction.create('Quick_start');
        this.step = -1;
        if (this.$state.params && this.$state.params.organization && this.$state.params.organization.id) {
            this.state = 'data';
            this.step = 2;
            this.organization = this.$state.params.organization;
        } else {
            if (this.$location.search()['org_id']) {
                this.state = 'progress';
               
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
                            this.state = 'data';
                            this.step = 2;
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
        this.pipNavService.breadcrumb.text = 'SITES_QUICK_START_TITLE';
        this.pipNavService.appbar.removeShadow();
        this.pipNavService.icon.showBack(() => {
            this.onBack();
        });
    }

    public onBack() {
        this.$state.go('organizations.home');
    }

    public toInvitation() {
        this.step = 1;
    }
    
    public toMobileWelcome() {
        this.step = 2;
    }
    
    public toStartPhone() {
        this.step = 3;
    }
    
    public toLora() {
        this.step = 4;
        this.trackerType = 'lora';
    }
    
    public toPhone() {
        this.step = 4;
        this.trackerType = 'mobile';
    }
    
    public toOrganizationWelcome() {
        // this.$state.go('organizations.invitation', { organization: this.organization, org_id: this.organization.id });
        this.$state.go('organizations.welcome', { organization: this.organization, org_id: this.organization.id });
    }
    
    public toMobileMore() {
        this.step = 5;
    }
    
}

function configureOrganizationQuickStartRoute(
    $injector: angular.auto.IInjectorService,
    $stateProvider: pip.rest.IAuthStateService
) {
    "ngInject";

    $stateProvider
        .state(OrganizationQuickStartStateName, {
            url: '/quick_start?org_id',
            auth: true,
            params: {
                organization: null
            },
            controller: OrganizationQuickStartController,
            controllerAs: '$ctrl',
            // templateUrl: 'states/organizations/organization_quick_start/OrganizationQuickStart.html'
            template: `
                <div class="iqs-organizations pip-card-container pip-outer-scroll pip-entry layout-column layout-align-center-center">

                    <div class="iqs-organizations pip-card-container layout-column layout-align-center-center">
                        <div class="scroll-y iqs-organization-details" syles="min-height: 600px; max-height: 90%">
                            <iqs-mobile-welcome-panel iqs-organization="$ctrl.organization" iqs-lora="$ctrl.toLora()" iqs-phone="$ctrl.toStartPhone()"
                                                      ng-if="$ctrl.step == 2">
                            </iqs-mobile-welcome-panel>

                            <iqs-mobile-start-panel iqs-organization="$ctrl.organization" iqs-next="$ctrl.toOrganizationWelcome()" iqs-phone="$ctrl.toPhone()"
                                                    ng-if="$ctrl.step == 3">
                            </iqs-mobile-start-panel>

                            <iqs-mobile-panel iqs-organization="$ctrl.organization" iqs-next="$ctrl.toOrganizationWelcome()" iqs-add-phone="$ctrl.toMobileMore()"
                                              ng-if="$ctrl.step == 4 && $ctrl.trackerType == 'mobile'">
                            </iqs-mobile-panel>

                            <iqs-mobile-more-panel iqs-organization="$ctrl.organization" iqs-next="$ctrl.toOrganizationWelcome()" iqs-add-phone="$ctrl.toPhone()"
                                                   ng-if="$ctrl.step == 5">
                            </iqs-mobile-more-panel>

                            <iqs-lora-panel iqs-next="$ctrl.toOrganizationWelcome()" ng-if="$ctrl.step == 4 && $ctrl.trackerType == 'lora'">
                            </iqs-lora-panel>
                        </div>
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

function configureOrganizationQuickStartAccess(
    iqsAccessConfigProvider: IAccessConfigProvider
) {
    "ngInject";

    let accessLevel: number = AccessRole.empty;
    let accessConfig: any = {};
    iqsAccessConfigProvider.registerStateAccess(OrganizationQuickStartStateName, accessLevel);
    iqsAccessConfigProvider.registerStateConfigure(OrganizationQuickStartStateName, accessConfig);
}

(() => {

    angular
        .module('iqsOrganizationQuickStart', ['iqsMobileWelcomePanel', 'iqsMobilePanel', 'iqsLoraPanel', 
            // 'iqsInvitationPanel', 
            'iqsWelcomePanel', 'iqsMobileMorePanel', 'iqsMobileStartPanel', 'iqsValidatorsService'])
        .config(configureOrganizationQuickStartRoute)
        .config(configureOrganizationQuickStartAccess);

})();

import './OrganizationQuickStartResource';
