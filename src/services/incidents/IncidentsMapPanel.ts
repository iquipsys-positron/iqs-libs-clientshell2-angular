import { IMapService, MapConfigs } from '../map';

interface IIncidentsMapPanelBindings {
    [key: string]: any;
    object: any;
    type: any;
    rebuild: any;
}

const IncidentsMapPanelBindings: IIncidentsMapPanelBindings = {
    object: '<iqsObject',
    type: '<iqsType',
    rebuild: '<?iqsRebuild'
}

class IncidentsMapPanelChanges implements ng.IOnChangesObject, IIncidentsMapPanelBindings {
    [key: string]: ng.IChangesObject<any>;
    object: ng.IChangesObject<any>;
    type: ng.IChangesObject<string>;
    rebuild: ng.IChangesObject<boolean>;
}

class IncidentsMapPanelController implements ng.IController {          public $onInit() {}
    private center: any = {};

    public object: any;
    public type: string;
    public objects: any[];
    public rebuild: boolean;

    public startPause: boolean = true;
    public empty: boolean = false;

    public _configs: any = {
        map: {
            draggable: false,
            scrollwheel: false,
            disableDoubleClickZoom: true
        },
        zoom: 16,
        center: this.center
    }

    private _defaultIconTemplate: any = {
        path: 0,
        scale: 3,
        strokeWeight: 6,
        fillColor: '#fbd93e',
        strokeColor: '#fbd93e'
    };

    constructor(
        $scope: ng.IScope,
        $element: JQuery,
        $timeout: ng.ITimeoutService, 
        private iqsMapConfig: IMapService, 
    ) {
        $element.addClass('flex layout-column layout-align-center-center');
        this.objects = [this.object];
        this.setEmptyState();
        this.focusObject(this.object);
        this.object.icon = this._defaultIconTemplate;
        this.object.id = this.object.id || '0';

        let mapConfig: MapConfigs = this.iqsMapConfig.get();
        this._configs.embededMap = mapConfig.embededMap;
        
        $timeout(() => {
            this.startPause = false;
        }, 100);
    }

    public get configs() {
        return this._configs;
    }

    private focusObject(object) {
        if (!object) return;

        this.center.longitude = object.longitude;
        this.center.latitude = object.latitude;
    }

    public $onChanges(changes: IncidentsMapPanelChanges) {
        let update: boolean = true;
        if (changes.object && changes.object.previousValue && changes.object.currentValue) {
            update = changes.object.currentValue.event_id != changes.object.previousValue.event_id
        }

        if (changes.object && update || this.rebuild !== false && changes.object) {
            this.object = changes.object.currentValue;
            this.setEmptyState();
            this.objects = [changes.object.currentValue];
            this.focusObject(this.object);
            this.object.icon = this._defaultIconTemplate;
            this.object.id = this.object.id || '0';
        }
    }

    public $onDestroy() {
       
    }

    private setEmptyState() {
        this.empty = !this.object || this.object.latitude === null || this.object.longitude === null || this.object.latitude === undefined || this.object.longitude === undefined;
    }

}

(() => {
    angular
        .module('iqsIncidents.Panel.Map', [])
        .component('iqsIncidentsMapPanel', {
            bindings: IncidentsMapPanelBindings,
            // templateUrl: 'incidents/panels/IncidentsMapPanel.html',
            controller: IncidentsMapPanelController,
            controllerAs: '$ctrl',
            template: `
                <pip-map pip-options="$ctrl.configs" ng-if="!$ctrl.startPause && !$ctrl.empty">
                <!-- Incident points -->
                    <pip-map-markers pip-models="$ctrl.objects"></pip-map-markers>
                </pip-map>

                <div class="pip-empty" ng-if="$ctrl.empty">
                    <img src="images/EmptyState.svg" class="pip-pic">
                    <div class="pip-text">
                        {{ ::'NO_COORDINATES' | translate }}
                    </div>
                </div>
            `
        })

})();
