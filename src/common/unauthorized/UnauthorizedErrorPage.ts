import '../../services/access_config/AccessConfig';

import { AccessRole } from '../../data';
import { IAccessConfigService } from '../../services';

export const UnauthorizedStateName: string = 'unauthorized';

class UnauthorizedError {
    config?: UnauthorizedErrorConfig;
}

class UnauthorizedErrorConfig {
    params?: UnauthorizedErrorParams;
}

class UnauthorizedErrorParams {
    interval?: number = 0;
}

class UnauthorizedErrorPageController implements ng.IController {
    public $onInit() { }
    private _pageName: string = 'Unauthorized';
    public isCordova: boolean = false;
    public error: UnauthorizedError;
    public timeoutInterval: number;

    constructor(
        $scope: ng.IScope,
        private $window: ng.IWindowService,
        private $state: ng.ui.IStateService,
        $rootScope: ng.IRootScopeService,
        public pipMedia: pip.layouts.IMediaService,
        private pipNavService: pip.nav.INavService,
        private pipIdentity: pip.services.IIdentityService,
        private pipAuthState: pip.rest.IAuthStateService,
        private iqsAccessConfig: IAccessConfigService
    ) {
        "ngInject";

        $rootScope[pip.services.RoutingVar] = false;
        if (this.pipIdentity.identity) {
            this.appHeader();
            this.error = $state && $state.params && $state.params['error'] ? $state.params['error'] : {};
            this.timeoutInterval = this.error && this.error.config &&
                this.error.config.params && this.error.config.params.interval ? this.error.config.params.interval : 0;
        } else {
            this.$state.go(this.pipAuthState.signoutState())
        }
    }

    private appHeader(): void {
        if (this.pipIdentity.identity.user && this.pipIdentity.identity.user.organizations && this.pipIdentity.identity.user.organizations.length > 0) {
            this.pipNavService.actions.secondaryGlobalActions = [
                {
                    name: 'global.signal', title: 'ACTION_SEND_SIGNAL', event: 'iqsSendSignalEvent',
                    access: () => { return this.iqsAccessConfig.roleLevel >= AccessRole.manager }
                },
                { name: 'global.settings', title: 'User settings', /* state: 'settings.user'*/ event: 'iqsUserSettings' },
                { name: 'global.guide', title: 'SHOW_GUIDE', event: 'iqsShowGuide' },
                { name: 'global.signout', title: 'Sign out', state: 'signout' }
            ];
        } else {
            this.pipNavService.actions.secondaryGlobalActions = [
                { name: 'global.signout', title: 'Sign out', state: 'signout' }
            ];
        }

        this.pipNavService.appbar.addShadow();
        this.pipNavService.icon.showMenu();
        this.pipNavService.breadcrumb.text = 'ERROR_UNAUTHORIZED_PAGE_TITLE';
    }


    public onSignin() {
        this.$state.go('signout');
    }
}

function configureUnauthorizedErrorPageRoute(
    $stateProvider: pip.rest.IAuthStateService
) {
    "ngInject";

    $stateProvider
        .state(UnauthorizedStateName, {
            url: '/errors/unauthorized',
            params: {
                error: null
            },
            auth: true,
            controller: UnauthorizedErrorPageController,
            controllerAs: '$ctrl',
            template:
                `<div class="pip-error-scroll-body pip-scroll">
                <div class="pip-error pip-error-page layout-column flex layout-align-center-center">
                    <img src="images/404_page.svg" class="pip-pic block">
                    <div class="pip-error-text">{{::'ERROR_UNAUTHORIZED_TITLE' | translate}}</div>
                    <div class="pip-error-subtext">{{::'ERROR_UNAUTHORIZED_SUBTITLE' | translate}}</div>
                    <div class="pip-error-actions h48 layout-column layout-align-center-center" ng-if="$ctrl.isCordova">
                        <md-button class="md-accent" ng-click="$ctrl.onSignin($event)" aria-label="CLOSE">
                            {{::'ERROR_UNAUTHORIZED_SIGNOUT' | translate}}
                        </md-button>
                    </div>
                </div>
            </div>`
        });
}


angular
    .module('pipErrors.Unauthorized', ['iqsAccessConfig.Service'])
    .config(configureUnauthorizedErrorPageRoute);

import './UnauthorizedStrings';
