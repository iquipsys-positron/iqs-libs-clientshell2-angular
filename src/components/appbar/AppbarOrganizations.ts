import { States } from '../../common';
import { Organization } from '../../data';
import { IOrganizationsViewModel } from '../../models';
import { IOrganizationService, LoadingCompleteEvent, ILoadingService, OrganizationChangedEvent } from '../../services';

interface IAppbarOrganizationsBindings {
    [key: string]: any;

    add: any;
}

const AppbarOrganizationsBindings: IAppbarOrganizationsBindings = {
    add: '<?iqsAdd'
}

class AppbarOrganizationsChanges implements ng.IOnChangesObject, IAppbarOrganizationsBindings {
    [key: string]: ng.IChangesObject<any>;

    add: ng.IChangesObject<string>;
}

class AppbarOrganizationsController implements ng.IController {
    public $onInit() { }
    private addState: string = 'organizations.home';
    public currentOrganization: Organization;
    public organizations: Organization[];
    private cf: Function[] = [];

    constructor(
        $rootScope: ng.IRootScopeService,
        private $state: ng.ui.IStateService,
        private pipIdentity: pip.services.IIdentityService,
        private pipTranslate: pip.services.ITranslateService,
        private pipInformationDialog: pip.dialogs.IInformationDialogService,
        private iqsOrganization: IOrganizationService,
        private iqsOrganizationsViewModel: IOrganizationsViewModel,
        private iqsLoading: ILoadingService
    ) {
        "ngInject";

        this.organizations = [];
        const runWhenReady = () => {
            if (this.iqsOrganizationsViewModel.state !== States.Data) return;
            this.currentOrganization = this.iqsOrganization.organization;
            this.prepareOrganizations();
        };
        if (this.iqsLoading.isDone) { runWhenReady(); }
        this.cf.push($rootScope.$on(LoadingCompleteEvent, () => { runWhenReady(); }));
        this.cf.push($rootScope.$on(OrganizationChangedEvent, () => { runWhenReady(); }));
    }

    public $onDestroy() {
        for (const f of this.cf) { f(); }
    }

    public get busy(): boolean {
        return this.iqsOrganizationsViewModel.getTransaction().busy();
    }

    private prepareOrganizations(): void {
        this.organizations.length = 0;
        if (!this.pipIdentity || !this.pipIdentity.identity) return;
        this.pipIdentity.identity.user.organizations.forEach((organization: Organization) => {
            const idx: number = _.findIndex(this.iqsOrganizationsViewModel.organizations, ['id', organization.id]);
            if (~idx) {
                this.organizations.push(this.iqsOrganizationsViewModel.organizations[idx]);
            }
        });
    }

    private checkDemo(params: string): boolean {
        if (!this.iqsOrganization.isDemo) return true;

        let message = params == 'add_organization' ? 'DEMO_LIMIT_ADD_SITE_INFORMATION_DIALOG_MESSAGE' : 'DEMO_LIMIT_REMOVE_SITE_INFORMATION_DIALOG_MESSAGE';
        this.pipInformationDialog.show(
            {
                event: null,
                title: this.pipTranslate.translate('DEMO_LIMIT_INFORMATION_DIALOG_TITLE'),
                message: this.pipTranslate.translate(message)
            });
        return false;
    }

    public get canAddOrganization(): boolean {
        return this.iqsOrganization.canAddOrganization;
    }

    public onOrganizationClick(id: string) {
        this.iqsOrganization.organization = this.iqsOrganizationsViewModel.getOrganizationById(id);
    }

    public onAddClick() {
        if (!this.checkDemo('add_organization')) return;
        this.$state.go(this.addState, { toState: this.$state.current.name, toParams: this.$state.params });
    }

    public onSettingsClick() {
        window.location.href = window.location.origin + `/config_organization/index.html#/organization`;
    }
}

angular
    .module('iqsAppbarOrganizations', ['iqsOrganizations.Service'])
    .component('iqsAppbarOrganizations', {
        bindings: AppbarOrganizationsBindings,
        controller: AppbarOrganizationsController,
        controllerAs: '$ctrl',
        template:
            `<md-menu md-position-mode="target bottom" ng-if="$ctrl.currentOrganization" ng-disabled="$ctrl.busy">
            <md-button aria-label="Organizations menu" ng-click="$mdMenu.open()">
                <div class="flex layout-row">
                    <md-icon md-menu-origin md-svg-icon="iqs:organization"></md-icon>
                    <div class="flex lp8">{{ $ctrl.currentOrganization.name }}</div>
                    <md-icon ng-if="!$mdMenuIsOpen" md-menu-origin md-svg-icon="webui-icons:triangle-down"></md-icon>
                    <md-icon ng-if="$mdMenuIsOpen" md-menu-origin md-svg-icon="webui-icons:triangle-up"></md-icon>
                </div>
            </md-button>
            <md-menu-content width="4" class="iqs-appbar-organizations">
                <md-menu-item ng-repeat="organization in $ctrl.organizations track by $index">
                    <md-button ng-click="$ctrl.onOrganizationClick(organization.id)" ng-class="{'active': organization.id === $ctrl.currentOrganization.id}">
                        {{ ::organization.name | translate }}
                    </md-button>
                </md-menu-item>
                <md-divider></md-divider>
                <md-menu-item ng-if="$ctrl.canAddOrganization">
                    <md-button ng-click="$ctrl.onAddClick()">
                        {{ ::'NEW_SITE' | translate }}
                    </md-button>
                </md-menu-item>
                <md-menu-item>
                    <md-button ng-click="$ctrl.onSettingsClick()">
                        {{ ::'SITES_SETTINGS' | translate }}
                    </md-button>
                </md-menu-item>
            </md-menu-content>
        </md-menu>`
    })

import './AppbarOrganizationsStrings';
