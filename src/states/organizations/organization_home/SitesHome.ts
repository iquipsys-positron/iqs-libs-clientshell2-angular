import { AccessRole } from '../../../data';
import { IOrganizationsViewModel } from '../../../models';
import { IAccessConfigService, IAccessConfigProvider, IOrganizationService, ILoadingService, LoadingCompleteEvent, LoadingStatus } from '../../../services';

export const OrganizationsStateName: string = 'organizations';
export const OrganizationsHomeStateName: string = 'organizations.home';

class OrganizationsController implements ng.IController {
    public $onInit() { }
    private cleanUpFunc: Function;
    public isSessionOpen: boolean;
    private transaction: pip.services.Transaction;
    public accessConfig: any;
    public isConnectToDemo: boolean;
    private cf: Function[] = [];

    constructor(
        private $window: ng.IWindowService,
        $scope: ng.IScope,
        private $state: ng.ui.IStateService,
        private $rootScope: ng.IRootScopeService,
        private pipMedia: pip.layouts.IMediaService,
        private pipNavService: pip.nav.INavService,
        private pipAuthState: pip.rest.IAuthStateService,
        private pipIdentity: pip.services.IIdentityService,
        pipAuxPanel: pip.layouts.IAuxPanelService,
        private pipSession: pip.services.ISessionService,
        private iqsOrganization: IOrganizationService,
        private iqsOrganizationsViewModel: IOrganizationsViewModel,
        private pipTransaction: pip.services.ITransactionService,
        private pipRest: pip.rest.IRestService,
        private iqsAccessConfig: IAccessConfigService,
        private iqsLoading: ILoadingService
    ) {
        "ngInject";

        const runWhenReady = () => {
            this.accessConfig = iqsAccessConfig.getStateConfigure().access;
            this.isConnectToDemo = this.iqsOrganization.isConnectToDemo(this.pipIdentity.identity && this.pipIdentity.identity.organizations);
            this.isSessionOpen = this.pipSession.isOpened();
            this.appHeader();
        };
        if (this.iqsLoading.isDone) { runWhenReady(); }
        else if (!this.iqsLoading.isLoading) { this.iqsLoading.restart(); }
        this.cf.push($rootScope.$on(LoadingCompleteEvent, () => { runWhenReady(); }));
        this.cf.push($rootScope.$on(pip.services.IdentityChangedEvent, runWhenReady.bind(this)));
        this.transaction = pipTransaction.create('organizations');

        this.appHeader();
        this.cf.push($rootScope.$on(pip.layouts.MainResizedEvent, this.appHeader.bind(this)));
        pipAuxPanel.close();
        $scope.$on('$destroy', () => {
            if (angular.isFunction(this.cleanUpFunc)) {
                this.cleanUpFunc();
            }
        });
    }

    public $onDestroy(): void {
        for (const f of this.cf) { f(); }
    }

    private appHeader(): void {
        this.pipNavService.breadcrumb.text = '';
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

        if (!this.pipIdentity
            || !this.pipIdentity.identity
            || !this.pipIdentity.identity.user
            || !this.pipIdentity.identity.user.organizations
            || this.pipIdentity.identity.user.organizations.length == 0) {
            this.pipNavService.icon.hide();
        } else {
            this.pipNavService.icon.showBack(() => {
                this.onRetry();
            });
        }

    }

    public onRetry(): void {
        // this.$window.history.back();
        if (this.$state.params && this.$state.params.toState) {
            this.$state.go(this.$state.params.toState, this.$state.params.toParams);
        } else {
            this.$state.go(this.pipAuthState.authorizedState());
        }
    }

    public addOrganization(): void {
        if (this.transaction.busy()) return;

        this.$state.go('organizations.connection');
    }

    public createOrganization(): void {
        if (this.transaction.busy()) return;

        this.$state.go('organizations.create', this.$state.params);
    }

    public connectDemoOrganization(): void {
        if (this.isConnectToDemo) return;

        if (!this.pipSession.isOpened() || this.transaction.busy()) return;

        this.transaction.begin('connect_demo');
        this.iqsOrganizationsViewModel.demoConnect(
            {
                user_id: this.pipIdentity.identity.user_id,
                language: this.pipIdentity.identity.user.language,
            },
            (data: any) => {
                this.transaction.end();
                if (!data) return;
                if (window.location.href.includes('home')) {
                    this.iqsLoading.restart(() => {
                        this.$state.go(this.pipAuthState.authorizedState());
                    });
                } else {
                    window.location.href = window.location.origin + '/home/index.html#';
                }
            },
            (error: any) => {
                this.transaction.end(error);
                this.$rootScope.$broadcast('hideLoading');
                // end transaction
            });

        // this.iqsOrganizationsViewModel.demoConnect(
        //     {
        //         user_id: this.pipIdentity.identity.user_id,
        //         language: this.pipIdentity.identity.user.language,
        //     },
        //     (data: any) => {
        //         if (!data) {
        //             this.transaction.end();
        //             this.$rootScope.$broadcast('hideLoading');

        //             return;
        //         }

        //         let orgId = '';
        //         _.each(data, (s) => {
        //             if (typeof (s) == 'string') orgId += s;
        //         });

        //         this.pipRest.getResource('restoreSessions').call(
        //             {
        //                 session_id: this.pipIdentity.identity.id
        //             },
        //             (data: pip.entry.SessionData) => {
        //                 this.pipIdentity.identity = data;
        //                 this.iqsLoading.reset();
        //                 this.iqsLoading.start(() => {
        //                     this.transaction.end();
        //                     this.$state.go('app');
        //                 });

        //                 // this.iqsOrganizationsViewModel.initOrganizations(
        //                 //     (organizationCollection) => {

        //                 //         let organization = this.iqsOrganizationsViewModel.getOrganizationById(orgId);
        //                 //         if (!organization || !organization.id) {
        //                 //             this.transaction.end();
        //                 //             this.$rootScope.$broadcast('hideLoading');

        //                 //             return;
        //                 //         }
        //                 //         this.$rootScope.$broadcast('hideLoading');
        //                 //         this.iqsOrganization.organization = organization
        //                 //         this.transaction.end();
        //                 //         this.$state.go('loading');
        //                 //     },
        //                 //     (error: any) => {
        //                 //         this.transaction.end(error);
        //                 //         this.$rootScope.$broadcast('hideLoading');
        //                 //     });
        //             },
        //             (error: any) => {
        //                 this.transaction.end(error);
        //                 this.$rootScope.$broadcast('hideLoading');
        //             });
        //     },
        //     (error: any) => {
        //         this.transaction.end(error);
        //         this.$rootScope.$broadcast('hideLoading');
        //         // end transaction
        //     });
    }
}

function configureOrganizationsRoute(
    $injector: angular.auto.IInjectorService,
    $stateProvider: pip.rest.IAuthStateService
) {
    "ngInject";

    $stateProvider
        .state(OrganizationsStateName, {
            url: '/organizations',
            abstract: true,
            auth: true,
            views: {
                '@': {
                    controller: OrganizationsController,
                    controllerAs: '$ctrl',
                    template: '<div class="" ui-view></div>'
                }
            }
        });
    $stateProvider
        .state(OrganizationsHomeStateName, {
            url: '',
            auth: true,
            params: {
                toState: null,
                toParams: null
            },
            views: {
                '@': {
                    controller: OrganizationsController,
                    controllerAs: '$ctrl',
                    // templateUrl: 'states/organizations/organizations_home/OrganizationsHome.html'
                    template: `
                        <div class="iqs-organizations pip-card-container pip-outer-scroll pip-entry">
                            <pip-card>
                                <md-progress-linear md-mode="indeterminate" class="dialog-progress-linear" ng-show="$ctrl.transaction.busy()">
                                </md-progress-linear>

                                <div class="pip-body iqs-list-container">
                                    <h2 class="lp16 rp16 bm24">{{:: 'SITE_WORK_START_TITLE' | translate}}</h2>
                                    <p class="color-secondary-text lp16 rp16">{{:: 'SITE_WORK_START_SUBTITLE' | translate}}</p>
                                    <md-list>
                                        <md-list-item class="layout-row layout-align-start-center" md-ink-ripple ng-if="$ctrl.isSessionOpen && $ctrl.accessConfig.connectDemoOrganization && !$ctrl.isConnectToDemo"
                                                      ng-click="$ctrl.connectDemoOrganization()">

                                            <div class="pip-face flex-fixed iqs-device-avatar rm16  tm8 bm8  layout-row layout-align-center-center color-primary-bg p8">
                                                <md-icon class="" md-svg-icon="iqs:star-white"></md-icon>
                                            </div>
                                            <div iqs-test-connect-to-demo class="flex">
                                                {{:: 'SITE_CONNECT_DEMO' | translate}}
                                            </div>
                                            <div class="flex-fixed">
                                                <md-icon class="" md-svg-icon="icons:chevron-big-right"></md-icon>
                                            </div>
                                        </md-list-item>

                                        <md-list-item class="layout-row layout-align-start-center " md-ink-ripple ng-click="$ctrl.createOrganization()" ng-if="$ctrl.accessConfig.createOrganization">

                                            <div class="pip-face flex-fixed iqs-device-avatar rm16  tm8 bm8  layout-row layout-align-center-center color-primary-bg p8">
                                                <md-icon class="" md-svg-icon="webui-icons:star-1"></md-icon>
                                            </div>
                                            <div iqs-test-create-new class="flex">
                                                {{:: 'SITE_WORK_START_ADD_NEW' | translate}}
                                            </div>
                                            <div class="flex-fixed">
                                                <md-icon class="" md-svg-icon="icons:chevron-big-right"></md-icon>
                                            </div>
                                        </md-list-item>

                                        <md-list-item class="layout-row layout-align-start-center " md-ink-ripple ng-click="$ctrl.addOrganization()" ng-if="$ctrl.accessConfig.addOrganization">

                                            <div class="pip-face flex-fixed iqs-device-avatar rm16 tm8 bm8 layout-row layout-align-center-center color-primary-bg p8">
                                                <md-icon class="" md-svg-icon="webui-icons:plus"></md-icon>
                                            </div>
                                            <div iqs-test-connect-to-existing class="flex">
                                                {{:: 'SITE_WORK_START_CONNECT' | translate}}
                                            </div>
                                            <div class="flex-fixed">
                                                <md-icon class="" md-svg-icon="icons:chevron-big-right"></md-icon>
                                            </div>
                                        </md-list-item>
                                    </md-list>
                                </div>
                            </pip-card>
                        </div>
                    `
                }
            }
        });
}

function configureStatisticsUserAccess(
    iqsAccessConfigProvider: IAccessConfigProvider
) {
    "ngInject";

    let accessLevel: number = AccessRole.empty;
    let accessConfig: any = {
        addOrganization: AccessRole.empty,
        createOrganization: AccessRole.empty,
        connectDemoOrganization: AccessRole.empty
    }
    let accessLevel1: number = AccessRole.empty;
    let accessConfig1: any = {
        addOrganization: AccessRole.empty,
        createOrganization: AccessRole.empty,
        connectDemoOrganization: AccessRole.empty
    }

    iqsAccessConfigProvider.registerStateAccess(OrganizationsStateName, accessLevel);
    iqsAccessConfigProvider.registerStateConfigure(OrganizationsStateName, accessConfig);

    iqsAccessConfigProvider.registerStateAccess(OrganizationsHomeStateName, accessLevel1);
    iqsAccessConfigProvider.registerStateConfigure(OrganizationsHomeStateName, accessConfig1);
}

(() => {




    angular
        .module('iqsOrganizationsHome', ['pipNav', 'iqsInvitations.ViewModel'])
        .config(configureOrganizationsRoute)
        .config(configureStatisticsUserAccess);

})();

import './OrganizationsHomeResource';
