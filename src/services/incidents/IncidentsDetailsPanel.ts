import { IIncidentsResolutionDialogService, IObjectFormatService } from '../../common';
import { Resolution, Incident, ObjectState } from '../../data';
import {
    IResolutionsViewModel,
    IIncidentsViewModel,
    IIncidentCurrentObjectStateViewModel,
    IStatesViewModel,
    IObjectStatesViewModel
} from '../../models';
import {
    ITypeCollectionsService,
    IOrganizationService,
    IAccessConfigService,
    ILoadingService,
    TypeCollection,
    LoadingCompleteEvent
} from '../../services';
import { IShellService } from '../../shell';
import { IncidentsStateName } from './Incidents';

interface IIncidentsDetailsPanelBindings {
    [key: string]: any;

    incident: any;
    onIncidentList: any;
}

const IncidentsDetailsPanelBindings: IIncidentsDetailsPanelBindings = {
    incident: '<?iqsIncident',
    onIncidentList: '&iqsIncidentList'
}

class IncidentDetails {
    public object_id: string; //'1',
    public object_name: string; //'Игорь Конь',
    public object_type: string; //'1',
    public object_category: string; //'Игорь Конь',    
    public ref_description: string; //'Электрослесарь',
    public ref_groups: string; //'Электромеханики, Бригада 1',
    public time: Date; //'2 фев 2017  11:20',
    public ref_phone: string; //'+7 (934) 234-4563',
    public ref_email?: string; //'+7 (934) 234-4563',
    public description: string; //'Превышение скорости ограничение и превышение ограничение и превышение',
    public locationName: string; //'Главная дорога',
    public online: number; //'4 час 5 мин',
    public offline: number; //'4 час 5 мин',
    public freezed: number; //'2 час 5 мин',
    public immobile: number; //'2 час 5 мин',
    public incidentCount: number; //'3 других происшествий',
    public status: string; //'a',
    public defaultResolution: Resolution; //'Принято к сведению',
    public resolution: string;
    public assigned_name: string;
    // public resolutionId: string;
    public incidentValue: string; //'45 км/ч (макс. 30 км/ч)'
    pos?: any;
    // public longitude?: number;
    // public latitude?: number;
}

class IncidentsDetailsPanelController implements ng.IController {
    public $onInit() { }
    private incident: Incident;
    private resolutions: Resolution[];
    public ruleTypeMeasure: TypeCollection;
    public typeCollection: TypeCollection;
    public objectTypeCollection: TypeCollection;
    public incidentDetails: IncidentDetails = <IncidentDetails>{};
    public onIncidentList: () => void;
    public hideButton: boolean;
    public isExpanded: boolean;
    public expand: boolean;
    public organizationName: string;
    public accessConfig: any;
    private cf: Function[] = [];

    constructor(
        $rootScope: ng.IRootScopeService,
        private $element: JQuery,
        private $state: ng.ui.IStateService,
        private pipAuxPanel: pip.layouts.IAuxPanelService,
        private pipTranslate: pip.services.ITranslateService,
        private pipDateFormat: pip.dates.IDateFormatService,
        private iqsIncidentsViewModel: IIncidentsViewModel,
        private iqsIncidentCurrentObjectStatesViewModel: IIncidentCurrentObjectStateViewModel,
        private iqsResolutionsViewModel: IResolutionsViewModel,
        private iqsIncidentsResolutionDialog: IIncidentsResolutionDialogService,
        private iqsTypeCollectionsService: ITypeCollectionsService,
        public iqsStatesViewModel: IStatesViewModel,
        private iqsOrganization: IOrganizationService,
        private iqsObjectFormat: IObjectFormatService,
        private iqsShell: IShellService,
        private iqsAccessConfig: IAccessConfigService,
        private iqsObjectStatesViewModel: IObjectStatesViewModel,
        private iqsLoading: ILoadingService
    ) {
        "ngInject";

        $element.addClass('iqs-incidents-details-panel');
        const runWhenReady = () => {
            this.accessConfig = this.iqsAccessConfig.getStateConfigure(IncidentsStateName).access;
            this.organizationName = this.iqsOrganization.organization ? this.iqsOrganization.organization.name : '';
            this.init();
        }
        if (this.iqsLoading.isDone) { runWhenReady(); }
        this.cf.push($rootScope.$on(LoadingCompleteEvent, runWhenReady.bind(this)));
    }

    public $onDestroy() {
        for (const f of this.cf) { f(); }
    }

    private init(): void {
        if (!this.incident) {

            return
        }
        this.hideButton = false;
        this.updateOnlineStatus();
        this.getIncidentsCount(this.incident);

        this.ruleTypeMeasure = this.iqsTypeCollectionsService.getEventRuleTypeMeasure();
        this.typeCollection = this.iqsTypeCollectionsService.getEventRuleType();
        this.objectTypeCollection = this.iqsTypeCollectionsService.getObjectType();


        let currentObjectState: ObjectState = new ObjectState();
        let objState;
        if (this.incident.object) {
            currentObjectState = this.getCurrentStateObjectById(this.incident.object.id);
            // objState = this.iqsStatusService.status(currentObjectState.time);
        }

        this.fillDetails(currentObjectState);
    }

    private fillDetails(currentObjectState: ObjectState): void {
        let stateActive: boolean = this.iqsStatesViewModel.isActive(currentObjectState);
        this.incidentDetails = {
            object_id: this.incident.object ? this.incident.object.id : '',
            object_name: this.incident.object ? this.incident.object.name : '',
            object_type: this.incident.object ? this.incident.object.type : '',
            object_category: this.incident.object ? this.incident.object.category : '',
            ref_description: this.incident.object ? this.iqsObjectFormat.formatSubtitle(this.incident.object) : '',
            ref_groups: this.iqsIncidentsViewModel.getGroups(this.incident.object),
            time: this.incident.time,
            ref_phone: this.incident.object ? this.incident.object.phone : '',
            ref_email: this.incident.object ? this.incident.object.email : '',
            description: this.incident.description,
            locationName: this.iqsIncidentsViewModel.getLocationName(this.incident),
            online: stateActive ? currentObjectState.online * 1000 : null,
            offline: stateActive ? null : new Date().getTime() - moment(currentObjectState.time).toDate().getTime(),
            freezed: stateActive && currentObjectState.freezed ? currentObjectState.freezed * 1000 : null,
            immobile: stateActive && currentObjectState.immobile ? currentObjectState.immobile * 1000 : null,
            incidentCount: 0,
            status: '',
            defaultResolution: null,
            resolution: '',
            assigned_name: this.incident.assigned_name,
            incidentValue: this.iqsIncidentsViewModel.getIncidentDetails(this.incident), //'45 км/ч (макс. 30 км/ч)'
            pos: {
                latitude: this.incident.pos ? this.incident.pos.coordinates[1] : null,
                longitude: this.incident.pos ? this.incident.pos.coordinates[0] : null
            }

        };

        this.isExpanded = this.incidentDetails.ref_groups && this.incidentDetails.ref_groups.length > 0 || !!this.incidentDetails.online || !!this.incidentDetails.offline
            || !!this.incidentDetails.freezed || !!this.incidentDetails.immobile
            || !!this.incidentDetails.ref_phone || !!this.incidentDetails.ref_email || this.incidentDetails.incidentCount > 1;

        this.expand = false;
        this.resolutions = this.iqsResolutionsViewModel.getResolutionsByEventRuleId(this.incident.rule_id);

        if (this.resolutions && this.resolutions.length > 0) {
            // search default resolution for this rule
            let defaultResolutionIndex = _.findIndex(this.resolutions, (r: Resolution) => {
                return r.default == true && r.rule_ids && r.rule_ids.length > 0;
            });
            // search default resolution for all rule
            if (defaultResolutionIndex == -1) {
                defaultResolutionIndex = _.findIndex(this.resolutions, (r: Resolution) => {
                    return r.default == true;
                });
            }
            if (defaultResolutionIndex > -1) {
                this.incidentDetails.defaultResolution = this.resolutions[defaultResolutionIndex];
                this.incidentDetails.resolution = this.incidentDetails.defaultResolution.resolution;
            } else {
                this.incidentDetails.resolution = this.pipTranslate.translate('INCIDENT_DEFAULT_RESOLUTION');
            }
        } else {
            this.incidentDetails.resolution = this.pipTranslate.translate('INCIDENT_DEFAULT_RESOLUTION');
        }
    }

    private getIncidentsCount(incident: Incident): void {
        if (!incident.object_id) return;

        let currentdate: Date = new Date();
        let fromDate: Date = new Date(currentdate.getTime() - 24 * 60 * 60 * 1000);
        this.iqsIncidentsViewModel.readOptionaly(
            {
                closed: false,
                object_id: incident.object_id,
                from_time: fromDate
            },
            (incidents: Incident[]) => {
                this.incidentDetails.incidentCount = incidents.length;
            }
        );
    }

    private getTime(value: number): string { // value in second
        let timeStr: string = '';
        if (!value) return null;

        let hours: number;
        let minutes: number;

        hours = Math.floor(value / 3600);
        minutes = Math.floor((value - hours * 3600) / 60);

        if (hours) {
            timeStr = timeStr + hours + ' час ';
        }
        if (minutes) {
            timeStr = timeStr + minutes + ' мин';
        } else {
            if (value > 0 && hours === 0 && minutes === 0) {
                timeStr = 'меньше минуты';
            }
        }

        return timeStr;
    }

    private updateOnlineStatus() {
        if (this.incident.object && this.incident.object.id) {
            this.iqsIncidentCurrentObjectStatesViewModel.initCurrentObjectStates('all', () => {
                let currentObjectState: ObjectState = this.getCurrentStateObjectById(this.incident.object.id);

                this.fillDetails(currentObjectState);
            });
        }
    }

    public closeAuxPanel(): void {
        this.pipAuxPanel.close();
        this.hideButton = true;
        this.iqsIncidentsViewModel.hideAll = true;
        this.iqsShell.panel = '';

        setTimeout(() => {
            this.hideButton = false;
            this.onIncidentList();
        }, 600);
    }

    public openRetrospective() {
        if (this.incidentDetails && this.incidentDetails.object_id) {
            this.iqsObjectStatesViewModel.clean();
            let date = this.incidentDetails.time ? moment(this.incidentDetails.time).add('seconds', 1).toDate().toISOString() : '';
            // this.$state.go('retrospective.map', { focus_object_id: this.incidentDetails.object_id, retro_date: date }, { reload: true });
            window.location.href = window.location.origin + `/retrospective/index.html#/app/map?focus_object_id=${this.incidentDetails.object_id}&retro_date=${date}`;
        }

    }

    public getCurrentStateObjectById(id: string): ObjectState {
        return this.iqsIncidentCurrentObjectStatesViewModel.getCurrentObjectStateByObjectId(id) || <ObjectState>{}; // todo ??
    }

    public get transaction(): pip.services.Transaction {
        return this.iqsIncidentsViewModel.getTransaction();
    }

    public onObjectClick(): void {
        let type = this.objectTypeCollection[this.incidentDetails.object_type];
        // this.$state.go('monitoring.objects',
        //     {
        //         type: type ? this.pipTranslate.translate(type.title) : '',
        //         object_id: this.incidentDetails.object_id
        //     }, { reload: true });
        let url = `/monitoring/index.html#/app/objects?`;
        if (type) {
            url += 'type=' + this.pipTranslate.translate(type.title) + '&';
        }
        url += 'object_id=' + this.incidentDetails.object_id;
        window.location.href = window.location.origin + url;
    }

    public onChooseResolution($event): void {
        this.iqsIncidentsResolutionDialog.show($event,
            {
                resolutions: this.resolutions,
                event: $event
            },
            (data?: Resolution) => {
                if (data) {
                    if (!data) return;
                    this.incidentDetails.resolution = data.resolution;
                }
            },
            () => {
                // do nothing
            }
        );
    }

    public onIncidentClose() {
        if (!this.incidentDetails.resolution) return;

        let resolution: Resolution = this.iqsResolutionsViewModel.getResolutionsByName(this.incidentDetails.resolution);
        let updateIncident: Incident = <Incident>{ resolution: this.incidentDetails.resolution };

        if (resolution && resolution.id) {
            updateIncident.resolution_id = resolution.id;
        } else {
            updateIncident.resolution_id = 'all';
        }
        this.iqsIncidentsViewModel.updateIncidentById(this.incident.id,
            updateIncident,
            (data: Incident) => {
                this.iqsIncidentsViewModel.removeItem(data.id);
                this.onIncidentList();
            },
            (error: any) => {
                // todohandle error
            });
    }
}

(() => {
    angular
        .module('iqsIncidents.Panel.Details', [
            'iqsIncidents.Dialog.Resolution',
            'iqsIncidents.ViewModel',
            'iqsIncidentCurrentObjectStates.ViewModel',
            'iqsResolutions.ViewModel',
            'iqsStates.ViewModel',
            'iqsObjectStates.ViewModel',
        ])
        .component('iqsIncidentsDetailsPanel', {
            bindings: IncidentsDetailsPanelBindings,
            // templateUrl: 'incidents/panels/IncidentsDetailsPanel.html',
            controller: IncidentsDetailsPanelController,
            controllerAs: '$ctrl',
            template: `
                <div class="aux-btn-close pointer" ng-click="$ctrl.closeAuxPanel()" ng-if="!$ctrl.hideButton">
                    <md-icon md-svg-icon="icons:cross"></md-icon>
                </div>

                <div class="text-title layout-row layout-align-start-start">
                    <md-button class="md-icon-button flex-fixed" ng-click="$ctrl.onIncidentList()">
                        <md-icon md-svg-icon="icons:arrow-left"></md-icon>
                    </md-button>
                    <div>
                        {{ ::$ctrl.incidentDetails.description }}
                    </div>
                </div>

                <div class="pip-ref-list pip-scroll-y layout-column p16 tp0 flex">

                    <div class="layout-row layout-align-start-center bm8">
                        <pip-avatar class="pip-face pip-pic rm16 flex-fixed pointer" pip-rebind="true" pip-id="$ctrl.incidentDetails.object_id" pip-name="$ctrl.incidentDetails.object_name"
                            ng-click="$ctrl.onObjectClick()">
                        </pip-avatar>
                        <div class="pip-content flex">
                            <div class="flex">
                                <div class="text-subhead2 text-overflow">
                                    {{ ::$ctrl.incidentDetails.object_name }}
                                </div>
                                <div class="text-body1 color-secondary-text text-overflow">
                                    {{ ::$ctrl.incidentDetails.ref_description }}
                                </div>
                            </div>
                        </div>
                        <div class="expanded-button  flex-fixed" ng-if="$ctrl.isExpanded">
                            <md-button class="md-icon-button" ng-click="$ctrl.expand = !$ctrl.expand">
                                <md-icon md-svg-icon="icons:chevron-down" ng-if="!$ctrl.expand"> </md-icon>
                                <md-icon md-svg-icon="icons:chevron-up" ng-if="$ctrl.expand"></md-icon>
                            </md-button>
                        </div>
                    </div>

                    <div class="pip-ref-list-item  layout-row layout-align-start-center incident-content" ng-if="$ctrl.expand && $ctrl.incidentDetails.ref_groups">
                        <md-icon md-svg-icon="iqs:team" class="incident-icon">
                        </md-icon>
                        <div class="pip-content tp8 bp8">
                            <div class="flex text-body1 text-overflow">
                                {{ ::$ctrl.incidentDetails.ref_groups }}
                            </div>
                            <div class="pip-subtitle text-caption">
                                {{ ::'INCIDENT_GROUPS' | translate }}
                            </div>
                        </div>
                    </div>

                    <div class="pip-ref-list-item  layout-row layout-align-start-center incident-content" ng-if="$ctrl.expand && $ctrl.incidentDetails.online">
                        <md-icon md-svg-icon="iqs:comm-on" class="incident-icon">
                        </md-icon>
                        <div class="pip-content tp8 bp8">
                            <div class="flex text-body1 text-overflow">
                                {{ ::$ctrl.incidentDetails.online | formatTimeLong }}
                            </div>
                            <div class="pip-subtitle text-caption">
                                {{::'INCIDENT_ONLINE' | translate}}
                            </div>
                        </div>
                    </div>

                    <div class="pip-ref-list-item  layout-row layout-align-start-center incident-content" ng-if="$ctrl.expand && $ctrl.incidentDetails.offline">
                        <md-icon md-svg-icon="iqs:comm-off" class="incident-icon">
                        </md-icon>
                        <div class="pip-content tp8 bp8">
                            <div class="flex text-body1 text-overflow">
                                {{ ::$ctrl.incidentDetails.offline | formatTimeLong }}
                            </div>
                            <div class="pip-subtitle text-caption">
                                {{ ::'INCIDENT_OFFLINE' | translate}}
                            </div>
                        </div>
                    </div>

                    <div class="pip-ref-list-item  layout-row layout-align-start-center incident-content" ng-if="$ctrl.expand && $ctrl.incidentDetails.freezed">
                        <md-icon md-svg-icon="iqs:comm-off" class="incident-icon">
                        </md-icon>
                        <div class="pip-content tp8 bp8">
                            <div class="flex text-body1 text-overflow">
                                {{ ::$ctrl.incidentDetails.freezed | formatTimeLong }}
                            </div>
                            <div class="pip-subtitle text-caption">
                                {{::'INCIDENT_FREEZED' | translate}}
                            </div>
                        </div>
                    </div>

                    <div class="pip-ref-list-item  layout-row layout-align-start-center incident-content" ng-if="$ctrl.expand && $ctrl.incidentDetails.immobile">
                        <md-icon md-svg-icon="iqs:comm-off" class="incident-icon">
                        </md-icon>
                        <div class="pip-content tp8 bp8">
                            <div class="flex text-body1 text-overflow">
                                {{ ::$ctrl.incidentDetails.immobile | formatTimeLong }}
                            </div>
                            <div class="pip-subtitle text-caption">
                                {{::'INCIDENT_IMMOBILE' | translate}}
                            </div>
                        </div>
                    </div>

                    <div class="pip-ref-list-item  layout-row layout-align-start-center incident-content" ng-if="$ctrl.expand && $ctrl.incidentDetails.ref_phone">
                        <md-icon md-svg-icon="icons:phone" class="incident-icon">
                        </md-icon>
                        <div class="pip-content tp8 bp8">
                            <div class="flex text-body1 text-overflow">
                                {{ ::$ctrl.incidentDetails.ref_phone }}
                            </div>
                            <div class="pip-subtitle text-caption">
                                {{::'INCIDENT_PHONE' | translate}}
                            </div>
                        </div>
                    </div>

                    <div class="pip-ref-list-item  layout-row layout-align-start-center incident-content" ng-if="$ctrl.expand && $ctrl.incidentDetails.ref_email">
                        <md-icon md-svg-icon="icons:message" class="incident-icon">
                        </md-icon>
                        <div class="pip-content tp8 bp8">
                            <div class="flex text-body1 text-overflow">
                                {{ ::$ctrl.incidentDetails.ref_email }}
                            </div>
                            <div class="pip-subtitle text-caption">
                                {{::'EMAIL' | translate}}
                            </div>
                        </div>
                    </div>

                    <div class="pip-ref-list-item  layout-row layout-align-start-center incident-content" ng-if="$ctrl.expand && $ctrl.incidentDetails.incidentCount > 1">
                        <md-icon md-svg-icon="icons:ribbon" class="incident-icon">
                        </md-icon>
                        <div class="pip-content tp8 bp8">
                            <div class="flex text-body1 text-overflow">
                                {{ ::$ctrl.incidentDetails.incidentCount }} {{ ::'INCIDENT_DAY_COUNT_TEXT' | translate }}
                            </div>
                            <div class="pip-subtitle text-caption">
                                {{::'INCIDENT_COUNT_EVENT' | translate}}
                            </div>
                        </div>
                    </div>

                    <div class="incident-divider-top divider-top tm8 bm16"></div>

                    <div class="pip-ref-list-item  layout-row layout-align-start-center incident-content" ng-if="$ctrl.incidentDetails.assigned_name">
                        <md-icon md-svg-icon="iqs:schedule" class="incident-icon">
                        </md-icon>
                        <div class="pip-content tp8 bp8">
                            <div class="flex text-body1 text-overflow">
                                {{ ::$ctrl.incidentDetails.assigned_name }}
                            </div>
                            <div class="pip-subtitle text-caption">
                                {{ ::'INCIDENT_ASSIGNED' | translate }}
                            </div>
                        </div>
                    </div>

                    <div class="pip-ref-list-item  layout-row layout-align-start-center incident-content" ng-if="$ctrl.incidentDetails.incidentValue">
                        <md-icon md-svg-icon="iqs:incident" class="incident-icon">
                        </md-icon>
                        <div class="pip-content tp8 bp8">
                            <div class="flex text-body1 text-overflow">
                                {{ ::$ctrl.incidentDetails.incidentValue }}
                            </div>
                            <div class="pip-subtitle text-caption">
                                {{ ::'INCIDENT_VALUE' | translate }}
                            </div>
                        </div>
                    </div>

                    <div class="pip-ref-list-item  layout-row layout-align-start-center incident-content">
                        <md-icon md-svg-icon="icons:time" class="incident-icon">
                        </md-icon>
                        <div class="pip-content tp8 bp8">
                            <div class="flex text-body1 text-overflow">
                                {{ ::$ctrl.incidentDetails.time | formatMiddleDateLongTime }}
                            </div>
                            <div class="pip-subtitle text-caption">
                                {{ ::'INCIDENT_TIME' | translate }}
                            </div>
                        </div>
                    </div>

                    <div class="pip-ref-list-item  layout-row layout-align-start-center incident-content">
                        <md-icon md-svg-icon="iqs:location" class="incident-icon">
                        </md-icon>
                        <div class="pip-content tp8 bp8">
                            <div class="flex text-body1 text-overflow" ng-if="$ctrl.incidentDetails.locationName">
                                {{ ::$ctrl.incidentDetails.locationName }}
                            </div>
                            <div class="flex text-body1 text-overflow" ng-if="!$ctrl.incidentDetails.locationName">
                                <!-- {{ ::'INCIDENT_WHOLE_SITE' | translate }}  -->
                                {{ $ctrl.organizationName }}
                            </div>
                            <div class="pip-subtitle text-caption">
                                {{::'INCIDENT_LOCATION' | translate }}
                            </div>
                        </div>
                    </div>

                    <div class="incident-map tm8 bm8" ng-if="$ctrl.incidentDetails.pos && $ctrl.incidentDetails.pos.latitude && $ctrl.incidentDetails.pos.longitude">
                        <iqs-incidents-map-panel iqs-object="$ctrl.incidentDetails.pos" ng-click="$ctrl.openRetrospective()">
                        </iqs-incidents-map-panel>
                    </div>

                    <div class="layout-row layout-align-start-start tp8 bm8" xxxng-if="$ctrl.accessConfig.incidentClose">
                        <md-input-container class="md-block flex" class="incident-input">
                            <label>{{::'INCIDENT_RESOLUTION' | translate }}</label>
                            <textarea ng-model="$ctrl.incidentDetails.resolution" aria-label="RESOLUTION" md-select-on-focus ng-disabled="!$ctrl.accessConfig.incidentClose">

                            </textarea>
                        </md-input-container>
                        <md-button class="md-icon-button tm8" ng-click="$ctrl.onChooseResolution($event)" ng-disabled="!$ctrl.accessConfig.incidentClose">
                            <md-icon md-svg-icon="icons:dots"></md-icon>
                        </md-button>
                    </div>

                    <div class="incident-button">
                        <md-button class="color-accent-bg tm12 flex" aria-label="DOWNLOAD" xxxng-if="$ctrl.accessConfig.incidentClose" ng-click="$ctrl.onIncidentClose()"
                            ng-disabled="$ctrl.transaction.busy() || !$ctrl.incidentDetails.resolution || !$ctrl.accessConfig.incidentClose">
                            {{ ::'INCIDENT_CLOSE_BUTTON' | translate }}
                        </md-button>
                    </div>
                </div>
            `
        })
})();
