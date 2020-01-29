import { Resolution } from '../../../data';
import { IncidentsResolutionDialogParams } from './IIncidentsResolutionDialogService';

export class IncidentsResolutionDialogController extends IncidentsResolutionDialogParams implements ng.IController {

    public $onInit() { }

    public theme;

    constructor(
        private $mdDialog: angular.material.IDialogService,
        private $state: ng.ui.IStateService,
        private $timeout: ng.ITimeoutService,
        private $rootScope: ng.IRootScopeService
    ) {
        "ngInject";

        super();
        this.theme = $rootScope[pip.themes.ThemeRootVar];


        $timeout(() => {
            var el = $('md-dialog');
            var body = $('body');
            let y = this.event.clientY - el[0].clientHeight;
            let x = this.event.clientX - el[0].clientWidth;
            el.css('position', 'fixed');
            el.css('top', y);
            el.css('left', x);
        });
    }

    public onResolutionSetting(): void {
        this.$mdDialog.cancel();
        // this.$state.go('settings_system.resolutions');
        window.location.href = window.location.origin + `/config_events/index.html#/resolutions`;
    }

    public onCancel(): void {
        this.$mdDialog.cancel();
    }

    public selectItem(item: Resolution): void {
        this.$mdDialog.hide(item);
    }
}

angular
    .module('iqsIncidents.Dialog.Resolution', ['ngMaterial'])
    .controller('iqsIncidentsResolutionDialogController', IncidentsResolutionDialogController);

import "./IncidentsResolutionDialogService"
