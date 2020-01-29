import { ObjectState } from "../../data";
import { SearchResult } from '../../services';

export interface ICurrentObjectStatesViewModel {
    initCurrentObjectStates(filter?: string, successCallback?: (data: ObjectState[]) => void, errorCallback?: (error: any) => void);
    filterCurrentObjectStates(filter: string);
    updateCurrentObjectStates(): void;
    readOne(id: string, successCallback?: (data: ObjectState) => void, errorCallback?: (error: any) => void): angular.IPromise<any>;
    highlightCurrentObjectStatesByObjectsName(filter: string): void;
    filterCurrentObjectStatesObjectsSearch(objects: SearchResult[], showUnknown?: boolean);
    focusByDeviceId(id: string, updateCenter?: boolean, alwaysShow?: boolean, isRetro?: boolean): void;
    selectByDeviceIds(ids: string[]): void;
    selectByObjectIds(ids: string[]): void;
    findByDevice(id: string);
    unfocusAll(onlyAutoFocus?: boolean): void;
    unselectAll(): void;
    selectIndex();
    statusObject(object: ObjectState): string;
    getCurrentObjectStateByObjectId(id: string): ObjectState;
    getCurrentObjectStateByDeviceId(id: string): ObjectState;
    getActiveByCategory(category): number;
    getInactiveByCategory(category): number;
    isActive(state): boolean;
    isInCurrentRosters(state): boolean;
    isOnMapByDeviceId(device_id): boolean;
    // reReadRosters(): void;
    cancelFiltered(): void;
    isFocused: string;
    isSelected: boolean;
    state: string;
    CurrentObjectStates: ObjectState[];
    allCurrentObjectStates: ObjectState[];
    selectedIndex: number;
    isSort: boolean;
    clean(): void;
}