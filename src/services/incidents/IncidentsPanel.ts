import './IncidentsDetailsPanel';
import './IncidentsListPanel';
import './IncidentsMapPanel';
import { IncidentsPanelState } from './IncidentsPanelState';
import { Incident } from '../../data';
import { IIncidentsViewModel } from '../../models';

interface IIncidentsPanelBindings {
    [key: string]: any;
}

const IncidentsPanelBindings: IIncidentsPanelBindings = {

}

class IncidentsPanelChanges implements ng.IOnChangesObject, IIncidentsPanelBindings {
    [key: string]: ng.IChangesObject<any>;
}

class IncidentsPanelController implements ng.IController {
    public $onInit() { }
    public panelState: string;
    public cleanupFn: Function;

    constructor(
        private $element: JQuery,
        private $location: ng.ILocationService,
        $rootScope: ng.IRootScopeService,
        $state: ng.ui.IStateService,
        // iqsLoading: ILoadingService,
        pipSession: pip.services.ISessionService,
        public pipMedia: pip.layouts.IMediaService,
        private pipAuxPanel: pip.layouts.IAuxPanelService,
        private iqsIncidentsViewModel: IIncidentsViewModel,
    ) {
        "ngInject";

        $element.addClass('iqs-incidents-panel');
        this.panelState = IncidentsPanelState.List;
    }

    public get collection(): Incident[] {
        return this.iqsIncidentsViewModel.getCollection();
    }

    public get state(): string {
        return this.iqsIncidentsViewModel.state;
    }

    public get transaction(): pip.services.Transaction {
        return this.iqsIncidentsViewModel.getTransaction();
    }

    public selectItem(index?: number) {
        this.iqsIncidentsViewModel.selectItem(index);
    }

    public get selectedItem(): Incident {
        return this.iqsIncidentsViewModel.selectedItem;
    }

    public onList(): void {
        this.panelState = IncidentsPanelState.List;
        this.iqsIncidentsViewModel.reCalcElapsedDate();
    }

    public onDetails(): void {
        this.panelState = IncidentsPanelState.Details;
    }

}

(() => {
    angular
        .module('iqsIncidents.Panel')
        .component('iqsIncidentsPanel', {
            bindings: IncidentsPanelBindings,
            // templateUrl: 'incidents/panels/IncidentsPanel.html',
            controller: IncidentsPanelController,
            controllerAs: '$ctrl',
            template: `
                <iqs-incidents-list-panel
                    ng-if="$ctrl.panelState == 'list'"
                    iqs-incident-details="$ctrl.onDetails()"></iqs-incidents-list-panel>
            
                <iqs-incidents-details-panel
                    ng-if="$ctrl.panelState == 'details'"
                    iqs-incident="$ctrl.selectedItem"
                    iqs-incident-list="$ctrl.onList()"></iqs-incidents-details-panel>
            `
        })
})();
