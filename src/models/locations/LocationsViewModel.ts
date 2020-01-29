import { Location, ILocationsDataService } from '../../data';
import { ILocationsViewModel } from './ILocationsViewModel';
import { LocationsModel } from './LocationsModel';
import { IOrganizationService } from '../../services';

class LocationsViewModel implements ILocationsViewModel {
    private _filter: any;
    private locationsModel: LocationsModel;

    constructor(
        $log: ng.ILogService,
        $location: ng.ILocationService,
        pipTransaction: pip.services.ITransactionService,
        iqsOrganization: IOrganizationService,
        iqsLocationsData: ILocationsDataService
    ) {
        "ngInject";

        this._filter = null;
        this.locationsModel = new LocationsModel($log, $location, pipTransaction, iqsOrganization, iqsLocationsData);
    }

    public read(successCallback?: (data: Location[]) => void, errorCallback?: (error: any) => void) {
        this.locationsModel.filter = this._filter;
        this.locationsModel.read(successCallback, errorCallback);
    }

    public reload(successCallback?: (data: Location[]) => void, errorCallback?: (error: any) => void): void {
        this.locationsModel.filter = this._filter;
        this.locationsModel.reload(successCallback, errorCallback);
    }

    public getCollection(localSearch?: string): Location[] {
        return this.locationsModel.get(localSearch);
    }

    public getTransaction(): pip.services.Transaction {
        return this.locationsModel.getTransaction();
    }

    public get isSort(): boolean {
        return this.locationsModel.isSort;
    }

    public set isSort(value: boolean) {
        if (!!value) {
            this.locationsModel.isSort = value;
        }
    }

    public set filter(value: any) {
        this._filter = value;
    }

    public get filter(): any {
        return this._filter;
    }

    public get state(): string {
        return this.locationsModel.state;
    }

    public set state(value: string) {
        this.locationsModel.state = value;
    }

    public selectItem(index?: number) {
        this.locationsModel.selectItem(index);
    }

    public getSelectedItem(): Location {
        return this.locationsModel.getSelectedItem();
    }

    public get searchedCollection(): string[] {
        return this.locationsModel.getSearchedCollection();
    }

    public get selectedIndex(): number {
        return this.locationsModel.getSelectedIndex();
    }

    public set selectedIndex(index: number) {
        this.locationsModel.selectItem(index);
    }

    public removeItem(id: string, successCallback) {
        this.locationsModel.delete(id, successCallback);
    }

    public create(Location: Location, successCallback?: (data: Location) => void, errorCallback?: (error: any) => void): void {
        this.locationsModel.create(Location, successCallback, errorCallback);
    }

    public deleteLocationById(id: string, successCallback?: () => void, errorCallback?: (error: any) => void): void {
        this.locationsModel.delete(id, successCallback, errorCallback);
    }

    public updateLocationById(id: string, Location: Location, successCallback?: (data: Location) => void, errorCallback?: (error: any) => void): void {
        this.locationsModel.update(id, Location, successCallback, errorCallback);
    }

    public getLocationById(locationId: string): Location {
        return this.locationsModel.getLocationById(locationId);
    }

    public clean(): void {
        this.locationsModel.clean();
    }       
}


angular.module('iqsLocations.ViewModel', ['iqsLocations.Data'])
    .service('iqsLocationsViewModel', LocationsViewModel);

