import { IOrganizationsViewModel } from '../../../models';
import { IOrganizationService } from '../../../services';
import { Organization } from '../../../data/organizations/Organization';

interface ISideNavOrganizationsBindings {
    [key: string]: any;

    state: any;
    add: any;
}

const SideNavOrganizationsBindings: ISideNavOrganizationsBindings = {
    state: '=iqsState',
    add: '<?iqsAdd'
}

class SideNavOrganizationsChanges implements ng.IOnChangesObject, ISideNavOrganizationsBindings {
    [key: string]: ng.IChangesObject<any>;

    state: ng.IChangesObject<string>;
    add: ng.IChangesObject<string>;
}

class SideNavOrganizationsController {
    private pipSideNavElement;
    private cleanupSideNavStateChanged: Function;
    public isCollapsed;
    public expanded: boolean;
    public expandedButton: boolean;
    public state: string;
    private add: string = 'organizations.home';

    private filteredOrganizations: Organization[];

    constructor(
        private $state: ng.ui.IStateService,
        private $rootScope: ng.IRepeatScope,
        private $element,
        private $timeout: ng.ITimeoutService,
        private pipIdentity: pip.services.IIdentityService,
        private pipNavService: pip.nav.INavService,
        private pipTranslate: pip.services.ITranslateService,
        private iqsOrganization: IOrganizationService,
        private pipSideNav: pip.nav.ISideNavService,
        public pipMedia: pip.layouts.IMediaService,
        private iqsOrganizationsViewModel: IOrganizationsViewModel,
        private pipRest: pip.rest.IRestService,
        private pipConfirmationDialog: pip.dialogs.IConfirmationDialogService,
        private pipInformationDialog: pip.dialogs.IInformationDialogService
    ) {
        "ngInject";

        this.pipSideNavElement = $element.parents('pip-sidenav');

        this.onStateChanged(null, this.pipSideNav.state);
        this.cleanupSideNavStateChanged = this.$rootScope.$on('pipSideNavStateChanged', ($event: ng.IAngularEvent, state) => { //navState
            this.onStateChanged($event, state)
        });

        this.fillOrganizations();
    }

    private fillOrganizations() {
        let s: Organization[] = [];

        _.each(_.get(this.pipIdentity, 'identity.user.organizations'), (item: Organization) => {
            let index: number = _.findIndex(this.iqsOrganizationsViewModel.organizations, (organization: Organization) => {
                return item.id == organization.id && item.id != this.iqsOrganization.orgId
            });
            if (index > -1) {
                s.push(this.iqsOrganizationsViewModel.organizations[index]);
            }
        });
        this.filteredOrganizations = s;
    }

    public $onDestroy() {
        if (angular.isFunction(this.cleanupSideNavStateChanged)) {
            this.cleanupSideNavStateChanged();
        }
    }

    public get organizations() {
        // return _.filter(this.pipIdentity.identity.user.organizations, (item: Organization) => {
        //     return item.id != this.iqsOrganization.orgId
        // });
        _.debounce(
            () => {
                this.fillOrganizations();
            }, 1000, {
                'leading': true,
                'trailing': false
            });

        return this.filteredOrganizations;
    }

    public get canAddOrganization(): boolean {
        return this.iqsOrganization.canAddOrganization;
    }

    public get canRemoveOrganization(): boolean {
        return this.iqsOrganization.canRemoveOrganization;
    }

    public onExpand(): void {
        if (!this.isCollapsed) { return }

        this.expanded = !this.expanded;

        if (this.expanded) {
            this.pipSideNavElement.removeClass('pip-sticky-nav-small');
        } else {
            this.pipSideNavElement.addClass('pip-sticky-nav-small');
        }
        this.pipSideNav.state.isExpanded = this.expanded;
        this.$rootScope.$emit('pipNavExpanded', this.expanded);
    }

    private onStateChanged(event: ng.IAngularEvent, state): void {
        // SS> You shall not set it into the menu state. Instead it shall be controlled by the state of Sidenav
        if (!state) return;

        this.isCollapsed = state.expand;
        this.expanded = state.isExpanded;
        this.expandedButton = state.expandedButton;
    }

    public onClick(id: string) {
        this.iqsOrganization.organization = this.iqsOrganizationsViewModel.getOrganizationById(id);
        this.state = 'menu';
        this.pipSideNav.close();
        this.fillOrganizations();
    }

    public closeClick() {
        this.state = 'menu';
    }

    private checkDemo(params: string): boolean {
        if (!this.iqsOrganization.isDemo) return true;

        let message = params == 'add_organization' ? 'DEMO_LIMIT_ADD_SITE_INFORMATION_DIALOG_MESSAGE' : 'DEMO_LIMIT_REMOVE_SITE_INFORMATION_DIALOG_MESSAGE';
        this.pipInformationDialog.show(
            {
                event: null,
                title: this.pipTranslate.translate('DEMO_LIMIT_INFORMATION_DIALOG_TITLE'),
                message: this.pipTranslate.translate(message)
            },
            () => {

            });

        return false;
    }

    public addClick() {
        if (!this.checkDemo('add_organization')) return;
        this.$state.go(this.add, { toState: this.$state.current.name, toParams: this.$state.params });
    }

    public deleteClick() {
        if (!this.checkDemo('remove_organization')) return;
        let configParams: pip.dialogs.ConfirmationDialogParams = {}, roles: string[], localRoles;
        configParams.title = this.pipTranslate.translate('SITES_DISCONNECT_CONFIRMATION_TITLE') + ' "' + this.iqsOrganization.organization.name + '"?'; // + this.collection[this.selectedIndex()].name + '?';
        configParams.ok = 'SITES_DISCONNECT_BUTTON';
        configParams.cancel = 'CANCEL';

        this.pipConfirmationDialog.show(configParams, () => {
            this.$rootScope.$broadcast('showLoading');
            this.iqsOrganizationsViewModel.removeOrganization(this.iqsOrganization.orgId, (data) => {
                this.pipRest.getResource('restoreSessions').call(
                    {
                        session_id: this.pipIdentity.identity.id
                    },
                    (data: pip.entry.SessionData) => {
                        this.pipIdentity.identity = data;
                        this.fillOrganizations();
                        this.$state.go('loading');
                        this.$rootScope.$broadcast('hideLoading');
                    },
                    (error: any) => {
                        this.$rootScope.$broadcast('hideLoading');
                    });
            },
                (error: any) => {
                    this.$rootScope.$broadcast('hideLoading');
                });
        });
    }

}

angular
    .module('iqsSideNav.Organizations', [
        'iqsOrganizations.ViewModel',
        'iqsRoles.Data',
    ])
    .component('iqsSideNavOrganizations', {
        bindings: SideNavOrganizationsBindings,
        controller: SideNavOrganizationsController,
        controllerAs: '$ctrl',
        template:
        `<div>
            <md-list class="sidenav-list p0" pip-focused pip-focused-tabindex="10" pip-with-hidden="true">
                <div class="pip-section" ng-repeat="link in $ctrl.organizations track by $index" ng-if="$ctrl.organizations && $ctrl.organizations.length">
                    <md-list-item class="no-border pip-sticky-nav-menu-item p0 pip-focusable" tabindex="-1" ng-class="{'active': $ctrl.isActive(link)}">
                        <md-button ng-click="$ctrl.onClick(link.id)" class="layout-row layout-align-start-center pip-button-block iqs-nav-organizations-button"
                            tabindex="-1">
                            <pip-avatar pip-id="link.id" pip-rebind="true" pip-name="link.name" class="pip-face "></pip-avatar>
                            <md-tooltip class="iqs-sidenav-icon-tooltip" ng-if="$ctrl.pipMedia('sm') || $ctrl.pipMedia('md')" md-direction="right">
                                {{ ::link.name | translate }}
                            </md-tooltip>
                            <div class="pip-sticky-nav-menu-icon-block">
                            </div>
                            <div class="pip-sticky-nav-menu-title pip-sticky-nav-menu-title-moz iqs-hide-small-text flex  lm16 ">
                                {{ ::link.name | translate }}
                            </div>
                        </md-button>
                    </md-list-item>
                </div>
        
                <md-divider></md-divider>
        
                <md-list-item class="no-border pip-sticky-nav-menu-item pip-focusable p0 iqs-button" tabindex="-1" ng-if="$ctrl.canAddOrganization">
                    <md-button ng-click="$ctrl.addClick()" class="layout-row layout-align-start-center pip-button-block iqs-nav-organizations-button"
                        tabindex="-1">
                        <md-tooltip md-visible="showTooltip" class="iqs-sidenav-icon-tooltip" ng-if="$ctrl.pipMedia('sm') || $ctrl.pipMedia('md')" md-direction="right">
                            {{ ::'ADD_SITE' | translate }}
                        </md-tooltip>
                        <div class="pip-sticky-nav-menu-icon-block lp16">
                            <div class="iqs-add-organization">
                                <md-icon class="pip-sticky-nav-menu-icon flex-fixed m0 bm8" md-svg-icon="icons:plus">
                                </md-icon>
                            </div>
                        </div>
                        <div class="pip-sticky-nav-menu-title lm16 iqs-hide-small-text pip-sticky-nav-menu-title-moz pip-st-moz-buttons flex iqs-text">
                            {{ ::'ADD_SITE' | translate }}
                        </div>
                    </md-button>
                </md-list-item>
        
                <md-list-item class="no-border pip-sticky-nav-menu-item pip-focusable p0 iqs-button" tabindex="-1" ng-if="$ctrl.canRemoveOrganization">
                    <md-button ng-click="$ctrl.deleteClick()" class="  layout-row layout-align-start-center pip-button-block iqs-nav-organizations-button"
                        tabindex="-1">
                        <md-tooltip md-visible="showTooltip" class="iqs-sidenav-icon-tooltip" ng-if="$ctrl.pipMedia('sm') || $ctrl.pipMedia('md')" md-direction="right">
                            {{ ::'REMOVE_SITE' | translate }}
                        </md-tooltip>
                        <div class="pip-sticky-nav-menu-icon-block lp16">
                            <div class="iqs-add-organization">
                                <md-icon class="pip-sticky-nav-menu-icon flex-fixed m0 bm8" md-svg-icon="icons:minus">
                                </md-icon>
                            </div>
                        </div>
                        <div class="pip-sticky-nav-menu-title pip-sticky-nav-menu-title-moz pip-st-moz-buttons lm16 iqs-hide-small-text iqs-text">
                            {{ ::'REMOVE_SITE' | translate }}
                        </div>
                    </md-button>
                </md-list-item>
                <md-divider></md-divider>
                <md-list-item class="no-border pip-sticky-nav-menu-item pip-focusable p0 iqs-button" tabindex="2">
                    <md-button ng-click="$ctrl.closeClick()" class="layout-row layout-align-start-center pip-button-block iqs-nav-organizations-button"
                        tabindex="-1">
                        <md-tooltip md-visible="showTooltip" class="iqs-sidenav-icon-tooltip" ng-if="$ctrl.pipMedia('sm') || $ctrl.pipMedia('md')" md-direction="right">
                            {{ ::'CLOSE_SITES' | translate }}
                        </md-tooltip>
                        <div class="pip-sticky-nav-menu-icon-block lp16 ">
                            <div class="iqs-del-organization">
                                <md-icon class="pip-sticky-nav-menu-icon flex-fixed m0 bm8" md-svg-icon="icons:cross">
                                </md-icon>
                            </div>
                        </div>
                        <div class="pip-sticky-nav-menu-title pip-sticky-nav-menu-title-moz pip-st-moz-buttons lm16 iqs-hide-small-text iqs-text">
                            {{ ::'CLOSE_SITES' | translate }}
                        </div>
                    </md-button>
                </md-list-item>
            </md-list>
        </div>`
    });

import './OrganizationsStrings';