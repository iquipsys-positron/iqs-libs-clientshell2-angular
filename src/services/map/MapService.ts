declare var google: any;

import {
    IOrganizationsDataService,
    Organization
} from '../../data';
import { IMapService, MapConfigs, EmbededMap } from './IMapService';
import {
    ISmartZoomService,
    IOrganizationService,
    OrganizationChangedEvent
} from '../';

export let GET_SITE_MAP_CONFIGS: string = 'iqsGetOrganizationMapConfigurations';

class MapService implements IMapService {
    private MAP_TYPE = 'hybrid';
    private strokeColor: string = '#F8E81C';
    private strokeWeight: number = 3;
    private _orgId: string;
    private _polylineOptions: any = {
        stroke: {
            color: this.strokeColor,
            weight: this.strokeWeight
        },
        icons: true
    };
    public centerChangeCallbacks: Function[] = [];
    public zoomChangeCallbacks: Function[] = [];

    public zoom: number = null;
    public center: any = null;
    private isWatching: boolean = false;
    private embededMap: EmbededMap = null;

    private defaultEvents: any = {
        'zoom_changed': (event) => {
            if (!event || this.orgId != event.mapId) {

                return;
            }
            this.iqsSmartZoom.updateZoomLevel(event.zoom);
            this.updateZoomOrCenter(event);
            this.onZoomChanged(event.zoom);
            this.updateLabel();
        },
        'center_changed': (event, id?: string) => {
            if (!event || this.orgId != event.mapId) {

                return;
            }

            this.updateZoomOrCenter(event);
            _.each(this.centerChangeCallbacks, (callback) => {
                callback(this.center);
            });
        }
    };

    public _organizationConfigs: MapConfigs = {
        map: {
            mapTypeId: this.MAP_TYPE
        },
        zoom: null,
        center: null,
        events: this.defaultEvents,
        embededMap: null,
        mapId: null
    };

    public organizationCenter: any;

    public constructor(
        private iqsOrganizationsData: IOrganizationsDataService,
        private iqsSmartZoom: ISmartZoomService,
        private iqsOrganization: IOrganizationService,
        private pipIdentity: pip.services.IIdentityService,
        private $rootScope: ng.IRootScopeService,
        private pipPictureData: pip.pictures.IPictureDataService
    ) {

        this.getConfigsFromOrganization();

        this.iqsSmartZoom.addLevelChangedCallback((zoomLevel) => {
            this._polylineOptions.icons = zoomLevel === 'small';
        });
    }

    public get organizationConfigs(): MapConfigs {
        return this._organizationConfigs;
    }

    public set organizationConfigs(value: MapConfigs) {
        this._organizationConfigs = value;
    }

    public addCenterChangeCallback(callback: Function) {
        this.centerChangeCallbacks.push(callback);
    }

    public addZoomChangeCallback(callback: Function) {
        this.zoomChangeCallbacks.push(callback);
    }

    public get(callback?: (configs?: MapConfigs) => void): MapConfigs {
        if (callback) {
            if (this.zoom && this.center) {
                callback({
                    map: {
                        mapTypeId: this.MAP_TYPE
                    },
                    center: this.center,
                    zoom: this.zoom,
                    events: this.defaultEvents,
                    embededMap: this.embededMap,
                    mapId: this.orgId
                });
            } else {
                this.getConfigsFromOrganization(callback);
            }
        }

        return {
            map: {
                mapTypeId: this.MAP_TYPE
            },
            zoom: this.zoom,
            center: this.center,
            events: this.defaultEvents,
            embededMap: this.embededMap,
            mapId: this.orgId
        };
    }

    private onZoomChanged(zoom) {
        _.each(this.zoomChangeCallbacks, (callback) => {
            callback(zoom);
        });
    }

    public addEvent(eventName: string, eventCallback: any) {
        this.defaultEvents[eventName] = (event) => {
            eventCallback(event);
        }
    }

    public removeEvent(eventName: string) {
        delete this.defaultEvents[eventName];
    }

    private updateZoomOrCenter(event, id?: string) {
        if (this.isWatching === false) {
            return;
        }
        let latitude = event.center.lat();
        let longitude = event.center.lng();
        this.zoom = event.zoom;

        if (Math.abs(latitude) > 180 || Math.abs(longitude) > 180) {

            return;
        }
        this.center = {
            latitude: event.center.lat(),
            longitude: event.center.lng()
        };
    }

    public watchDragAndZoom() {
        this.isWatching = true;
    }

    public unwatchDragAndZoom() {
        this.isWatching = false;
    }

    public radiusToZoom(radius: number) {
        return Math.round(15 - Math.log(radius) / Math.LN2);
    }

    public setCenter(center: any) {
        if (center.latitude != undefined && center.longitude != undefined) {
            this.center = center;
        }
    }

    public get polylineOptions(): any {
        return this._polylineOptions;
    }

    public get orgId(): string {
        return this._orgId;
    }

    public set orgId(value: string) {
        this._orgId = value;
    }

    private isOrganizationCenter(data): boolean {
        return data && data.center && data.center.coordinates && data.center.coordinates[1] && data.center.coordinates[0];
    }

    private setOrganizationCenter(data) {
        if (this.orgId != this.iqsOrganization.orgId) {

            return;
        }
        if (!this.isOrganizationCenter(data)) {
            this.organizationCenter = {};

            return;
        }

        let center = {
            latitude: data.center.coordinates[1],
            longitude: data.center.coordinates[0],
            options: {
                labelContent: this.shortLabel(data.name),
                labelClass: 'unselected-marker-label medium text-overflow',
                labelAnchor: '42 -10',
                labelStyle: { opacity: 0 }
            },
            icon: {
                url: 'images/MapIcons/Organization center.svg',
                scaledSize: new google.maps.Size(12, 12),
                anchor: new google.maps.Point(6, 6),
            }
        };

        this.organizationCenter = center;
    }

    private updateLabel() {
        this.organizationCenter.options.labelStyle = { opacity: this.getLabelOpacity() };
    }

    private getLabelOpacity() {
        return this.iqsSmartZoom.zoomLevel !== this.iqsSmartZoom.smartZoomLevels.large.name ? 0 : 1;
    }

    private shortLabel(label: string) {
        return label.length > 35 ? label.substr(0, 35) + '...' : label;
    }

    public getConfigsFromOrganization(callback?: (configs?: MapConfigs) => void, zoom?: number): void {
        if (!this.pipIdentity.identity || !this.pipIdentity.identity.id || !this.orgId) {
            return
        }
        this.iqsOrganizationsData.readOrganization(
            this.orgId,
            (data: Organization) => {
                this.center = this.isOrganizationCenter(data) ? {
                    latitude: data.center.coordinates[1],
                    longitude: data.center.coordinates[0]
                } : {};
                let organizationConfigs: MapConfigs = new MapConfigs();
                let embededMap: EmbededMap = new EmbededMap()

                organizationConfigs.center = _.cloneDeep(this.center);
                if (!zoom || !this.zoom) {
                    this.zoom = data && data.radius ? this.radiusToZoom(data.radius) : this.radiusToZoom(1);
                } else {
                    this.zoom = zoom;
                }
                organizationConfigs.zoom = zoom;

                this.iqsSmartZoom.updateZoomLevel(this.zoom);
                this.setOrganizationCenter(data);

                if (data.map_id && _.isNumber(data.map_north) && _.isNumber(data.map_east) && _.isNumber(data.map_south) && _.isNumber(data.map_west)) {
                    embededMap.embededSrc = this.pipPictureData.getPictureUrl(data.map_id);
                    embededMap.map_east = data.map_east;
                    embededMap.map_north = data.map_north;
                    embededMap.map_south = data.map_south;
                    embededMap.map_west = data.map_west;
                    organizationConfigs.embededMap = _.cloneDeep(embededMap);
                }
                organizationConfigs.mapId = this.orgId;
                if (organizationConfigs.map) {
                    organizationConfigs.map.mapTypeId = organizationConfigs.map.mapTypeId ? organizationConfigs.map.mapTypeId : this.MAP_TYPE;
                } else {
                    organizationConfigs.map = {
                        mapTypeId: this.MAP_TYPE
                    };
                }

                this.organizationConfigs = organizationConfigs;
                this.embededMap = embededMap;
                if (callback) callback({
                    map: {
                        mapTypeId: this.MAP_TYPE
                    },
                    center: this.center,
                    zoom: this.zoom,
                    events: this.defaultEvents,
                    embededMap: this.embededMap,
                    mapId: this.orgId
                });
            });
    }

    public clean() {
        this.zoom = null;
        this.center = null;
        this.embededMap = null;
        this.orgId = null;
    }
}

angular
    .module('iqsMapConfig', [])
    .service('iqsMapConfig', MapService);