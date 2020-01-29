export const LandingStateName: string = 'landing';

class LandingController implements ng.IController {
    public $onInit() { }
    private cf: Function[] = [];
    public language: string;

    constructor(
        $scope: ng.IScope,
        private localStorageService: any,
        private $cookieStore: any,
        private $state: ng.ui.IStateService,
        private $rootScope: ng.IRootScopeService,
        private pipRest: pip.rest.IRestService,
        private pipTranslate: pip.services.ITranslateService,
        private pipNavService: pip.nav.INavService
    ) {
        "ngInject";

        this.appHeader();
        this.language = this.pipTranslate.language;

        this.cf.push($rootScope.$on(pip.services.LanguageChangedEvent, () => {
            this.language = this.pipTranslate.language;
        }));

    }

    public $onDestroy(): void {
        for (const f of this.cf) { f(); }
    }

    private appHeader(): void {
        this.pipNavService.appbar.parts = { 'icon': true, 'actions': 'primary', 'menu': true, 'title': 'breadcrumb', 'organizations': false };
        this.pipNavService.appbar.addShadow();
        this.pipNavService.breadcrumb.text = '';
        this.pipNavService.actions.hide();
        this.pipNavService.icon.showIcon('iqs:iquipsys');
        this.pipNavService.appbar.removeShadow();
    }

    private checkCookie(): boolean {
        let server: string = this.pipRest.serverUrl;
        if (!server) return false;

        let server1: pip.entry.IPastSessions = <pip.entry.IPastSessions>this.localStorageService.get(server);
        let server2: string = this.$cookieStore.get(server);

        return !!server1 || !!server2;
    }

    public onEntry() {
        if (this.checkCookie()) {
            this.$state.go('signin');
        } else {
            this.$state.go('signup');
        }
    }

    public signup() {
        this.$state.go('signup');
    }

    public signin() {
        this.$state.go('signin');
    }

    public create() {
        this.$state.go('organizations.home');
    }
}

function configureLandingRoute(
    $injector: angular.auto.IInjectorService,
    $stateProvider: pip.rest.IAuthStateService
) {
    "ngInject";

    $stateProvider
        .state(LandingStateName, {
            url: '/',
            auth: false,
            views: {
                '@': {
                    controller: LandingController,
                    controllerAs: '$ctrl',
                    template:
                    `<div class="iqs-landing layout-column flex">
                        <header class="iqs-header layout-row lp16 rp16 layout-align-end-center">
                            <pip-language-picker class="flex-fixed color-secondary-text" value="$ctrl.language"></pip-language-picker>
                        </header>
                        <div class="pip-card-container pip-outer-scroll pip-entry ">
                    
                            <img src="images/Entry_illustration_descktop_cloud-1.svg" class="iqs-cloud1">
                            <img src="images/Entry_illustration_descktop_cloud-2.svg" class="iqs-cloud3">
                            <img src="images/Entry_illustration_descktop_cloud-1.svg" class="iqs-cloud2">
                            <pip-card width="400">
                                <div class="pip-body lp0 rp0 text-center">
                                    <img src="images/iqs-logo-color.svg" height="70" width="70" class="" style="margin: 0 auto">
                                    <h1 class="lp16 rp16">{{::'LANDING_NAME' | translate}}</h1>
                                    <p class="text-subhead1">{{::'LANDING_TITLE' | translate}}</p>
                                    <div class="color-secondary-text">
                                        {{::'LANDING_SUBTITLE' | translate}}
                                    </div>
                                    <div class="layout-column tm24">
                                        <md-button class="md-raised md-accent flex" ng-click="$ctrl.signup()">
                                            {{:: 'LANDING_SIGNUP' | translate}}
                                        </md-button>
                                        <md-button class="md-raised md-primary flex" ng-click="$ctrl.signin()">
                                            {{::'LANDING_SIGNIN' | translate}}
                                        </md-button>
                                    </div>
                                </div>
                            </pip-card>
                        </div>
                    
                        <div class="iqs-background">
                        </div>
                    
                        <div class="iqs-fail-bg"></div>
                    
                        <footer class="iqs-landing-footer flex-fixed layout-row layout-align-center-center">
                            <a href="http://iquipsys.com/#/">{{::'CONNECTION' | translate}}</a>
                        </footer>
                    </div>`
                }
            }
        });
}

(() => {
    angular
        .module('iqsLanding', ['pipNav'])
        .config(configureLandingRoute);
})();

import './LandingStrings';
