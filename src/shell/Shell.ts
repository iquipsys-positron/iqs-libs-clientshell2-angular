import '../components/appbar/AppbarOrganizations';
import '../components/side_nav/SideNav';

import { IShellService } from './IShellService';
import { TimeZones } from '../common/LocationZones';
import { ILoadingService } from '../services';

interface IIqsShellBindings {
    [key: string]: any;
}

const IqsShellBindings: IIqsShellBindings = {}

class IqsShellChanges implements ng.IOnChangesObject, IIqsShellBindings {
    [key: string]: ng.IChangesObject<any>;
}

class IqsShellController implements ng.IController {
    public identity: any;
    public $reset: boolean = false;
    public $loading: boolean = false;
    public language: string;
    public sidenavState: pip.nav.SideNavState;

    private cf: Function[] = [];
    private dialogOpened: boolean = false;

    constructor(
        $rootScope: ng.IRootScopeService,
        $scope: ng.IScope,
        $timeout,
        private $state: ng.ui.IStateService,
        private iqsShell: IShellService,
        private pipAuxPanel: pip.layouts.IAuxPanelService,
        private pipMedia: pip.layouts.IMediaService,
        private pipIdentity: pip.services.IIdentityService,
        private pipNavService: pip.nav.INavService,
        private pipTranslate: pip.services.ITranslateService,
        private pipInformationDialog: pip.dialogs.IInformationDialogService,
        public iqsLoading: ILoadingService
    ) {
        "ngInject";


        this.pipNavService.sidenav.backdrop = true;
        this.cf.push($rootScope.$on(pip.services.LanguageChangedEvent, () => {
            this.language = this.pipTranslate.language;
            this.$reset = true;
            $timeout(() => {
                this.$reset = false;
            }, 0);
        }));

        this.language = this.pipTranslate.language;

        this.addZones();

        this.cf.push($rootScope.$on('showLoading', () => {
            this.$loading = true;
            $timeout(() => {
                this.$loading = true;
            }, 0);
        }));

        this.cf.push($rootScope.$on('hideLoading', () => {
            this.$loading = false;
            $timeout(() => {
                this.$loading = false;
            }, 0);
        }));
        this.cf.push($rootScope.$on(pip.services.IdentityChangedEvent, this.appHeader.bind(this)));
        this.cf.push($rootScope.$on(pip.layouts.MainResizedEvent, this.appHeader.bind(this)));
        this.cf.push($rootScope.$on('pipClusterError', () => {
            if (this.dialogOpened) return;
            this.dialogOpened = true;
            this.pipInformationDialog.show({
                title: this.pipTranslate.translate('CLUSTER_ERROR_TITLE'),
                message: this.pipTranslate.translate('CLUSTER_ERROR_MESSAGE')
            }, () => { this.dialogOpened = false; });
        }));
        this.appHeader();
    }

    public $onInit() { }

    public $onDestroy(): void {
        for (const f of this.cf) { f(); }
    }

    private addZones() {
        let zonesFilter: string[] = TimeZones.zones;
        let filteredZone: string[] = [];

        _.each(TimeZones.allZones, (s: string) => {
            let index: number = _.findIndex(zonesFilter, (f: string) => {
                return s.indexOf(f) == 0;
            });

            if (index > -1) {
                filteredZone.push(s);
            }
        });
        moment.tz.add(filteredZone);
    }

    public get add(): string {
        return this.iqsShell.addOrganizations || 'organizations';
    }

    public get panel(): string {
        return this.iqsShell.panel;
    }

    public showMain(): boolean {

        let find: boolean = true;
        if (this.$state.current.name == "") return false;
        this.iqsShell.hideMain().forEach(element => {
            if (element == this.$state.current.name) { find = false; return; }
        });
        return find
    }

    public showBar(): boolean {
        let find: boolean = true;
        if (this.$state.current.name == "") return false;
        this.iqsShell.hideBar.forEach(element => {
            if (element == this.$state.current.name) { find = false; return; }
        });
        return find
    }

    public showNav(): boolean {
        let find: boolean = true;
        if (this.$state.current.name == "") return false;
        this.iqsShell.hideNav.forEach(element => {
            if (element == this.$state.current.name) { find = false; return; }
        });
        return find
    }

    public showAux(): boolean {
        let find: boolean = true;
        if (this.$state.current.name == "") return false;
        this.iqsShell.hideAux.forEach(element => {
            if (element == this.$state.current.name) { find = false; return; }
        });
        return find
    }

    public isOpenAux(): boolean {
        return this.pipAuxPanel.isOpen();
    }

    private appHeader(): void {
        this.pipNavService.appbar.part('organizations', this.pipMedia('gt-xs'));
        if (!this.pipNavService.breadcrumb.text) {
            this.pipNavService.breadcrumb.text = 'LANDING_NAME';
        }
        this.pipNavService.sidenav.config.type = 'popup';
        if (this.pipIdentity.identity && this.pipIdentity.identity.id) {
            this.pipNavService.icon.showMenu();
        } else {
            this.pipNavService.icon.showIcon('iqs:iquipsys');
        }
    }
}

(() => {
    angular
        .module('iqsClientShell', [
            'pipNav',
            'pipEntry',
            'pipPageReset',

            'iqsAppbarOrganizations',
            'iqsLoading',
            'iqsSideNav'
        ])
        .component('iqsClientShell', {
            bindings: IqsShellBindings,
            controller: IqsShellController,
            controllerAs: '$ctrl',
            template:
                `<div
                class="layout-column flex layout-align-center-center"
                style="width: 100%; height: 100%; background-color: #eeeeee;"
                 ng-if="$ctrl.$loading">
                    <div style="padding: 16px; text-align: center;">
                        Application is loading. <br>Depending on your connection speed it might take a few minutes.
                    </div>
                </div>
            
            <div class="layout-row h-stretch w-stretch" ng-if="!$ctrl.$reset" ng-hide="$ctrl.$loading">
                <!-- Toolbar and left menu -->
                <div class="flex layout-column">
                    <!-- Main toolbar -->
                    <pip-sidenav ng-if="$ctrl.showNav() && $ctrl.pipMedia('xs')">
                        <iqs-side-nav iqs-add="$ctrl.add"></iqs-side-nav>
                    </pip-sidenav>
                    <pip-appbar ng-if="$ctrl.showBar()">
                        <pip-nav-icon pip-appbar-part="icon"></pip-nav-icon>
                        <pip-breadcrumb xxxclass="flex" pip-appbar-part="title:breadcrumb" pip-breakpoint="'gt-sm'"></pip-breadcrumb>
            
                        <div class="flex"></div>
                        <iqs-appbar-organizations pip-appbar-part="organizations" iqs-add="$ctrl.add"></iqs-appbar-organizations>
                        <pip-primary-actions class="flex-fixed" pip-appbar-part="actions:primary"></pip-primary-actions>
                        <pip-language-picker class="flex-fixed" value="$ctrl.language" pip-appbar-part="actions:language"></pip-language-picker>
                        <pip-secondary-actions class="flex-fixed" pip-appbar-part="menu"></pip-secondary-actions>
                    </pip-appbar>
                    <div class="flex-fixed animated-tabs" ui-view="tabs"></div>
                                
                    <!-- Left navbar and main -->
                    <div class="layout-row flex iqs-main-element">
                    <md-progress-linear class="populating-bar" ng-class="[$ctrl.iqsLoading.status === 'error' ? 'color-error-bg' : 'color-accent-bg' ]" md-mode="determinate" value="{{$ctrl.iqsLoading.progress}}" ng-if="$ctrl.iqsLoading.isLoading || $ctrl.iqsLoading.status === 'error'"></md-progress-linear>
                        <!-- Left navbar -->
                        <pip-sidenav ng-if="$ctrl.showNav() && $ctrl.pipMedia('gt-xs')">
                            <iqs-side-nav-menu></iqs-side-nav-menu>
                        </pip-sidenav>
            
                        <!-- Main content -->
                        <md-content id="content" class="flex">
                            <pip-main pip-container=".iqs-main-element">
                                <pip-main-body ui-view class="animated-view"></pip-main-body>
                            </pip-main>
                        </md-content>
                    </div>
                </div>
                <pip-aux-panel ng-if="$ctrl.showAux()">
                    <iqs-help-panel ng-if="$ctrl.isOpenAux() && $ctrl.panel === 'help'"></iqs-help-panel>
                    <iqs-global-help-panel ng-if="$ctrl.isOpenAux() && $ctrl.panel === 'global_help'"></iqs-global-help-panel>
                    <iqs-incidents-panel ng-if="$ctrl.isOpenAux() && $ctrl.panel === 'incident'"></iqs-incidents-panel>
                    <iqs-emergency-plans-panel ng-if="$ctrl.isOpenAux() && $ctrl.panel === 'emergency'"></iqs-emergency-plans-panel>
                </pip-aux-panel>
            </div>`
        })

})();

import './ShellStrings';
