export class MapConfigs {
    map?: any;
    zoom: number;
    center: any;
    events: any;
    draggable?: boolean;
    control?: any;
    // 
    embededMap?: EmbededMap;
    mapId?: string;
}

export class EmbededMap {
    public embededData?: any;
    public embededSrc?: any;
    public map_north?: number;
    public map_south?: number;
    public map_west?: number;
    public map_east?: number;
}

export interface IMapService {
    zoom: number;
    center: any;
    polylineOptions:any;
    organizationConfigs: MapConfigs;
    organizationCenter: any;
    orgId: string;
    get(callback?: (configs?: MapConfigs) => void);
    getConfigsFromOrganization(callback?: (configs?: MapConfigs) => void, zoom?: number): void;
    addEvent(eventName: string, eventCallback: any): void;
    removeEvent(eventName: string): void;
    watchDragAndZoom(): void;
    unwatchDragAndZoom(): void;
    addCenterChangeCallback(callback: Function): void;
    addZoomChangeCallback(callback: Function): void;
    radiusToZoom(radius: number): number;
    clean();
}