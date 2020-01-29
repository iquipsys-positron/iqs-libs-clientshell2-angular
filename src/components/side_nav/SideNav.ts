import './parts/Header';
import './parts/Menu';
import './parts/Organizations';


interface ISideNavBindings {
    [key: string]: any;
}

const SideNavBindings: ISideNavBindings = {}

class SideNavChanges implements ng.IOnChangesObject, ISideNavBindings {
    [key: string]: ng.IChangesObject<any>;
}

class SideNavController implements ng.IController {
    public $onInit() { }
    public state: string = 'menu';
    constructor() {
        "ngInject";
    }
}

angular
    .module('iqsSideNav', [
        'iqsSideNav.Header',
        'iqsSideNav.Menu',
        'iqsSideNav.Organizations',
    ])
    .component('iqsSideNav', {
        bindings: SideNavBindings,
        controller: SideNavController,
        controllerAs: '$ctrl',
        template:
        `<iqs-side-nav-header class="pip-nav-header" iqs-state="$ctrl.state"></iqs-side-nav-header>

        <div class="pip-sections-container">
            <iqs-side-nav-organizations class="pip-nav-organizations pip-connections pip-animated pip-sections-absolute "
                 ng-hide="$ctrl.state != 'organizations'" iqs-state="$ctrl.state"></iqs-side-nav-organizations>
            <iqs-side-nav-menu class="pip-nav-menu pip-animated pip-sections-absolute"
                 ng-hide="$ctrl.state != 'menu'" ></iqs-side-nav-menu>
        </div>`
    })
