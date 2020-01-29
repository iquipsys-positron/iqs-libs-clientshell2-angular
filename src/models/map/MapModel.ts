
import {
    IControlObjectsDataService,
    ICurrentObjectStatesDataService
} from '../../data';
import { States } from '../../common/States';
import {
    IMapService,
    MapConfigs
} from '../../services';

export const UPDATE_MAP_MODEL_CENTER: string = 'iqsUpdateMapModelCenter';

class MapCenter {
    public latitude: number;
    public longitude: number;
}

class MapStates extends States {
    public static EmptyMap: string = 'empty_map';
}

export class MapModel {
    private _configs: MapConfigs;
    public state: string;
    private cf: Function[] = [];

    constructor(
        private iqsMapConfig: IMapService,
        $rootScope: ng.IRootScopeService,
        $timeout: ng.ITimeoutService
    ) {
        "ngInject";

        this.cf.push($rootScope.$on(UPDATE_MAP_MODEL_CENTER, (info, newCenter) => {
            // hak this.justResized in MapComponentCtrl 

            // define current orgId
            let orgId = this.iqsMapConfig.orgId;

            $timeout(() => {
                if (orgId != this.iqsMapConfig.orgId) return;

                // organization not changed
                this.setCenter(null);
            }, 500);
            $timeout(() => {
                if (orgId != this.iqsMapConfig.orgId) return;

                // organization not changed
                let center: MapCenter = new MapCenter;
                if (newCenter) {
                    center.latitude = Number(newCenter.latitude) != NaN ? Number(newCenter.latitude) : null;
                    center.longitude = Number(newCenter.longitude) != NaN ? Number(newCenter.longitude) : null;
                } else {
                    center = this.configs.center;
                }
                this.setCenter(center);
            }, 1000);
        }));
    }

    public $onDestroy(): void {
        for (const f of this.cf) { f(); }
    }

    public init(successCallback?: () => void, errorCallback?: (error: any) => void) {
        this.state = MapStates.Progress;
        this.getMapConfigs(
            () => {
                this.state = MapStates.Data;
                if (successCallback) successCallback();
            },
            (error) => {
                this.state = MapStates.EmptyMap;
                if (errorCallback) errorCallback(error);
            });
    }

    private getMapConfigs(successCallback: (configs: MapConfigs) => void, errorCallback: (error: any) => void) {
        // Get from data service
        this.iqsMapConfig.get(
            (configs) => {
                this._configs = configs;
                this._configs.control = {};
                if (!_.isEmpty(this.configs.center) && this.configs.zoom) {
                    if (successCallback) {
                        successCallback(this.configs);
                    }
                } else {
                    if (errorCallback) {
                        errorCallback('no center and zoom configurations');
                    }
                }
            });
    }

    public zoomIn() {
        if (this._configs.control.getGMap) {
            const curZ = this._configs.control.getGMap().getZoom();
            this._configs.control.getGMap().setZoom(curZ + 1);
        }

        this.setZoom(this.iqsMapConfig.zoom + 1);
    }

    public zoomOut() {
        if (this._configs.control.getGMap) {
            const curZ = this._configs.control.getGMap().getZoom();
            this._configs.control.getGMap().setZoom(curZ - 1);
        }

        this.setZoom(this.iqsMapConfig.zoom - 1);
    }

    public setCenter(center) {
        if (!center || !this._configs.center || 
            this._configs.center.latitude != center.latitude ||  this._configs.center.longitude != center.longitude) {
                let config = _.cloneDeep(this._configs);
                config.center = center;
                this._configs = config;
            }
    }

    public setZoom(zoom) {
        this._configs.zoom = zoom;
    }

    public get configs(): MapConfigs {
        return this._configs;
    }

    public get organizationConfigs(): MapConfigs {
        return this.iqsMapConfig.organizationConfigs;
    }

    public get organizationCenter(): any {
        return this.iqsMapConfig.organizationCenter;
    }

    public set configs(configs: MapConfigs) {
        this._configs = configs;
    }
}