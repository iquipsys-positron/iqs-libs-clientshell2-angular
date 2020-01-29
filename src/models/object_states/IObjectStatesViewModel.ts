import { ObjectState } from "../../data";
import { SearchResult } from '../../services';

export interface IObjectStatesViewModel {
    initObjectStates(to: string, filter?: string, successCallback?: (data: ObjectState[]) => void, errorCallback?: (error: any) => void);
    filterObjectStates(filter: string);
    updateObjectStates(to: string): void;
    // filterObjectStatesObjects(filter: string);
    highlightObjectStatesByObjectsName(filter: string): void;
    filterObjectStatesObjectsSearch(objects: SearchResult[], showUnknown?: boolean);
    focusByDeviceId(id: string, updateCenter?: boolean, alwaysShow?: boolean, isRetro?: boolean): void;
    selectByDeviceIds(ids: string[]): void;
    selectByObjectIds(ids: string[]): void;
    findByDevice(id: string);
    unfocusAll(): void;
    unselectAll(): void;
    selectIndex();
    statusObject(object: ObjectState): string;
    getObjectStateByObjectId(id: string): ObjectState;
    getObjectStateByDeviceId(id: string): ObjectState;
    getActiveByCategory(category): number;
    getInactiveByCategory(category): number;
    isActive(state): boolean;
    isInCurrentRosters(state): boolean;
    isOnMapByDeviceId(device_id): boolean;
    cancelFiltered(): void;
    clean(): void;
    isFocused: string;
    isSelected: boolean;
    state: string;
    ObjectStates: ObjectState[];
    allObjectStates: ObjectState[];
    selectedIndex: number;
    isSort: boolean;
}