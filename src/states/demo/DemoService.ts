import '../../shell/ShellService';

import { IDemoService } from './IDemoService';

export class DemoService implements IDemoService {
    private _DEMO_RU = {
        login: 'demo_ru',
        passwd: 'demo123321'
    };
    private _DEMO_EN = {
        login: 'demo_en',
        passwd: 'demo123321'
    };
    private login: string;
    private passwd: string;

    constructor(
        private $state: ng.ui.IStateService,
        private $injector: ng.auto.IInjectorService,
        private pipAuthState: pip.rest.IAuthStateService,
        private pipErrorPageConfigService: pip.errors.IErrorPageConfigService,
        private pipEntry: pip.entry.IEntryService,
        private pipRest: pip.rest.IRestService
    ) {
        "ngInject";

    }

    public setDemoParams(): void {
        if (this.$state && this.$state.params && this.$state.params.lang) {
            if (this.$state.params.lang === 'ru') {
                this.login = this._DEMO_RU.login;
                this.passwd = this._DEMO_RU.passwd;
            } else {
                this.login = this._DEMO_EN.login;
                this.passwd = this._DEMO_EN.passwd;
            }
        } else {
            this.login = this._DEMO_RU.login;
            this.passwd = this._DEMO_RU.passwd;
        }
    }

    private checkSupported(): boolean {
        let pipSystemInfo: any = this.$injector.has('pipSystemInfo') ? this.$injector.get('pipSystemInfo') : null;
        if (!pipSystemInfo) {
            return true;
        }

        if (!this.pipErrorPageConfigService || !this.pipErrorPageConfigService.configs ||
            !this.pipErrorPageConfigService.configs.Unsupported || !this.pipErrorPageConfigService.configs.Unsupported.Active) {

            return true;
        }

        let browser: string = pipSystemInfo.browserName;
        let version: string = pipSystemInfo.browserVersion;
        version = version.split(".")[0];

        let supported = this.pipErrorPageConfigService.configs.Unsupported.Params && this.pipErrorPageConfigService.configs.Unsupported.Params.supported ? this.pipErrorPageConfigService.configs.Unsupported.Params.supported : null;
        if (!supported) {

            return true;
        }

        if (browser && supported[browser] && version >= supported[browser]) {
            return true;
        }

        this.$state.go(pip.errors.ErrorsUnsupportedState);

        return false;
    }

    public signin(): void {
        if (!this.checkSupported()) return;
        this.pipRest.setHeaders({
            'session-id': undefined,
            'user-id': undefined,
            'account-id': undefined
        });

        this.pipRest.getResource('signin').call({
            login: this.login,
            password: this.passwd
        },
            (data: pip.entry.SessionData) => {
                this.pipEntry.openSession(data, false);
                this.$state.go(this.pipAuthState.authorizedState());

            },
            (error: any) => {

            });
    }

    public get demo_ru(): any {
        return this._DEMO_RU;
    }

    public get demo_en(): any {
        return this._DEMO_EN;
    }

    public isDemoUser(identity: pip.entry.SessionData): boolean {
        if (!identity) return false;
        if (!identity.user) return false;

        return identity.user.login == this.demo_en.login || identity.user.login == this.demo_ru.login
    }
}


angular
    .module('iqsDemo', ['iqsShellService'])
    .service('iqsDemo', DemoService);
