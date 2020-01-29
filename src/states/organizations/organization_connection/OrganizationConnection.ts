import { IOrganizationsDataService, AccessRole, Invitation, InvitationAction, Organization } from '../../../data';
import { IInvitationsViewModel, IOrganizationsViewModel } from '../../../models';
import { IAccessConfigService, IAccessConfigProvider, IOrganizationService, ILoadingService, LoadingCompleteEvent } from '../../../services';

export const OrganizationsConnectionStateName: string = 'organizations.connection';

class OrganizationsConnectionController implements ng.IController {
    public $onInit() { }
    public end: boolean = false;
    public goMonitoring: boolean = false;
    public code: string;
    public error: string;
    public organizations: Organization[] = [];
    private transaction: pip.services.Transaction;
    private cf: Function[] = [];

    constructor(
        private $window: ng.IWindowService,
        $scope: ng.IScope,
        public $state: ng.ui.IStateService,
        private $rootScope: ng.IRootScopeService,
        private $timeout: ng.ITimeoutService,
        private pipMedia: pip.layouts.IMediaService,
        private iqsOrganization: IOrganizationService,
        pipAuxPanel: pip.layouts.IAuxPanelService,
        private pipNavService: pip.nav.INavService,
        private pipIdentity: pip.services.IIdentityService,
        private pipAuthState: pip.rest.IAuthStateService,
        private iqsInvitationsViewModel: IInvitationsViewModel,
        private pipTransaction: pip.services.ITransactionService,
        private iqsAccessConfig: IAccessConfigService,
        private iqsOrganizationsData: IOrganizationsDataService,
        private iqsOrganizationsViewModel: IOrganizationsViewModel,
        private iqsLoading: ILoadingService
    ) {
        "ngInject";

        this.transaction = pipTransaction.create('organizations');
        pipAuxPanel.close();
        this.appHeader();
        const runWhenReady = () => {
            this.organizations = this.iqsOrganizationsViewModel.getUserOrganizations();
            this.iqsOrganizationsViewModel.initOrganizations((data) => {
                // this.organizations = data;
                this.organizations = this.iqsOrganizationsViewModel.getUserOrganizations();
            });
        }
        if (this.iqsLoading.isDone) {runWhenReady(); }
        this.cf.push($rootScope.$on(LoadingCompleteEvent, () => { runWhenReady(); }));
        this.cf.push($rootScope.$on(pip.services.IdentityChangedEvent, () => { this.appHeader(); }));
    }

    public $onDestroy() {
        for (const f of this.cf) { f(); }
    }

    private appHeader(): void {
        if (this.iqsOrganization.orgId) {
            this.pipNavService.appbar.parts = { 'icon': true, 'actions': 'primary', 'menu': true, 'title': 'breadcrumb' };
        } else {
            this.pipNavService.appbar.parts = { 'icon': true, 'menu': true, 'title': 'breadcrumb' };
        }
        if (this.pipIdentity.identity) {
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
        } else {
            this.pipNavService.actions.secondaryGlobalActions = [];
        }
        this.pipNavService.actions.hide();
        this.pipNavService.appbar.removeShadow();
        this.pipNavService.icon.showBack(() => {
            this.$state.go('organizations.home');
        });
        this.pipNavService.breadcrumb.text = '';
    }

    // public onRetry() {
    //     this.$window.history.back();
    // }

    public sendCode() {
        this.error = null;
        let organization: Organization = _.find(this.organizations, { code: this.code });
        if (organization) {
            this.error = 'SITE_CONNECTION_FOUND_ERROR';

            return;
        }

        this.iqsOrganizationsData.findOrganizationByCode(
            this.code,
            (data: any) => {
                if (data) {
                    this.sendInvintation(data);
                } else {
                    this.error = 'SITE_NOT_FOUND_ERROR';
                }
            },
            (error: any) => {

            }
        );
    }

    private sendInvintation(organization) {
        let invite: Invitation = new Invitation();
        invite.action = InvitationAction.Approve; //responce
        invite.creator_id = this.pipIdentity.identity.user_id;
        invite.creator_name = this.pipIdentity.identity.user_name;
        invite.org_id = organization.id;
        invite.organization_name = organization.name;
        invite.invitee_email = this.pipIdentity.identity.user.login;
        invite.invitee_id = this.pipIdentity.identity.user.id;
        invite.invitee_name = this.pipIdentity.identity.user_name;
        this.iqsInvitationsViewModel.saveInvitation(
            invite,
            (item) => {
                this.$timeout(() => {
                    this.end = true;
                    if (this.pipIdentity.identity.user.organizations.length > 0) {
                        this.goMonitoring = true;
                    } else {
                        this.goMonitoring = false;
                    }
                }, 0)

            }, (error) => {
                if (error && error.code == 'NOT_IN_SITE_ROLE') {
                    this.error = 'SITE_CONNECT_NOT_IN_SITE_ROLE_ERROR'
                } else {
                    this.error = 'SITE_CONNECT_UNKNOWN_ERROR'
                }
            })
    }

    public back() {
        this.$state.go(this.pipAuthState.authorizedState());
    }

    public signout() {
        this.$state.go('signout');
    }
}

function configureOrganizationsConnectionRoute(
    $injector: angular.auto.IInjectorService,
    $stateProvider: pip.rest.IAuthStateService
) {
    "ngInject";

    $stateProvider
        .state(OrganizationsConnectionStateName, {
            url: '/connection',
            auth: true,
            controller: OrganizationsConnectionController,
            controllerAs: '$ctrl',
            // templateUrl: 'states/organizations/organizations_connection/OrganizationsConnection.html'
            template: `
                <div class="iqs-organizations pip-card-container pip-outer-scroll pip-entry">
                    <pip-card>
                        <div class="pip-body">
                            <h2 class=" bm24">
                                {{:: 'SITE_CONNECTION_TITLE' | translate}}
                            </h2>
                            <div class="" ng-if="!$ctrl.end">

                                <p class="color-secondary-text">
                                    {{:: 'SITE_CONNECTION_SUBTITLE' | translate}}
                                </p>
                                <md-input-container>
                                    <label>{{:: 'SITE_CONNECTION_CODE' | translate}}</label>
                                    <input ng-model="$ctrl.code" ng-change="$ctrl.error=null" />
                                    <div class="color-error hint" ng-if="$ctrl.error">
                                        {{ $ctrl.error | translate}}
                                    </div>
                                </md-input-container>

                                <md-button class="md-primary md-raised w-stretch flex lm0 rm0" ng-disabled="!$ctrl.code || $ctrl.error"
                                           ng-click="$ctrl.sendCode()">
                                    {{:: 'SITE_CONNECTION_SEND_CODE' | translate}}
                                </md-button>
                            </div>
                            <div class="" ng-if="$ctrl.end">

                                <p class="color-secondary-text">
                                    {{ ::'SITE_CONNECTION_SUBTITLE_END' | translate }} {{ $ctrl.code }} {{
                                    ::'SITE_CONNECTION_SUBTITLE_END1' | translate }}
                                </p>
                                <p class="color-secondary-text">
                                    {{ ::'SITE_CONNECTION_SUBTITLE_END2' | translate}}
                                </p>
                                    
                                <md-button class="md-primary md-raised w-stretch flex lm0 rm0 bm0" ng-if="$ctrl.goMonitoring" ng-click="$ctrl.back()">
                                    {{ ::'SITE_CONNECTION_BACK' | translate }}
                                </md-button>
                                    
                                <md-button class="md-primary md-raised w-stretch flex lm0 rm0 bm0" ng-if="!$ctrl.goMonitoring" ng-click="$ctrl.signout()">
                                    {{ ::'SITE_CONNECTION_BACK_SIGNIN' | translate }}
                                </md-button>
                            </div>
                                    
                                    
                        </div>
                                    
                    </pip-card>
                </div>
            `
        });
}

function configureOrganizationsConnectionAccess(
    iqsAccessConfigProvider: IAccessConfigProvider
) {
    "ngInject";

    let accessLevel: number = AccessRole.empty;
    let accessConfig: any = {
        addEventRule: AccessRole.empty,
    }
    iqsAccessConfigProvider.registerStateAccess(OrganizationsConnectionStateName, accessLevel);
    iqsAccessConfigProvider.registerStateConfigure(OrganizationsConnectionStateName, accessConfig);
}

(() => {

    const translateConfig = function (pipTranslateProvider) {
        // Set translation strings for the module
        pipTranslateProvider.translations('en', {
            SITE_CONNECTION_CODE: 'Organization code',
            SITE_CONNECTION_SEND_CODE: 'Send',
            SITE_CONNECTION_TITLE: 'Organization connection',
            SITE_CONNECTION_FOUND_ERROR: 'You are already connected to this organization',
            SITE_CONNECTION_BACK_SIGNIN: 'Signout',
            SITE_CONNECTION_SUBTITLE_END: 'Your request to connect to "',
            SITE_CONNECTION_SUBTITLE_END1: '" was sent to the organization administrator. When it is processed, you will receive an email confirmation.',
            SITE_CONNECTION_SUBTITLE_END2: 'See you soon!',
            SITE_CONNECTION_BACK: 'Work with last organization',
            SITE_CONNECTION_SUBTITLE: 'Enter the code of the organization to connect.',
        });

        pipTranslateProvider.translations('ru', {
            SITE_CONNECTION_CODE: 'Код площадки',
            SITE_CONNECTION_SEND_CODE: 'Послать запрос администратору',
            SITE_CONNECTION_TITLE: 'Подключение к рабочей площадке',
            SITE_CONNECTION_BACK: 'Работать с другими сайтами',
            SITE_CONNECTION_BACK_SIGNIN: 'Выйти',
            SITE_CONNECTION_FOUND_ERROR: 'Вы уже подключены к этой площадке',
            SITE_CONNECTION_SUBTITLE_END: 'Ваш запрос на подключение к “',
            SITE_CONNECTION_SUBTITLE_END1: '” был послан ее администратору. Когда он будет обработан, вы получите уведомление по электронной почте.',
            SITE_CONNECTION_SUBTITLE_END2: 'До скорой встречи!',
            SITE_CONNECTION_SUBTITLE: 'Введите код рабочей площадки к которой желаете подключиться'
        });
    }
    angular
        .module('iqsOrganizationsConnection', [])
        .config(configureOrganizationsConnectionRoute)
        .config(translateConfig)
        .config(configureOrganizationsConnectionAccess);
})();
