import { Zone } from '../../data';

export interface IZonesViewModel {
    state: string;
    isSort: boolean;
    filter: any;
    selectedIndex: number;
    searchedCollection: string[];

    zones: Zone[];
    polygons: Zone[];
    lines: Zone[];
    circles: Zone[];
    objects: Zone[];
    notObjects: Zone[];

    zonesCategory: string;

    mapZones: Zone[];
    mapLines: Zone[];
    mapCircles: Zone[];
    mapPolygons: Zone[];
    mapObjects: Zone[];

    read(successCallback?: (data: Zone[]) => void, errorCallback?: (error: any) => void);
    reload(successCallback?: (data: Zone[]) => void, errorCallback?: (error: any) => void): void;
    getCollection(localSearch?: string): Zone[];
    getTransaction(): pip.services.Transaction;
    selectItem(index?: number): void;
    getSelectedItem(): Zone;

    removeItem(id: string): void;
    saveZone(Zone: Zone, successCallback?: (data: Zone) => void, errorCallback?: (error: any) => void): void;
    deleteZone(cause: string | Zone, successCallback?: () => void, errorCallback?: (error: any) => void): void;
    updateZone(id: string, Zone: Zone, successCallback?: (data: Zone) => void, errorCallback?: (error: any) => void): void;

    getZoneById(zoneId: string): Zone;
    clean(): void;
}
