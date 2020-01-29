import { IShellService, IShellProvider } from './IShellService';

class ShellService implements IShellService {
    private _hideNav: string[] = [];
    private _hideBar: string[] = [];
    private _hideAux: string[] = [];
    private _panel: string = '';

    private _showEmergencyPlan: boolean;

    public addOrganizations: string = 'organizations';

    public constructor(
        private $rootScope: ng.IRootScopeService,
        private $timeout: ng.ITimeoutService,
        hideNav: string[],
        hideBar: string[],
        hideAux: string[],
        addOrganizations: string
    ) {
        this._hideNav = hideNav;
        this._hideBar = hideBar;
        this._hideAux = hideAux;
        this.addOrganizations = addOrganizations;
    }

    public get hideBar(): string[] {
        return this._hideBar;
    }

    public get hideNav(): string[] {
        return this._hideNav;
    }

    public set hideBar(value: string[]) {
        this._hideBar = value;
    }

    public set hideNav(value: string[]) {
        this._hideNav = value;
    }

    public get hideAux(): string[] {
        return this._hideAux;
    }

    public set hideAux(value: string[]) {
        this._hideAux = value;
    }

    public set panel(value: string) {
        // this.$timeout(() => {
            this._panel = value;
        // }, 0);
    }

    public get panel(): string {
        return this._panel;
    }

    public hideMain(): string[] {
        return _.intersection(this._hideBar, this._hideNav);
    }
}


class ShellProvider implements ng.IServiceProvider, IShellProvider {
    private _service: ShellService;
    private _hideNav: string[] = ['landing', 'loading', 'signin', 'signup', 'post_signup', 'recover_password', 'reset_password', 'change_password', 
    'verify_email', 'verify_email_success', 
    'organizations', 'organizations.home', 'organizations.create', 'organizations.connection', 'organizations.quick_start', 'organizations.welcome', 'organizations.invitation',
    'errors_maintenance', 'errors_missing_route', 'errors_no_connection', 'errors_unknown', 'errors_unsupported'];
    private _hideBar: string[] = ['landing', 'loading', 'errors_unsupported'];
    private _hideAux: string[] = ['landing', 'loading', 'signin', 'signup', 'post_signup', 'recover_password',
     'reset_password', 'change_password', 'verify_email', 'verify_email_success', 
     'organizations', 'organizations.home', 'organizations.create', 'organizations.connection', 'organizations.quick_start', 'organizations.welcome', 'organizations.invitation',
     'errors_maintenance', 'errors_missing_route', 'errors_no_connection', 'errors_unknown', 'errors_unsupported'];
    public addOrganizations: string = 'organizations.home';

    public set hideBar(value: string[]) {
        this._hideBar = value;
    }

    public set hideNav(value: string[]) {
        this._hideNav = value;
    }

    public set hideAux(value: string[]) {
        this._hideAux = value;
    }

    public addHideAux(value: string) {
        this._hideAux.push(value);
    }

    public addHideNav(value: string) {
        this._hideNav.push(value);
    }

    public addHideBar(value: string) {
        this._hideBar.push(value);
    }

    public $get(
        $timeout: ng.ITimeoutService,
        $rootScope: ng.IRootScopeService
    ): ShellService {
        "ngInject";

        if (this._service == null)
            this._service = new ShellService($rootScope, $timeout, this._hideNav, this._hideBar, this._hideAux, this.addOrganizations);

        return this._service;
    }
}


angular
    .module('iqsShellService', [])
    .provider('iqsShell', ShellProvider);