import { IOrganizationService } from '../../../services';
interface ISideNavHeaderBindings {
    [key: string]: any;
    state: any;
}

const SideNavHeaderBindings: ISideNavHeaderBindings = {
    state: '=iqsState'
}

class SideNavHeaderChanges implements ng.IOnChangesObject, ISideNavHeaderBindings {
    [key: string]: ng.IChangesObject<any>;

    state: ng.IChangesObject<string>;
}

class SideNavHeaderController implements ng.IController {     
    public state: string;
    constructor(
        private iqsOrganization: IOrganizationService,
        public pipMedia: pip.layouts.IMediaService,
        public pipIdentity: pip.services.IIdentityService,
    ) {
        "ngInject";

    }

    public $onInit() {}

    public get organization() {
        return this.iqsOrganization.organization || {};
    }

    public onSelect() {
        this.state = this.state == 'organizations' ? 'menu' : 'organizations';
    }
}

(() => {
    angular
        .module('iqsSideNav.Header', [
            'iqsOrganizations.ViewModel'
        ])
        .component('iqsSideNavHeader', {
            bindings: SideNavHeaderBindings,
            controller: SideNavHeaderController,
			controllerAs: '$ctrl',
            template:
            `<md-toolbar class="layout-row layout-align-start-center pip-focusable iqs-nav-admin iqs-header-desktop divider-bottom iqs-hide-sidenav-mobile">
                <md-button aria-label="Photos" class="layout-row flex-fixed iqs-avatar-button layout-align-start-center" ng-click="$ctrl.onSelect()">
                    <div class="layout-row flex-fixed iqs-avatar-button layout-align-start-center">
                        <md-tooltip md-visible="$ctrl.showTooltip" class="iqs-sidenav-icon-tooltip" ng-if="$ctrl.pipMedia('sm') || $ctrl.pipMedia('md')"
                         md-direction="right">
                            {{ $ctrl.organization.name | translate }}
                        </md-tooltip>
                        <div class="flex-fixed pip-sticky-nav-header-user">
                            <pip-avatar pip-id="$ctrl.organization.id" style="cursor: pointer;" pip-rebind="true" pip-name="$ctrl.organization.name" class="pip-face lm16 rm16"></pip-avatar>
                        </div>
                        <div class="pip-sticky-nav-header-user-text iqs-hide-small-text flex">
                            <div class="pip-sticky-nav-header-user-pri iqs-title text-overflow" tabindex="-1">
                                {{ $ctrl.organization.name | translate }}
                            </div>
                        </div>
                        <md-button class="md-icon-button" aria-label="current user" tabindex="-1">
            
                            <md-icon class="pip-sticky-nav-menu-icon" md-svg-icon="icons:triangle-down" ng-class="{'error-expand': $ctrl.state == 'organizations', 'error-not-expand': $ctrl.state =='menu' }">
                            </md-icon>
                        </md-button>
                    </div>
                </md-button>
            </md-toolbar>
            
            <md-toolbar class="layout-row layout-align-start-center iqs-hide-sidenav-desktop iqs-sidenav-mobile">
                <div class="flex-fixed pip-sticky-nav-header-user">
                    <pip-avatar pip-id="$ctrl.organization.id" style="cursor: pointer;" pip-rebind="true" ng-click="$ctrl.onSelect()" pip-name="$ctrl.organization.name"
                     class="pip-face-lg lm16 rm16"></pip-avatar>
                </div>
                <div class="pip-sticky-nav-header-user-text iqs-hide-small-text flex">
                    <div class="pip-sticky-nav-header-user-pri iqs-title-mobile text-overflow" ng-click="$ctrl.onSelect()" tabindex="-1">
                        {{ $ctrl.organization.name | translate }}
                    </div>
                    <div class="pip-sticky-nav-header-user-sec iqs-subtitle text-overflow">
                        {{ $ctrl.pipIdentity.identity.user_name | translate }}
                    </div>
                </div>
                <md-button class="md-icon-button" ng-click="$ctrl.onSelect()" aria-label="current user" tabindex="-1">
                    <md-icon class="pip-sticky-nav-menu-icon" md-svg-icon="icons:chevron-down" ng-class="{'error-expand': $ctrl.state == 'menu', 'error-not-expand': $ctrl.state =='organizations' }">
                    </md-icon>
                </md-button>
            </md-toolbar>`
        })

})();
