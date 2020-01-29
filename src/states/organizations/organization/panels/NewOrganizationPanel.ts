import { Organization } from '../../../../data';
import { IMapService } from '../../../../services';

declare let google: any;

class NewOrganizationParams {
    public organization: Organization;
}

interface INewOrganizationPanelBindings {
    [key: string]: any;

    onSave: any;
    organization: any;
    ngDisabled: any;
}

const NewOrganizationPanelBindings: INewOrganizationPanelBindings = {
    onSave: '&iqsSave',
    organization: '<?iqsItem',
    ngDisabled: '&?'
}

class NewOrganizationPanelChanges implements ng.IOnChangesObject, INewOrganizationPanelBindings {
    [key: string]: ng.IChangesObject<any>;

    onSave: ng.IChangesObject<() => ng.IPromise<void>>;
    organization: ng.IChangesObject<Organization>;
    ngDisabled: ng.IChangesObject<() => ng.IPromise<void>>;
}

class TimeZoneItem {
    public name: string;
    public title: string;
    public offset?: string;
    public timeType?: string;
    public timeTypeFull?: string;
}

class NewOrganizationPanelController implements ng.IController {
    public $onInit() { }
    public organization: Organization;
    public onSave: (param: NewOrganizationParams) => void;
    public ngDisabled: () => boolean;

    public form: any;
    public touchedErrorsWithHint: Function;

    // information step
    private organizationCenter: any = null;
    private isCircle: boolean = false;
    public mapOptions: any = {};
    public organizationOverlay: any = {};
    public startPause: boolean = true;
    public debouncedOnEdit: (overlay, type, path, center, radius) => void;
    public section: any;
    public sections: any[] = [
        {
            title: 'Pan',
            type: 'pan',
            id: 0
        }, {
            title: 'CENTER',
            type: 'center',
            id: 1
        }
    ];
    public zones: TimeZoneItem[];
    private _mapControl: any;

    constructor(
        private $element: JQuery,
        private $state: ng.ui.IStateService,
        private $timeout: ng.ITimeoutService,
        private $scope: ng.IScope,
        public pipMedia: pip.layouts.IMediaService,
        private pipFormErrors: pip.errors.IFormErrorsService,
        private pipTips: pip.guidance.ITipsService,
        private pipPopoverService: pip.controls.IPopoverService,
        private pipTranslate: pip.services.ITranslateService,
        private iqsMapConfig: IMapService,
    ) {
        "ngInject";

        $element.addClass('iqs-new-organization-panel');

        this.touchedErrorsWithHint = pipFormErrors.touchedErrorsWithHint;
    }

    // prepare timezone
    private fillZone() {
        let zones: string[];
        zones = moment.tz.names();
        this.zones = [];

        _.each(zones, (zone: string) => {
            let key: string = zone;
            let offset: string = moment.tz(zone).format('Z');
            let timeType: string = moment.tz(zone).format('z');
            let timeTypeFull: string = moment.tz(zone).format('zz');
            let title: string = zone;
            if (offset) {
                title += ' (' + offset + ')';
            }
            let tzItem: TimeZoneItem = <TimeZoneItem>{
                name: zone,
                offset: offset,
                timeType: timeType,
                timeTypeFull: timeTypeFull,
                title: title
            };
            this.zones.push(tzItem);
        });

        this.zones = _.sortBy(this.zones, (obj: TimeZoneItem) => {
            return obj.offset;
        });
    }

    private prepare() {
        if (!this.organization) {
            this.organization = <Organization>{};
        }

        if (!this.organization.center || !this.organization.center.type) {
            this.organization.center = { type: 'Point', coordinates: [0, 0] }
        }
        this.debouncedOnEdit = _.debounce((overlay, type, path, center, radius) => {
            this.onEdit(overlay, type, path, center, radius);
        }, 500);

        this.mapOptions = angular.extend(this.iqsMapConfig.organizationConfigs, {
            center: this.organization.center.coordinates.length > 0 ? {
                latitude: this.organization.center.coordinates[1],
                longitude: this.organization.center.coordinates[0]
            } : {
                    latitude: 0,
                    longitude: 0
                },
            zoom: 2,
            map: {
                mapTypeId: 'hybrid'
            }
        });

        this.section = 0;
        this.fillZone();

        this.$timeout(() => {
            this.startPause = false;
            this.toCenter();
            this.form = this.$scope.form;
        }, 1000);
    }

    public onChangeOrganization() {
        if (this.organization.center.coordinates[0] !== null && this.organization.center.coordinates[0] !== undefined &&
            this.organization.center.coordinates[1] !== null && this.organization.center.coordinates[1] !== undefined &&
            this.organization.radius) {

            this.isCircle = true;
            this.$timeout(() => {
                this.organizationCenter = {
                    latitude: this.organization.center.coordinates[1],
                    longitude: this.organization.center.coordinates[0]
                }
                this.setOverlay();
            }, 0)
        }
    }

    public onEdit(overlay, type, path, center, radius) {
        if (!this.isCircle) return;
        if (center.lat) {
            this.$timeout(() => {
                this.organization.center.coordinates[0] = center.lng();
                this.organization.center.coordinates[1] = center.lat();
                this.organization.radius = radius / 1000;

                this.organizationCenter = {
                    latitude: this.organization.center.coordinates[1],
                    longitude: this.organization.center.coordinates[0]
                }
                this.setOverlay();
            }, 0)
        }
    }

    public showMapTip($event): void {
        this.pipPopoverService.show({
            class: 'pip-tip',
            element: $event.currentTarget,
            locals: {
                title: this.pipTranslate.translate('SITE_CREATE_TIP_TITLE'),
                content: this.pipTranslate.translate('SITE_CREATE_TIP_DESCRIPTION'),
            },
            cancelCallback: function () {

            },
            controller: function ($scope, $timeout, pipPopoverService) {
                $scope.title = $scope.locals.title;
                $scope.content = $scope.locals.content;
                $scope.image = null;

                $scope.onNextClick = function () {
                    pipPopoverService.hide();
                };

                $timeout(function () {
                    $('.pip-popover').find('.pip-pic').css('background-image', 'url(' + $scope.image + ')');
                }, 200);
            },
            templateUrl: 'organizations/include/TipTemplate.html'
        });

    }

    private setOrganizationCenter() {
        this.organizationCenter = _.cloneDeep(this.mapOptions.center);
    }

    public toCenter() {
        if (this._mapControl) this._mapControl.map.control.getGMap().panTo(new google.maps.LatLng(
            this.organizationCenter.latitude,
            this.organizationCenter.longitude
        ));
    }

    public setControl(control) {
        this._mapControl = control;
    }

    public clearMap() {
        this.isCircle = false;
        this._mapControl.clearMap();
        this.changeType('pan');
        this.section = 0;
        this.organizationCenter = null;
    }

    private changeType(type) {
        if (!this._mapControl) return;

        switch (type) {
            case 'center':
                this.isCircle = true;
                this._mapControl.addCircle();
                break;
            case 'pan':
                this.isCircle = false;
                this._mapControl.drawingManagerOptions.drawingMode = null;
                break;
        }
    }

    public selectSection(sectionIndex) {
        this.section = sectionIndex;
        const section = this.sections[this.section];

        this.$timeout(() => {
            this.changeType(this.sections[this.section].type);
        }, 100);
    }

    private setOverlay() {
        this.section = 0;
        this.organizationOverlay = {
            type: 'circle',
            center: _.cloneDeep(this.organization.center),
            distance: this.organization.radius * 1000
        };
    }

    public onZoomIn() {
        if (!this._mapControl) return;

        const curZ = this._mapControl.map.control.getGMap().getZoom() + 1;
        this._mapControl.map.control.getGMap().setZoom(curZ);
    }

    public onZoomOut() {
        if (!this._mapControl) return;

        const curZ = this._mapControl.map.control.getGMap().getZoom() - 1;
        this._mapControl.map.control.getGMap().setZoom(curZ);
    }

    public isFillOrganization(): boolean {
        let f: boolean = false;
        f = this.organization && !!this.organization.name &&
            this.organization.center.coordinates[0] !== null && this.organization.center.coordinates[1] !== null &&
            this.organization.center.coordinates[0] !== undefined && this.organization.center.coordinates[1] !== undefined &&
            !!this.organization.radius && !!this.organization.timezone;

        return !f;
    }

    public $onChanges(changes: NewOrganizationPanelChanges): void {
        this.prepare();
    }

    public next(): void {
        if (this.form.$invalid) return;

        if (this.onSave) {
            this.onSave({ organization: this.organization });
        }
    }

    public onBack() {
        this.$state.go('organizations.home');
    }
}

(() => {
    angular
        .module('iqsNewOrganizationPanel', [])
        .component('iqsNewOrganizationPanel', {
            bindings: NewOrganizationPanelBindings,
            // templateUrl: 'states/organizations/organization/panels/NewOrganizationPanel.html',
            controller: NewOrganizationPanelController,
            controllerAs: '$ctrl',
            template: `
                <pip-card>
                    <div class="pip-body">
                        <form name="form" novalidate>

                            <h2 class="text-center bm24">{{:: 'SITES_CREATE_TITLE' | translate}}</h2>

                            <md-input-container class="hide-md-errors-spacer">
                                <label>{{::'SITES_CREATE_NAME' | translate}}</label>
                                <input iqs-test-name ng-model="$ctrl.organization.name" required />
                                <!-- todo verficate form -->
                            </md-input-container>

                            <div class="flex bm8">
                                {{ ::'SITES_CREATE_MAP_DESCRIPTION' | translate }}
                                <span class="text-body2 text-overflow color-primary pointer" ng-click="$ctrl.showMapTip($event)">
                                    {{ ::'SITES_CREATE_MAP_DESCRIPTION_LINK' | translate }}
                                </span>
                            </div>
                            <div iqs-test-map class="flex" style="position: relative; min-height: 350px">
                                <pip-map-edit ng-if="$ctrl.mapOptions && !$ctrl.startPause" pip-on-edit="$ctrl.onEdit(overlay, type, path, center, radius)"
                                              pip-show-action-panel="false" pip-overlay="$ctrl.organizationOverlay" pip-map-options="$ctrl.mapOptions"
                                              pip-control="$ctrl.setControl(control)">
                                </pip-map-edit>


                                <div class="iqs-map-edit-zoom-buttons layout-column">
                                    <md-button aria-label="ZoomIn" ng-click="$ctrl.onZoomIn()" class="md-fab md-raised md-mini m8">
                                        <md-tooltip md-visible="showTooltip" md-direction="left">
                                            {{ ::'ZONE_ZOOM_IN' | translate }}
                                        </md-tooltip>
                                        <md-icon md-svg-icon="icons:plus" aria-label="ZoomIn"></md-icon>
                                    </md-button>
                                    <md-button aria-label="ZoomOut" ng-click="$ctrl.onZoomOut()" class="md-fab md-raised md-mini m8">
                                        <md-tooltip md-visible="showTooltip" md-direction="left">
                                            {{ ::'ZONE_ZOOM_OUT' | translate }}
                                        </md-tooltip>
                                        <md-icon md-svg-icon="icons:minus" aria-label="ZoomOut"></md-icon>
                                    </md-button>
                                </div>

                                <div class="iqs-map-edit-overlay-buttons layout-column">
                                    <md-button aria-label="PAN" ng-click="$ctrl.selectSection(0)" ng-class="{'md-accent': $ctrl.section === 0 }"
                                               class="md-fab md-raised md-mini m8">
                                        <md-tooltip md-visible="showTooltip" md-direction="right">
                                            {{ 'ZONE_PAN' | translate }}
                                        </md-tooltip>
                                        <md-icon md-svg-icon="iqs:draw-pan" aria-label="Pan"></md-icon>
                                    </md-button>
                                    <md-button iqs-test-map-add-center aria-label="DrawCircle" ng-click="$ctrl.selectSection(1)"
                                               ng-class="{'md-accent': $ctrl.section === 1 }" class="md-fab md-raised md-mini m8">
                                        <md-tooltip md-visible="showTooltip" md-direction="right">
                                            {{ 'ADD_CENTER' | translate }}
                                        </md-tooltip>
                                        <md-icon md-svg-icon="icons:pen" aria-label="DrawCircle"></md-icon>
                                    </md-button>
                                </div>

                                <div class="iqs-map-edit-clear-buttons layout-column">
                                    <md-button iqs-test-map-clear aria-label="ClearMap" ng-click="$ctrl.clearMap()" class="md-fab md-raised md-mini m8">
                                        <md-tooltip md-visible="showTooltip" md-direction="right">
                                            {{::'ZONE_CLEAR_MAP' | translate }}
                                        </md-tooltip>
                                        <md-icon md-svg-icon="iqs:draw-clear" aria-label="ClearMap"></md-icon>
                                    </md-button>
                                </div>

                                <!-- <div class="iqs-map-edit-center-buttons layout-column" ng-if="$ctrl.mapOptions && $ctrl.organization.center.coordinates[0] && $ctrl.organization.center.coordinates[1]">
                                    <md-button aria-label="ClearMap" ng-click="$ctrl.setOverlay()" class="md-fab md-raised md-mini m8">
                                        <md-tooltip md-visible="showTooltip" md-direction="left">
                                            {{:: 'REDRAW' | translate }}
                                        </md-tooltip>
                                        <md-icon md-svg-icon="icons:reload" aria-label="ClearMap"></md-icon>
                                    </md-button>
                                </div> -->
                            </div>



                            <div class="layout-row hide-md-errors-spacer tm8 bm8">
                                <md-input-container class="md-block  bm0 rm16 flex">
                                    <label>{{::'GLOBAL_SETTINGS_LOCATION_LONGITUDE' | translate}}</label>
                                    <input iqs-test-longtitude ng-model="$ctrl.organization.center.coordinates[0]" type="number" ng-change="$ctrl.onChangeOrganization()">
                                </md-input-container>
                                <md-input-container class="md-block bm0 flex">
                                    <label>{{::'GLOBAL_SETTINGS_LOCATION_LATTITUDE' | translate}}</label>
                                    <input iqs-test-latitude ng-model="$ctrl.organization.center.coordinates[1]" type="number" ng-change="$ctrl.onChangeOrganization()">
                                </md-input-container>
                            </div>
                            <div class="layout-row hide-md-errors-spacer bm16">
                                <md-input-container class="md-block rm16 bm8 flex">
                                    <label>{{::'GLOBAL_SETTINGS_LOCATION_DISTANSE' | translate}}</label>
                                    <input iqs-test-radius ng-model="$ctrl.organization.radius" type="number" ng-change="$ctrl.onChangeOrganization()">
                                </md-input-container>
                                <md-input-container class="md-block flex bm8 hide-md-errors-spacer iqs-timezone-select">
                                    <label>{{::'GLOBAL_SETTINGS_LOCATION_TIMEZONE'| translate}}</label>
                                    <md-select iqs-test-timezone-select ng-model="$ctrl.organization.timezone">
                                        <md-option iqs-test-timezone-option ng-repeat="obj in $ctrl.zones track by $index" ng-value="obj.name">
                                            {{ ::obj.title }}
                                        </md-option>
                                    </md-select>
                                </md-input-container>
                            </div>


                            <div ng-if="!$ctrl.pipMedia('gt-sm')">
                                <md-button iqs-test-cancel class="md-primary md-raised w-stretch flex lm0 rm0 tm16" ng-disabled="$ctrl.transaction.busy()"
                                           ng-click="$ctrl.onBack()">
                                    {{ ::'SITES_CREATE_BACK' | translate }}
                                </md-button>
                                <md-button iqs-test-next class="md-primary md-raised w-stretch flex lm0 rm0 bm0" ng-disabled="$ctrl.isFillOrganization() || $ctrl.transaction.busy()"
                                           ng-click="$ctrl.next()">
                                    {{ ::'SITES_CREATE_FORVARD' | translate }}
                                </md-button>
                            </div>
                            <div class="layout-row layout-align-start-center tm16" ng-if="$ctrl.pipMedia('gt-sm')">
                                <md-button iqs-test-cancel class="md-primary md-raised w-stretch flex lm0 rm8 bm0" ng-disabled="$ctrl.transaction.busy()"
                                           ng-click="$ctrl.onBack()">
                                    {{ ::'SITES_CREATE_BACK' | translate }}
                                </md-button>
                                <md-button iqs-test-next class="md-primary md-raised w-stretch flex lm8 rm0 bm0" ng-disabled="$ctrl.isFillOrganization() || $ctrl.transaction.busy()"
                                           ng-click="$ctrl.next()">
                                    {{ ::'SITES_CREATE_FORVARD' | translate }}
                                </md-button>
                            </div>
                        </form>
                    </div>
                </pip-card>
            `
        })
})();
