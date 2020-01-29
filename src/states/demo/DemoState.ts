import { IDemoService } from './IDemoService';
import { IShellProvider } from '../../shell';

export const DemoStateName: string = 'demo';

class DemoStateController implements ng.IController {
    constructor(
        private iqsDemo: IDemoService
    ) {
        "ngInject";
        this.iqsDemo.setDemoParams();
        this.iqsDemo.signin();
    }

    public $onInit() {    }
}

function configureDemoStateRoute(
    $stateProvider: pip.rest.IAuthStateService,
    iqsShellProvider: IShellProvider
) {
    "ngInject";

    $stateProvider
        .state(DemoStateName, {
            url: '/demo?lang',
            controller: DemoStateController,
            auth: false,
            controllerAs: '$ctrl',
            template: `<div></div>`
        });

    // hide sidenav
    iqsShellProvider.addHideNav('demo');
    iqsShellProvider.addHideBar('demo');
}

angular
    .module('iqsDemo')
    .config(configureDemoStateRoute);

import './DemoStrings';
