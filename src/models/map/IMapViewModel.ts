import { MapModel } from './MapModel'
import {
    ControlObject,
    ObjectState,
    Zone
} from '../../data';

export interface IMapViewModel {
    map: MapModel;
    initMap(successCallback?: () => void, errorCallback?: (error: any) => void): void;
    initObjects(): void;
    initStates(): void;
    highlightStatesByName(filter: string): void;
    focusByDeviceId(id: string): void;
    selectByDeviceIds(ids: string[]): void;
    selectByObjectIds(ids: string[]): void;
    unfocusAll(): void;
    unselectAll(): void;
    setCenter(center: any): void;
    setZoom(zoom): void;
    zoomOut(): void;
    zoomIn(): void;
    updateObjectsStates(): void;
    getCurrentObjectStateByDeviceId(id: string): ObjectState;
    objects: ControlObject[];
    states: ObjectState[];
    polygons: Zone[];
    lines: Zone[];
    circles: Zone[];
    filteredStates: ObjectState[];
    isFocused: string;
    isSelected: boolean;
    polylinesOptions: any;
    organizationCenter: any;
    getActive(type: string): number;
    getInactive(type: string): number;
    isActive(state): boolean;
}