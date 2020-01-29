import { Location } from '../../data';

export interface ILocationsViewModel {
    state: string;
    isSort: boolean;
    filter: any;
    selectedIndex: number;
    searchedCollection: string[];

    read(successCallback?: (data: Location[]) => void, errorCallback?: (error: any) => void);
    reload(successCallback?: (data: Location[]) => void, errorCallback?: (error: any) => void): void;
    getCollection(localSearch?: string): Location[];
    getTransaction(): pip.services.Transaction;
    selectItem(index?: number): void;
    getSelectedItem(): Location;
    removeItem(id: string, successCallback): void;
    create(Location: Location, successCallback?: (data: Location) => void, errorCallback?: (error: any) => void): void;
    deleteLocationById(id: string, successCallback?: () => void, errorCallback?: (error: any) => void): void;
    updateLocationById(id: string, Location: Location, successCallback?: (data: Location) => void, errorCallback?: (error: any) => void): void;
    getLocationById(locationId: string): Location;
    clean(): void;
}

