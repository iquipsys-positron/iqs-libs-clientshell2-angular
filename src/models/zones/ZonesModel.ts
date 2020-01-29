import { States } from '../../common/States';
import {
    IZonesDataService,
    DataPage,
    Zone,
    ZoneType
} from '../../data';
import {
    IObjectGroupsViewModel,
    IObjectsViewModel
} from '../../models';
import {
    IOrganizationService,
    ISmartZoomService
} from '../../services';

export const enum ZoneCategory {
    All = 'all',
    Zone = 'zone',
    Object = 'object'
}

export class ZonesModel {
    private _state: string;
    private _isSort: boolean;
    private _filter: any;
    private _zonesCategory: string;
    private currentCategory: string;

    // zone without zone_object
    private _zones: Zone[];
    private _polygons: Zone[] = [];
    private _lines: Zone[] = [];
    private _circles: Zone[] = [];
    private _objects: Zone[] = [];
    private _notObjects: Zone[] = [];

    public mapZones: Zone[] = [];
    public mapLines: Zone[] = [];
    public mapCircles: Zone[] = [];
    public mapPolygons: Zone[] = [];
    public mapObjects: Zone[] = [];

    private polygonStroke: any = {
        color: '#03A9F4',
        weight: 3
    };
    private polygonFill: any = {
        color: '#03A9F4',
        opacity: 0.15
    };
    private lineStroke: any = {
        color: '#03A9F4',//'#AB47BC',
        weight: 5
    };

    private _zonesFiltered: Zone[];

    private searchedCollection: string[];
    private selectIndex: number;
    private selectedItem: Zone;
    private transaction: pip.services.Transaction;
    private localSearch: string = null;

    constructor(
        private $log: ng.ILogService,
        private $location: ng.ILocationService,
        private pipTransaction: pip.services.ITransactionService,
        private iqsOrganization: IOrganizationService,
        private iqsObjectGroupsViewModel: IObjectGroupsViewModel,
        private iqsObjectsViewModel: IObjectsViewModel,
        private iqsSmartZoom: ISmartZoomService,
        private iqsZonesData: IZonesDataService
    ) {
        "ngInject";
        this.transaction = this.pipTransaction.create('Zones');

        this._zonesCategory = ZoneCategory.Zone;
        this._zones = [];
        this._zonesFiltered = [];
        this.searchedCollection = [];
        this.iqsSmartZoom.addLevelChangedCallback((zoomLevel) => {
            this.updateMapZones(zoomLevel);
        });
    }

    private distributeByTypes() {
        this._polygons = [];
        this._lines = [];
        this._circles = [];
        this._objects = [];
        this._notObjects = [];

        _.each(this._zones, (zone, index) => {
            switch (zone.type) {
                case ZoneType.Polygon: {
                    this._polygons.push(zone);
                    this._notObjects.push(zone);
                    break;
                };
                case ZoneType.Line: {
                    this._lines.push(zone);
                    this._notObjects.push(zone);
                    break
                };
                case ZoneType.Cirle: {
                    this._circles.push(zone);
                    this._notObjects.push(zone);
                    break;
                };
                case ZoneType.Object: {
                    this._objects.push(zone);

                    break;
                }
            }
        });

        // this.excludeObjects();
    }

    private convertPolygon(zone: Zone) {
        if (!zone) return;

        let results = [];
        zone.fill = this.polygonFill;
        zone.stroke = this.polygonStroke;
        if (!zone.geometry) return;

        if (zone.geometry) {
            _.each(zone.geometry.coordinates[0], (coordinate) => {
                results.push({ latitude: coordinate[1], longitude: coordinate[0] });
            });
        }
        zone.path = results;
    }

    private convertLine(zone: Zone) {
        if (!zone) return;

        let results = [];
        zone.stroke = this.lineStroke;
        if (!zone.geometry) return;

        if (zone.geometry) {
            _.each(zone.geometry.coordinates, (coordinate) => {
                results.push({ latitude: coordinate[1], longitude: coordinate[0] });
            });
        }

        zone.path = results;
    }

    private convertCircle(zone: Zone) {
        if (!zone) return;

        zone.stroke = this.polygonStroke;
        zone.fill = this.polygonFill;

        if (zone.center && zone.center.coordinates) {
            zone.center = {
                latitude: zone.center.coordinates[1],
                longitude: zone.center.coordinates[0]
            }
        }
    }

    private convertCenter(zone: Zone): Zone {
        if (!zone) return;

        const result = _.cloneDeep(zone);

        result.center = {
            type: 'Point',
            coordinates: [
                zone.center.longitude,
                zone.center.latitude
            ]
        };

        return result;
    }

    private convertZonePositions(zone: Zone) {
        zone.path = [];

        switch (zone.type) {
            case ZoneType.Polygon: {
                this.convertPolygon(zone);

                break;
            }

            case ZoneType.Line: {
                this.convertLine(zone);

                break;
            }

            case ZoneType.Cirle: {
                this.convertCircle(zone);

                break;
            }
        }
    }

    private updateMapZones(zoomLevel) {
        this.mapZones = zoomLevel === this.iqsSmartZoom.smartZoomLevels.small.name ? [] : this._zones;
        this.mapLines = zoomLevel === this.iqsSmartZoom.smartZoomLevels.small.name ? [] : this._lines;
        this.mapCircles = zoomLevel === this.iqsSmartZoom.smartZoomLevels.small.name ? [] : this._circles;
        this.mapPolygons = zoomLevel === this.iqsSmartZoom.smartZoomLevels.small.name ? [] : this._polygons;
        this.mapObjects = zoomLevel === this.iqsSmartZoom.smartZoomLevels.small.name ? [] : this._objects;
    }

    private prepare() {
        _.each(this._zones, (zone: Zone) => {
            this.prepareZone(zone);
        });
        this.distributeByTypes();
        this.updateMapZones(this.iqsSmartZoom.zoomLevel);
        this.prepareSearchedCollection();

    }

    private prepareZone(zone: Zone) {
        this.convertZonePositions(zone);
        this.getObjectsAndGroups(zone);
    }

    // private operation
    private updateItemInCollection(item: Zone): void {
        let index: number = _.findIndex(this._zones, (ev) => {
            return ev.id == item.id;
        });
        this.prepareZone(item);
        // insert zonewithout sort
        if (index > -1) {
            let sortNeed: boolean = item.name != this._zones[index].name;
            this._zones[index] = item;
            if (this.isSort && sortNeed) {
                this.sortZones(this._zones);
            }
            if (this.selectedItem) {
                if (this.selectedItem.id != item.id) {
                    this.selectItem(0);
                }
            } else {
                this.selectItem(index);
            }

            // update collections
            this.distributeByTypes();
        } else {
            if (this._isSort) {
                index = _.findIndex(this._zones, (ev) => {
                    return ev.name.toLocaleLowerCase() > item.name.toLocaleLowerCase();
                });
                if (index > -1) {
                    this._zones.splice(index, 0, item);
                } else {
                    this._zones.push(item);
                    // index = this._zones.length - 1;
                }
            } else {
                this._zones.unshift(item);
                // index = 0;
            }

            // update collections
            this.distributeByTypes();
            // let search: string = this.localSearch;
            this.localSearch = '';

            this.getFiltered(this.localSearch);
            index = _.findIndex(this._zonesFiltered, (ev) => {
                return ev.id == item.id;
            });

            this.selectItem(index);
        }

        this.prepareSearchedCollection();
        this.updateMapZones(this.iqsSmartZoom.zoomLevel);
        this.collectionChanged();
    }

    private collectionChanged() {
        // this.$timeout(() => {
        this.setState();
        // }, 0);
        // send broadcast ???
    }

    private setState() {
        this.state = (this._zonesFiltered && this._zonesFiltered.length > 0) ? States.Data : States.Empty;
    }

    private prepareSearchedCollection() {
        let zones: Zone[];
        switch (this.zonesCategory) {
            case ZoneCategory.Object: {
                zones = this._objects;
                break;
            };
            case ZoneCategory.Zone: {
                zones = this._notObjects;
                break
            };
            case ZoneCategory.All: {
                zones = this._zones;
                break
            };
            default: {
                zones = this._notObjects;
            }
        }

        this.searchedCollection = [];
        _.each(zones, (item: Zone) => {
            this.searchedCollection.push(item.name.toLocaleLowerCase());
        });
    }

    private sortZones(data: Zone[]) {
        this._zones = _.sortBy(data, function (item: Zone) {
            if (item.name) {
                return item.name.toLocaleLowerCase();
            }
            return '';
        });
    }

    private onRead(data: Zone[], callback?: (data: Zone[]) => void): void {
        let index: number;
        if (data && data.length > 0) {
            if (this.isSort) {
                this.sortZones(data);
            } else {
                this._zones = data;
            }
            index = _.findIndex(this._zones, (item: Zone) => {
                return item.id == this.$location.search()['zone_id'];
            });
            index = index > -1 ? index : 0;
        } else {
            this._zones = [];
            this.searchedCollection = [];
            index = -1;
        }
        this.prepare();

        if (!this.localSearch) {
            // filter objects zones
            this._zonesFiltered = _.cloneDeep(this._zones);
        }

        this.selectItem(index);
        this.transaction.end();

        if (callback) {
            callback(this._zones);
        }
        this.collectionChanged();
    }

    private getFiltered(localSearch?: string): Zone[] {
        let searchedCollection: Zone[] = [];
        let zones: Zone[];

        switch (this.zonesCategory) {
            case ZoneCategory.Object: {
                zones = this._objects;
                break;
            };
            case ZoneCategory.Zone: {
                zones = this._notObjects;
                break
            };
            case ZoneCategory.All: {
                zones = this._zones;
                break
            };
            default: {
                zones = this._notObjects;
            }
        }
        // not filtered, return all collection
        if (!localSearch) {
            this.localSearch = null;
            this._zonesFiltered = zones;
            this.currentCategory = _.cloneDeep(this.zonesCategory);
            this.selectItem();

            return zones;
        }

        if (localSearch && (localSearch != this.localSearch || this.currentCategory != this.zonesCategory)) {
            let searchQuery = localSearch.toLowerCase();
            searchedCollection = _.filter(zones, (item: Zone) => {
                return item.name.toLowerCase().indexOf(searchQuery) > -1;
            });

            this.localSearch = localSearch;
            this._zonesFiltered = searchedCollection;
            this.selectItem();
        }
        this.currentCategory = _.cloneDeep(this.zonesCategory);

        return this._zonesFiltered;
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

    // CRUD operation
    public read(successCallback?: (data: Zone[]) => void, errorCallback?: (error: any) => void): angular.IPromise<any> {
        this.transaction.begin('read');
        return this.iqsZonesData.readZones(this.getFilter(),
            (response: DataPage<Zone>) => {
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

    public create(zone: Zone, successCallback?: (data: Zone) => void, errorCallback?: (error: any) => void): void {
        if (zone.type === 'circle') zone = this.convertCenter(zone);

        this.transaction.begin('CREATE_ZONE');
        this.iqsZonesData.saveZone(zone,
            (data: Zone) => {
                this.state = States.Data;

                this.updateItemInCollection(data);

                if (successCallback) {
                    successCallback(data);
                }
                this.transaction.end();
            },
            (error: any) => {
                this.transaction.end(error);
                this.$log.error('Create zone error: ', JSON.stringify(error));
                if (errorCallback) {
                    errorCallback(error);
                }
            }
        );
    }

    public delete(id: string, successCallback?: () => void, errorCallback?: (error: any) => void): void {
        this.transaction.begin('DELETE_ZONE');
        let index: number;
        if (this.selectedItem && this.selectedItem.id == id) {
            index = this.selectIndex < this._zonesFiltered.length - 1 ? this.selectIndex : this.selectIndex - 1;
        } else {
            index = this.selectIndex;
        }

        this.iqsZonesData.deleteZone(id,
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
                this.$log.error('Delete zone error: ', JSON.stringify(error));
                if (errorCallback) {
                    errorCallback(error);
                }
            }
        );
    }

    public update(id: string, zone: Zone, successCallback?: (data: Zone) => void, errorCallback?: (error: any) => void): void {
        if (zone.type === 'circle') zone = this.convertCenter(zone);

        this.transaction.begin('UPDATE_ZONE');
        this.iqsZonesData.updateZone(id, zone,
            (data: Zone) => {
                this.state = States.Data;
                this.updateItemInCollection(data);
                if (successCallback) {
                    successCallback(data);
                }
                this.transaction.end();
            },
            (error: any) => {
                this.transaction.end(error);
                this.$log.error('Update zone error: ', JSON.stringify(error));
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

    public get zonesCategory(): string {
        return this._zonesCategory;
    }

    public set zonesCategory(value: string) {
        if (value) {
            this._zonesCategory = value;
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
    public get(localSearch?: string): Zone[] {
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

    public getSelectedItem(): Zone {
        return this.selectedItem;
    }

    public getTransaction(): pip.services.Transaction {
        return this.transaction;
    }

    public remove(id: string): void {
        _.remove(this._zones, { id: id });
        _.remove(this._polygons, { id: id });
        _.remove(this._lines, { id: id });
        _.remove(this._circles, { id: id });
        _.remove(this._objects, { id: id });
        _.remove(this._notObjects, { id: id });
        _.remove(this._zonesFiltered, { id: id });

        _.remove(this.mapZones, { id: id });
        _.remove(this.mapLines, { id: id });
        _.remove(this.mapCircles, { id: id });
        _.remove(this.mapPolygons, { id: id });
        _.remove(this.mapObjects, { id: id });

        this.collectionChanged();
    }

    public reload(successCallback?: (data: Zone[]) => void, errorCallback?: (error: any) => void) {
        this._zones = new Array();
        this._zonesFiltered = new Array();
        this.state = States.Progress;
        this.read(successCallback, errorCallback);
    }

    public selectItem(index?: number): void {
        if (index === undefined || index === null || index < 0 || index > this._zonesFiltered.length - 1) {
            if (this.$location.search()['zone_id']) {
                index = _.findIndex(this._zonesFiltered, (item: Zone) => {
                    return item.id == this.$location.search()['zone_id'];
                });
            }
            if (!index || index == -1 || index > this._zonesFiltered.length - 1) {
                index = 0;
            }
        }

        this.selectIndex = index;

        this.selectedItem = (this._zonesFiltered && this._zonesFiltered.length > 0) ? this._zonesFiltered[index] : undefined;
        if (this.selectedItem) {
            this.$location.search('zone_id', this.selectedItem.id);
        }
    }

    public getZoneById(zoneId: string): Zone {
        return _.find(this._zones, (zone) => { return zone.id === zoneId; });
    }

    private getObjectsAndGroups(zone) {
        zone.included = [];
        zone.excluded = [];

        if (zone.include_group_ids) {
            _.each(zone.include_group_ids, (groupId) => {
                zone.included.push(this.iqsObjectGroupsViewModel.getGroupById(groupId));
            });
        }

        if (zone.include_object_ids) {
            _.each(zone.include_object_ids, (objectId) => {
                zone.included.push(this.iqsObjectsViewModel.getObjectById(objectId));
            });
        }

        if (zone.exclude_group_ids) {
            _.each(zone.exclude_group_ids, (groupId) => {
                zone.excluded.push(this.iqsObjectGroupsViewModel.getGroupById(groupId));
            });
        }

        if (zone.exclude_object_ids) {
            _.each(zone.exclude_object_ids, (objectId) => {
                zone.excluded.push(this.iqsObjectsViewModel.getObjectById(objectId));
            });
        }
    }

    public get zones() {
        return this._zones;
    }

    public get polygons() {
        return this._polygons;
    }

    public get lines() {
        return this._lines;
    }

    public get circles() {
        return this._circles;
    }

    public get objects() {
        return this._objects;
    }

    public get notObjects() {
        return this._notObjects;
    }

    public clean(): void {
        this._zones = [];
        this._polygons = [];
        this._lines = [];
        this._circles = [];
        this._objects = [];
        this._notObjects = [];
        this.mapZones = [];
        this.mapLines = [];
        this.mapCircles = [];
        this.mapPolygons = [];
        this.mapObjects = [];
        this._zonesFiltered = [];
        this.searchedCollection = [];
        this.selectIndex = -1;
        this.selectedItem = null;
        this.state = States.Empty;
    }
}

