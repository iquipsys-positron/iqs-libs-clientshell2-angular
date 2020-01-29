import { ApplicationTile } from '../../../data';
import { IApplicationsViewModel } from '../../../models';

interface ISideNavMenuBindings {
    [key: string]: any;
}

const SideNavMenuBindings: ISideNavMenuBindings = {}

class SideNavMenuChanges implements ng.IOnChangesObject, ISideNavMenuBindings {
    [key: string]: ng.IChangesObject<any>;
}

class SideNavMenuController implements ng.IController {
    public $onInit() { }

    public language: string;
    public favourites: ApplicationTile[];

    constructor(
        private pipAuthState: pip.rest.IAuthStateService,
        private pipTranslate: pip.services.ITranslateService,
        private pipSideNav: pip.nav.ISideNavService,
        private iqsApplicationsViewModel: IApplicationsViewModel,
        public $state: ng.ui.IStateService
    ) {
        "ngInject";

        this.language = this.pipTranslate.language;
        this.favourites = this.iqsApplicationsViewModel.favouritesOrDefault;
    }

    public onClick(app: ApplicationTile) {
        this.pipSideNav.close();
        if (window.location.href.includes(app.url)) {
            this.$state.go(this.pipAuthState.authorizedState());
        } else {
            window.location.href = window.location.origin + app.url;
        }
    }
}

angular
    .module('iqsSideNav.Menu', [
        'iqsApplications.Data',
        'iqsSettings.ViewModel'
    ])
    .component('iqsSideNavMenu', {
        bindings: SideNavMenuBindings,
        controller: SideNavMenuController,
        controllerAs: '$ctrl',
        template:
            `<div>
            <md-list class="sidenav-list p0" pip-focused pip-focused-tabindex="10" pip-with-hidden="true">
                <md-list-item class="no-border pip-sticky-nav-menu-item p0 pip-focusable" tabindex="-1">
                    <md-button href="/home/index.html" class="layout-row layout-align-start-center pip-button-block iqs-nav-organizations-button"
                        tabindex="-1">
                        <md-icon class="pip-sticky-nav-menu-icon" md-svg-icon="webui-icons:home"></md-icon>
                        <div class="pip-sticky-nav-menu-title pip-sticky-nav-menu-title-moz iqs-hide-small-text flex  lm16 ">
                            {{ 'TILE_HOME' | translate }}
                        </div>
                    </md-button>
                </md-list-item>
                <md-divider></md-divider>
                <md-list-item ng-repeat="app in $ctrl.favourites track by $index" class="no-border pip-sticky-nav-menu-item p0 pip-focusable" tabindex="-1">
                    <md-button ng-click="$ctrl.onClick(app)" class="layout-row layout-align-start-center pip-button-block iqs-nav-organizations-button"
                        tabindex="-1">
                        <md-icon class="pip-sticky-nav-menu-icon" md-svg-icon="{{ app.icon }}"></md-icon>
                        <div class="pip-sticky-nav-menu-title pip-sticky-nav-menu-title-moz iqs-hide-small-text flex  lm16 ">
                            {{ app.name[$ctrl.language] }}
                        </div>
                    </md-button>
                </md-list-item>
                <md-divider></md-divider>
                <md-list-item class="no-border pip-sticky-nav-menu-item p0 pip-focusable" tabindex="-1">
                        <md-button ng-click="$ctrl.$state.go('signout')" class="layout-row layout-align-start-center pip-button-block iqs-nav-organizations-button"
                            tabindex="-1">
                            <md-icon class="pip-sticky-nav-menu-icon" md-svg-icon="webui-icons:exit"></md-icon>
                            <div class="pip-sticky-nav-menu-title pip-sticky-nav-menu-title-moz iqs-hide-small-text flex  lm16 ">
                                {{ 'TILE_EXIT' | translate }}
                            </div>
                        </md-button>
                    </md-list-item>
            </md-list>
        </div>`
    })

import './MenuStrings';