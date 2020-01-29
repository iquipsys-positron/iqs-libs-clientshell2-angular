import { Location, DataPage, ILocationsDataService } from '../../data';
import { States } from '../../common/States';
import { IOrganizationService } from '../../services';

export class LocationsModel {
    private _state: string;
    private _isSort: boolean;
    private _filter: any;

    private locations: Location[];
    private selectIndex: number;
    private selectedItem: Location;
    private transaction: pip.services.Transaction;
    private locationsFiltered: Location[];
    private searchedCollection: string[];
    private localSearch: string = null;

    constructor(
        private $log: ng.ILogService,
        private $location: ng.ILocationService,
        private pipTransaction: pip.services.ITransactionService,
        private iqsOrganization: IOrganizationService,
        private iqsLocationsData: ILocationsDataService
    ) {
        "ngInject";
        this.transaction = this.pipTransaction.create('LOCATION');
        this.locations = [];
        this.searchedCollection = [];
    }

    // private operation
    private updateItemInCollection(item: Location): void {
        let index: number = _.findIndex(this.locations, (ev) => {
            return ev.id == item.id;
        });

        // insert event without sort
        if (index > -1) {
            let sortNeed: boolean = item.name != this.locations[index].name;
            this.locations[index] = item;
            if (this.isSort && sortNeed) {
                this.sortCollection(this.locations);
            }
            if (this.selectedItem) {
                if (this.selectedItem.id != item.id) {
                    this.selectItem(0);
                }
            } else {
                this.selectItem(index);
            }
        } else {
            if (this._isSort) {
                index = _.findIndex(this.locations, (ev: Location) => {
                    return ev.name.toLocaleLowerCase() > item.name.toLocaleLowerCase();
                });
                if (index > -1) {
                    this.locations.splice(index, 0, item);
                } else {
                    this.locations.push(item);
                }
            } else {
                this.locations.unshift(item);
            }
            // let search: string = this.localSearch;
            this.localSearch = '';

            this.getFiltered(this.localSearch);
            index = _.findIndex(this.locationsFiltered, (l) => {
                return l.id == item.id;
            });
            this.selectItem(index);
        }

        this.collectionChanged();
    }

    private collectionChanged() {
        this.setState();
        // this.$timeout(() => {
        //     this.setState();
        // }, 0);
    }

    private setState() {
        this.state = (this.locationsFiltered && this.locationsFiltered.length > 0) ? States.Data : States.Empty;
    }

    private prepareSearchedCollection() {
        this.searchedCollection = [];
        _.each(this.locations, (item: Location) => {
            this.searchedCollection.push(item.name.toLocaleLowerCase());
        });
    }

    private sortCollection(data: Location[]): void {
        this.locations = _.sortBy(data, function (item: Location) {
            return item.name.toLocaleLowerCase();
        });
    }

    private onRead(data: Location[], callback?: (data: Location[]) => void): void {
        let index: number;
        if (data && data.length > 0) {
            if (this.isSort) {
                this.sortCollection(data);
            } else {
                this.locations = data;
            }
            index = _.findIndex(this.locations, (item: Location) => {
                return item.id == this.$location.search()['location_id'];
            });
            index = index > -1 ? index : 0;
        } else {
            this.locations = [];
            this.searchedCollection = [];
            index = -1;
        }
        if (!this.localSearch) {
            this.locationsFiltered = this.locations;
        }
        this.prepareSearchedCollection();

        this.selectItem(index);
        this.transaction.end();

        this.collectionChanged();
        if (callback) {
            callback(this.locations);
        }
    }

    // CRUD operation

    private getFiltered(localSearch?: string): Location[] {
        let searchedCollection: Location[] = [];
        // not filtered, return all collection
        if (!localSearch) {
            this.localSearch = null;
            this.locationsFiltered = this.locations;
            this.selectItem();
        } else if (!this.locationsFiltered || localSearch && localSearch != this.localSearch) {
            let searchQuery = localSearch.toLowerCase();
            searchedCollection = _.filter(this.locations, (item: Location) => {
                return item.name.toLowerCase().indexOf(searchQuery) > -1;
            });

            this.localSearch = localSearch;
            this.locationsFiltered = searchedCollection;
            this.selectItem();
        }

        return this.locationsFiltered;
    }

    private getFilter(): any {
        if (!this._filter || !angular.isObject(this._filter)) {
            this._filter = {};
        }

        if (!this._filter.org_id && this.iqsOrganization.orgId) {
            this._filter.org_id = this.iqsOrganization.orgId
        }

        return this._filter;
    }

    public read(successCallback?: (data: Location[]) => void, errorCallback?: (error: any) => void): angular.IPromise<any> {
        if (!this.locations || this.locations.length == 0) {
            this.state = States.Progress;
        }

        this.transaction.begin('READ_LOCATION');
        return this.iqsLocationsData.readLocations(this.getFilter(),
            (response: DataPage<Location>) => {
                this.onRead(response.data, successCallback);
            },
            (error: any) => {
                this.transaction.end(error);
                this.$log.error('Error: ' + JSON.stringify(error));
                if (errorCallback) {
                    errorCallback(error);
                }
            }
        );
    }

    public create(location: Location, successCallback?: (data: Location) => void, errorCallback?: (error: any) => void): void {
        this.transaction.begin('CREATE_LOCATION');
        this.iqsLocationsData.createLocation(location,
            (data: Location) => {
                this.state = States.Data;
                this.updateItemInCollection(data);
                if (successCallback) {
                    successCallback(data);
                }
                this.transaction.end();
            },
            (error: any) => {
                this.transaction.end(error);
                this.$log.error('Create location error: ', JSON.stringify(error));
                if (errorCallback) {
                    errorCallback(error);
                }
            }
        );
    }

    public delete(id: string, successCallback?: () => void, errorCallback?: (error: any) => void): void {
        this.transaction.begin('DELETE_LOCATION');
        let index: number;
        if (this.selectedItem && this.selectedItem.id == id) {
            index = this.selectIndex < this.locationsFiltered.length - 1 ? this.selectIndex : this.selectIndex - 1;
        } else {
            index = this.selectIndex;
        }

        this.iqsLocationsData.deleteLocation(id,
            () => {
                this.remove(id);
                if (successCallback) {
                    successCallback();
                }
                this.selectItem(index);
                this.transaction.end();
            },
            (error: any) => {
                this.transaction.end(error);
                this.$log.error('Delete location error: ', JSON.stringify(error));
                if (errorCallback) {
                    errorCallback(error);
                }
            }
        );
    }


    public update(id: string, location: Location, successCallback?: (data: Location) => void, errorCallback?: (error: any) => void): void {
        this.transaction.begin('UPDATE_LOCATION');

        this.iqsLocationsData.updateLocation(id, location,
            (data: Location) => {
                this.state = States.Data;
                this.updateItemInCollection(data);
                if (successCallback) {
                    successCallback(data);
                }
                this.transaction.end();
            },
            (error: any) => {
                this.transaction.end(error);
                this.$log.error('Update location error: ', JSON.stringify(error));
                if (errorCallback) {
                    errorCallback(error);
                }
            }
        );
    }

    // property

    public set filter(value: any) {
        this._filter = value;
    }

    public get filter(): any {
        return this._filter;
    }

    public get isSort(): boolean {
        return this._isSort;
    }

    public set isSort(value: boolean) {
        if (!!value) {
            this._isSort = value;
        }
    }

    public get state(): string {
        return this._state;
    }

    public set state(value: string) {
        if (value) {
            this._state = value;
        }
    }

    // data operation
    public get(localSearch?: string): Location[] {
        if (this.state == States.Progress) {
            return;
        }
        let result = this.getFiltered(localSearch);
        this.setState();

        return result;
    }

    public getSearchedCollection(): string[] {
        return this.searchedCollection;
    }

    public getSelectedIndex(): number {
        return this.selectIndex;
    }

    public getSelectedItem(): Location {
        return this.selectedItem;
    }

    public getTransaction(): pip.services.Transaction {
        return this.transaction;
    }

    public remove(id: string): void {
        _.remove(this.locations, { id: id });
        _.remove(this.locationsFiltered, { id: id });
        this.collectionChanged();
    }

    public reload(successCallback?: (data: Location[]) => void, errorCallback?: (error: any) => void) {
        this.locations = new Array();
        this.locationsFiltered = new Array();
        this.state = States.Progress;
        this.read(successCallback, errorCallback);
    }

    public selectItem(index?: number): void {
        if (index === undefined || index === null || index < 0 || index > this.locationsFiltered.length - 1) {
            if (this.$location.search()['location_id']) {
                index = _.findIndex(this.locationsFiltered, (item: Location) => {
                    return item.id == this.$location.search()['location_id'];
                });
            }
            if (!index || index == -1) {
                index = 0;
            }
        }

        this.selectIndex = index;

        this.selectedItem = (this.locationsFiltered && this.locationsFiltered.length > 0) ? this.locationsFiltered[index] : undefined;
        if (this.selectedItem) {
            this.$location.search('location_id', this.selectedItem.id);
        }
    }

    public getLocationById(locationId: string): Location {
        return _.find(this.locations, (location) => { return location.id === locationId; });
    }

    public clean(): void {
        this.locations = [];
        this.locationsFiltered = [];
        this.searchedCollection = [];
        this.selectIndex = -1;
        this.selectedItem = null;
        this.state = States.Empty;
    }
}

