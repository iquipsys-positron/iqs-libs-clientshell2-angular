import '../type_collections/TypeCollectionsService';

import { IGlobalSearchService } from './IGlobalSearchService';
import { SearchObjectTypes } from './SearchObjectTypes';
import { SearchResult } from './SearchResult';
import { ControlObject, Device, Zone, Location, ObjectGroup } from '../../data';
import { ITypeCollectionsService, TypeCollectionItem } from '../../services';
import {
    IDevicesViewModel,
    ILocationsViewModel,
    IObjectGroupsViewModel,
    IObjectsViewModel,
    IZonesViewModel
} from '../../models';

class GlobalSearchService implements IGlobalSearchService {

    private objectCollection: ControlObject[];
    private deviceCollection: Device[];
    private locationCollection: Location[];
    private objectGroupsCollection: ObjectGroup[];
    private zonesObjectCollection: Zone[];
    private zonesGeometryCollection: Zone[];


    private stringObjectCollection: string[];
    private stringDeviceCollection: string[];
    private stringLocationCollection: string[];
    private stringObjectGroupsCollection: string[];

    private stringZonesObjectCollection: string[];
    private stringZonesGeometryCollection: string[];

    private stringObjectCategory: string[];
    private stringDeviceType: string[];
    private stringZoneType: string[];
    private stringObjectType: string[];

    private _isInit: boolean = false;

    private _autocompleteCollection: string[];

    constructor(
        private $log: ng.ILogService,
        private $timeout: ng.ITimeoutService,
        private $q: ng.IQService,
        private pipTranslate: pip.services.ITranslateService,

        private iqsObjectsViewModel: IObjectsViewModel,
        private iqsDevicesViewModel: IDevicesViewModel,
        private iqsLocationsViewModel: ILocationsViewModel,
        private iqsObjectGroupsViewModel: IObjectGroupsViewModel,
        private iqsZonesViewModel: IZonesViewModel,
        private iqsTypeCollectionsService: ITypeCollectionsService
    ) {
        "ngInject";

    }

    // public  property
    public get isInit(): boolean {
        return this._isInit;
    }

    public getSpecialSearchCollection(objectType: string, updateCallback?: () => void): string[] {
        let result: string[];

        switch (objectType) {
            case SearchObjectTypes.ControlObject:
                result = this.initObject();
                break;
            case SearchObjectTypes.ObjectGroup:
                result = this.initObjectGroup(updateCallback);
                break;
            case SearchObjectTypes.Device:
                result = this.initDevice();
                break;
            case SearchObjectTypes.Location:
                result = this.initLocations();
                break;
            case SearchObjectTypes.ObjectCategory:
                result = this.initObjectCategory();
                break;
            case SearchObjectTypes.DeviceType:
                result = this.initDeviceType();
                break;
            case SearchObjectTypes.ZoneType:
                result = this.initZoneType();
                break;
            case SearchObjectTypes.Zone:
                result = _.union(this.initZoneGeometry(), this.initZoneObject());
                break;
            case SearchObjectTypes.ZoneObject:
                result = this.initZoneObject();
                break;
            case SearchObjectTypes.ZoneGeometry:
                result = this.initZoneGeometry();
                break;
            case SearchObjectTypes.ObjectType:
                result = this.initObjectType();
                break;
            case SearchObjectTypes.ObjectsAndGroups:
                result = _.union(this.initObject(), this.initObjectGroup(updateCallback));
                break;
            default:
                result = [];
        }
        return _.sortBy(result, (s: string) => {
            return s;
        });
    }

    // init data collection 
    private initCollections() {
        this.objectCollection = this.iqsObjectsViewModel.allObjects;
        this.deviceCollection = this.iqsDevicesViewModel.allDevices;
        this.locationCollection = this.iqsLocationsViewModel.getCollection();
        this.objectGroupsCollection = this.iqsObjectGroupsViewModel.getCollection(() => {
            this.objectGroupsCollection = this.iqsObjectGroupsViewModel.getCollection();
        });
        this.zonesObjectCollection = this.iqsZonesViewModel.objects;
        this.zonesGeometryCollection = this.iqsZonesViewModel.notObjects;
    }

    public getDefaultCollection(objectType: string): string[] {
        this.initCollections();
        let defaults: string[] = [this.pipTranslate.translate('GLOBAL_SEARCH_ALL').toLocaleLowerCase()];
        let isSort: boolean = true;

        let result: string[];
        switch (objectType) {
            case SearchObjectTypes.ControlObject:
                isSort = false;
                result = _.union(this.initObjectCategory(), _.sortBy(this.initUsedObjectType(), (s: string) => {
                    return s;
                }));
                break;
            case SearchObjectTypes.ObjectGroup:
                result = [];
                break;
            case SearchObjectTypes.Device:
                result = this.initDeviceType();
                break;
            case SearchObjectTypes.Location:
                result = this.initLocations();
                break;
            case SearchObjectTypes.ObjectCategory:
                result = this.initObjectType();
                break;
            case SearchObjectTypes.DeviceType:
                result = this.initDeviceType();
                break;
            case SearchObjectTypes.ZoneType:
                result = this.initZoneType();
                break;
            case SearchObjectTypes.Zone:
                result = this.initZoneType();
                break;
            case SearchObjectTypes.ObjectType:
                result = this.initObjectType();
                break;
            case SearchObjectTypes.ObjectsAndGroups:
                isSort = false;
                result = _.union(this.initObjectCategory(), _.sortBy(this.initUsedObjectType(), (s: string) => {
                    return s;
                }));
                break;
            default:
                result = [];
        }

        if (isSort) {
            result = _.sortBy(result, (s: string) => {
                return s;
            });
        }

        result = _.union(defaults, result);

        return result;
    }

    // init string[] collection and return it
    public init(): string[] {
        this._isInit = false;
        this.initCollections();
        this._autocompleteCollection = this.initAutocomplete();

        this._autocompleteCollection = this.initAutocomplete().sort(function (a, b) {
            return a.localeCompare(b);
        });
        this._isInit = true;

        return this._autocompleteCollection;
    }


    public initAutocomplete(): any {
        let obj: any = {};
        let localObj: any;
        let str: string;

        // add object
        localObj = {};
        _.each(this.objectCollection, (item: ControlObject) => {
            if (item.name !== undefined && item.name !== null) {
                str = item.name.toLocaleLowerCase();
                obj[str] = str;
                localObj[str] = str;
            }
        });
        this.stringObjectCollection = <Array<string>>_.values(localObj);

        // add device
        localObj = {};
        _.each(this.deviceCollection, (item: Device) => {
            if (item.udi !== undefined && item.udi !== null) {
                str = item.udi.toLocaleLowerCase();
                obj[str] = str;
            }
            if (item.label !== undefined && item.label !== null) {
                str = item.label.toLocaleLowerCase();
                obj[str] = str;
                localObj[str] = str;
            }
        });
        this.stringDeviceCollection = <Array<string>>_.values(localObj);

        // add object group
        localObj = {};
        _.each(this.objectGroupsCollection, (item: ObjectGroup) => {
            if (item.name !== undefined && item.name !== null) {
                str = item.name.toLocaleLowerCase();
                obj[str] = str;
                localObj[str] = str;
            }
        });
        this.stringObjectGroupsCollection = <Array<string>>_.values(localObj);

        // add location
        localObj = {};
        _.each(this.locationCollection, (item: Location) => {
            if (item.name !== undefined && item.name !== null) {
                str = item.name.toLocaleLowerCase();
                obj[str] = str;
                localObj[str] = str;
            }
        });
        this.stringLocationCollection = <Array<string>>_.values(localObj);

        // add zones objects
        localObj = {};
        _.each(this.zonesObjectCollection, (item: Zone) => {
            if (item.name !== undefined && item.name !== null) {
                str = item.name.toLocaleLowerCase();
                obj[str] = str;
                localObj[str] = str;
            }
        });
        this.stringZonesObjectCollection = <Array<string>>_.values(localObj);

        // add zones geometry
        localObj = {};
        _.each(this.zonesGeometryCollection, (item: Zone) => {
            if (item.name !== undefined && item.name !== null) {
                str = item.name.toLocaleLowerCase();
                obj[str] = str;
                localObj[str] = str;
            }
        });
        this.stringZonesGeometryCollection = <Array<string>>_.values(localObj);

        // translate object type
        _.each(this.initObjectCategory(), (str: string) => {
            obj[str] = str;
        });
        this.stringObjectCategory = this.initObjectCategory();

        _.each(this.initDeviceType(), (str: string) => {
            obj[str] = str;
        });
        this.stringDeviceType = this.initDeviceType();

        _.each(this.initZoneType(), (str: string) => {
            obj[str] = str;
        });
        this.stringZoneType = this.initZoneType();

        _.each(this.initObjectType(), (str: string) => {
            obj[str] = str;
        });
        this.stringObjectType = this.initObjectType();

        let result = _.values(obj);

        return result;
    }


    // parallel collection initilized, return promise and callback

    private initObject(): string[] {
        let result: string[] = [];
        _.each(this.objectCollection, (item: ControlObject) => {
            if (item.name !== undefined && item.name !== null) {
                result.push(item.name.toLocaleLowerCase());
            }
        });

        return result;
    }

    private initDevice(): string[] {
        let result: string[] = [];
        _.each(this.deviceCollection, (item: Device) => {
            if (item.udi !== undefined && item.udi !== null) {
                result.push(item.udi.toLocaleLowerCase());
            }
            if (item.label !== undefined && item.label !== null) {
                result.push(item.label.toLocaleLowerCase());
            }
        });

        return result;
    }

    private initLocations(): string[] {
        let result: string[] = [];
        _.each(this.locationCollection, (item: Location) => {
            if (item.name !== undefined && item.name !== null) {
                result.push(item.name.toLocaleLowerCase());
            }
        });

        return result;
    }

    private initObjectGroup(updateCallback?: () => void): string[] {
        this.objectGroupsCollection = this.iqsObjectGroupsViewModel.getCollection(updateCallback);
        let result: string[] = [];
        _.each(this.objectGroupsCollection, (item: ObjectGroup) => {
            if (item.name !== undefined && item.name !== null) {
                result.push(item.name.toLocaleLowerCase());
            }
        });

        return result;
    }

    private initZoneGeometry(): string[] {
        let result: string[] = [];
        _.each(this.zonesGeometryCollection, (item: Zone) => {
            if (item.name !== undefined && item.name !== null) {
                result.push(item.name.toLocaleLowerCase());
            }
        });

        return result;
    }

    private initZoneObject(): string[] {
        let result: string[] = [];
        _.each(this.zonesObjectCollection, (item: Zone) => {
            if (item.name !== undefined && item.name !== null) {
                result.push(item.name.toLocaleLowerCase());
            }
        });

        return result;
    }

    private initObjectCategory(): string[] {
        let result: string[] = [];
        _.each(this.iqsTypeCollectionsService.getObjectCategory(), (item: TypeCollectionItem) => {
            if (item.name !== undefined && item.name !== null) {
                result.push(item.name.toLocaleLowerCase());
            }
        });

        return result;
    }

    private initDeviceType(): string[] {
        let result: string[] = [];
        _.each(this.iqsTypeCollectionsService.getDeviceType(), (item: TypeCollectionItem) => {
            if (item.name !== undefined && item.name !== null) {
                result.push(item.name.toLocaleLowerCase());
            }
        });

        return result;
    }

    private initZoneType(): string[] {
        let result: string[] = [];
        _.each(this.iqsTypeCollectionsService.getZoneType(), (item: TypeCollectionItem) => {
            if (item.name !== undefined && item.name !== null) {
                result.push(item.name.toLocaleLowerCase());
            }
        });

        return result;
    }

    private initObjectType(): string[] {
        let result: string[] = [];
        _.each(this.iqsTypeCollectionsService.getObjectType(), (item: TypeCollectionItem) => {
            if (item.name !== undefined && item.name !== null) {
                result.push(item.name.toLocaleLowerCase());
            }
        });

        return result;
    }

    private initUsedObjectType(): string[] {
        let result: string[] = [];


        _.each(this.iqsTypeCollectionsService.getObjectType(), (item: TypeCollectionItem) => {
            let index: number = _.findIndex(this.objectCollection, (obj: ControlObject) => {
                return obj.type == item.id;
            });
            if (item.name !== undefined && item.name !== null && index > -1) {
                result.push(item.name.toLocaleLowerCase());
            }
        });

        return result;
    }


    public initAutocompleteParallel(successCallback?: (data: string[]) => void): angular.IPromise<any> {
        this._isInit = false;
        let autocompleteArray: string[] = [];
        let deferred = this.$q.defer();

        this.initCollections()

        async.parallel([
            (callback) => {
                this.stringObjectCollection = this.initObject();
                callback(null, this.stringObjectCollection);
            },
            (callback) => {
                this.stringDeviceCollection = this.initDevice();
                callback(null, this.stringDeviceCollection);
            },
            (callback) => {
                this.stringLocationCollection = this.initLocations();
                callback(null, this.stringLocationCollection);
            },
            (callback) => {
                this.stringObjectGroupsCollection = this.initObjectGroup();
                callback(null, this.stringObjectGroupsCollection);
            },
            (callback) => {
                this.stringZonesGeometryCollection = this.initZoneGeometry();
                callback(null, this.stringZonesGeometryCollection);
            },
            (callback) => {
                this.stringZonesObjectCollection = this.initZoneObject();
                callback(null, this.stringZonesObjectCollection);
            },
            (callback) => {
                this.stringObjectCategory = this.initObjectCategory();
                callback(null, this.stringObjectCategory);
            },
            (callback) => {
                this.stringDeviceType = this.initDeviceType();
                callback(null, this.stringDeviceType);
            },
            (callback) => {
                this.stringZoneType = this.initZoneType();
                callback(null, this.stringZoneType);
            },
            (callback) => {
                this.stringObjectType = this.initObjectType();
                callback(null, this.stringObjectType);
            }
        ],
            // optional callback
            (error, results) => {
                autocompleteArray = _.union(
                    <Array<string>>results[0],
                    <Array<string>>results[1],
                    <Array<string>>results[2],
                    <Array<string>>results[3],
                    <Array<string>>results[4],
                    <Array<string>>results[5],
                    <Array<string>>results[6],
                    <Array<string>>results[7],
                    <Array<string>>results[8]
                );

                this._autocompleteCollection = autocompleteArray.sort(function (a, b) {
                    return a.localeCompare(b);
                });
                deferred.resolve(this._autocompleteCollection);
                this._isInit = true;

                if (successCallback) {
                    successCallback(this._autocompleteCollection);
                }

                return deferred.promise;
            });

        return deferred.promise;
    }

    // get records for some types

    private getDeviceForType(deviceTypes: SearchResult[]): SearchResult[] {
        let devices: SearchResult[] = [];
        _.each(deviceTypes, (obj: SearchResult) => {
            if (obj.type) {
                _.each(this.deviceCollection, (device: Device) => {
                    if (device.type === obj.type) {
                        devices.push({
                            object_type: SearchObjectTypes.Device,
                            item: device,
                            id: device.id
                        });
                    }
                });
            }
        });

        return devices;
    }

    private getObjectsForDevice(devices: SearchResult[]): SearchResult[] {
        let controlObject: SearchResult[] = [];
        _.each(devices, (device: SearchResult) => {
            if (device.item && device.item.object_id) {
                let obj = _.find(this.objectCollection, (item: ControlObject) => {
                    return item.id === device.item.object_id;
                });
                if (obj) {
                    controlObject.push({
                        object_type: SearchObjectTypes.ControlObject,
                        item: obj,
                        id: obj.id
                    });
                }
            }
        });

        return controlObject;
    }

    private getDeviceForObject(objects: SearchResult[]): SearchResult[] {
        let devices: SearchResult[] = [];
        _.each(objects, (obj: SearchResult) => {
            if (obj.item && obj.item.device_id) {
                let device = _.find(this.deviceCollection, (item: Device) => {
                    return item.id === obj.item.device_id;
                });
                if (device) {
                    devices.push({
                        object_type: SearchObjectTypes.Device,
                        item: device,
                        id: device.id
                    });
                }
            }
        });

        return devices;
    }

    private getObjectsForGroup(objectGroups: SearchResult[]): SearchResult[] {
        let controlObject: SearchResult[] = [];
        _.each(objectGroups, (group: SearchResult) => {
            if (group.item && group.item.object_ids && group.item.object_ids.length > 0) {
                _.each(group.item.object_ids, (id: string) => {
                    let obj = _.find(this.objectCollection, (item: ControlObject) => {
                        return item.id === id;
                    });
                    if (obj) {
                        controlObject.push({
                            object_type: SearchObjectTypes.ControlObject,
                            item: obj,
                            id: obj.id
                        });
                    }
                })

            }
        });

        return controlObject;
    }

    private getObjectsForCategory(objectCategory: SearchResult[]): SearchResult[] {
        let controlObject: SearchResult[] = [];
        _.each(objectCategory, (category: SearchResult) => {
            if (category.type) {
                _.each(this.objectCollection, (obj: ControlObject) => {
                    if (obj.category === category.type) {
                        controlObject.push({
                            object_type: SearchObjectTypes.ControlObject,
                            item: obj,
                            id: obj.id
                        });
                    }
                });
            }
        });

        return controlObject;
    }

    private getObjectsForType(objectTypes: SearchResult[]): SearchResult[] {
        let controlObject: SearchResult[] = [];
        _.each(objectTypes, (item: SearchResult) => {
            if (item.type) {
                _.each(this.objectCollection, (obj: ControlObject) => {
                    if (obj.type === item.type) {
                        controlObject.push({
                            object_type: SearchObjectTypes.ControlObject,
                            item: obj,
                            id: obj.id
                        });
                    }
                });
            }
        });

        return controlObject;
    }

    private getZoneForZoneType(zoneTypes: SearchResult[]): SearchResult[] {
        let zones: SearchResult[] = [];
        _.each(zoneTypes, (item: SearchResult) => {
            if (item.type) {
                _.each(this.zonesGeometryCollection, (zone: Zone) => {
                    if (zone.type === item.type) {
                        zones.push({
                            object_type: SearchObjectTypes.Zone,
                            item: zone,
                            id: zone.id
                        });
                    }
                });
                _.each(this.zonesObjectCollection, (zone: Zone) => {
                    if (zone.type === item.type) {
                        zones.push({
                            object_type: SearchObjectTypes.Zone,
                            item: zone,
                            id: zone.id
                        });
                    }
                });
            }
        });

        return zones;
    }

    private getObjectsForZone(zones: SearchResult[]): SearchResult[] {
        let controlObject: SearchResult[] = [];
        _.each(zones, (zone: SearchResult) => {
            if (zone.item && zone.item.include_object_ids && zone.item.include_object_ids.length > 0) {
                _.each(zone.item.include_object_ids, (id: string) => {
                    let obj = _.find(this.objectCollection, (item: ControlObject) => {
                        return item.id === id;
                    });
                    if (obj) {
                        controlObject.push({
                            object_type: SearchObjectTypes.ControlObject,
                            item: obj,
                            id: obj.id
                        });
                    }
                })

            }
        });

        return controlObject;
    }

    private getLocationForZone(zones: SearchResult[]): SearchResult[] {
        // todo

        return [];
    }

    private getSearchResultObject(objectType, item): SearchResult {
        return {
            object_type: objectType,
            item: item,
            id: item.id
        };
    }

    // search
    private searchObject(searchQuery: string, objectType?: string): SearchResult[] {
        let objectResult: SearchResult[] = [];
        if (searchQuery === this.pipTranslate.translate('GLOBAL_SEARCH_ALL').toLocaleLowerCase()) {
            _.each(this.objectCollection, (item: ControlObject) => {
                objectResult.push(this.getSearchResultObject(SearchObjectTypes.ControlObject, item));
            });
        } else {
            _.each(this.objectCollection, (item: ControlObject) => {
                if (item.name !== undefined && item.name !== null) {
                    if (item.name.toLocaleLowerCase().indexOf(searchQuery) >= 0) {
                        objectResult.push(this.getSearchResultObject(SearchObjectTypes.ControlObject, item));
                    }
                }
            });
        }

        if (!objectType || objectType == SearchObjectTypes.ControlObject || objectType == SearchObjectTypes.ObjectsAndGroups) {

            return objectResult;
        }
        if (objectType == SearchObjectTypes.Device) {

            return this.getDeviceForObject(objectResult);
        }

        return [];
    }

    private searchDevice(searchQuery: string, objectType?: string): SearchResult[] {
        let deviceResult: SearchResult[] = [];
        if (searchQuery === this.pipTranslate.translate('GLOBAL_SEARCH_ALL').toLocaleLowerCase()) {
            _.each(this.deviceCollection, (item: Device) => {
                deviceResult.push(this.getSearchResultObject(SearchObjectTypes.Device, item));
            });
        } else {
            _.each(this.deviceCollection, (item: Device) => {
                if (item.udi !== undefined && item.udi !== null) {
                    if (item.udi.toLocaleLowerCase().indexOf(searchQuery) >= 0) {
                        deviceResult.push(this.getSearchResultObject(SearchObjectTypes.Device, item));
                        return;
                    }
                }
                if (item.label !== undefined && item.label !== null) {
                    if (item.label.toLocaleLowerCase().indexOf(searchQuery) >= 0) {
                        deviceResult.push(this.getSearchResultObject(SearchObjectTypes.Device, item));
                    }
                }
            });
        }

        if (!objectType || objectType == SearchObjectTypes.Device) {

            return deviceResult;
        }

        if (objectType == SearchObjectTypes.ControlObject) {

            return this.getObjectsForDevice(deviceResult);
        }

        return [];
    }

    private searchLocations(searchQuery: string, objectType?: string): SearchResult[] {
        let result: SearchResult[] = [];
        if (searchQuery === this.pipTranslate.translate('GLOBAL_SEARCH_ALL').toLocaleLowerCase()) {
            _.each(this.locationCollection, (item: Location) => {
                result.push(this.getSearchResultObject(SearchObjectTypes.Location, item));
            });
        } else {
            _.each(this.locationCollection, (item: Location) => {
                if (item.name !== undefined && item.name !== null) {
                    if (item.name.toLocaleLowerCase().indexOf(searchQuery) >= 0) {
                        result.push(this.getSearchResultObject(SearchObjectTypes.Location, item));
                    }
                }
            });
        }

        return result;
    }

    private searchObjectGroup(searchQuery: string, objectType?: string): SearchResult[] {
        let groupResult: SearchResult[] = [];
        if (searchQuery === this.pipTranslate.translate('GLOBAL_SEARCH_ALL').toLocaleLowerCase()) {
            _.each(this.objectGroupsCollection, (item: ObjectGroup) => {
                groupResult.push(this.getSearchResultObject(SearchObjectTypes.ObjectGroup, item));
            });
        } else {
            _.each(this.objectGroupsCollection, (item: ObjectGroup) => {
                if (item.name !== undefined && item.name !== null) {
                    if (item.name.toLocaleLowerCase().indexOf(searchQuery) >= 0) {
                        groupResult.push(this.getSearchResultObject(SearchObjectTypes.ObjectGroup, item));
                    }
                }
            });
        }

        if (!objectType || objectType == SearchObjectTypes.ObjectGroup || objectType == SearchObjectTypes.ObjectsAndGroups) {

            return groupResult;
        }
        if (objectType == SearchObjectTypes.ControlObject) {

            return this.getObjectsForGroup(groupResult);
        }
        if (objectType == SearchObjectTypes.Device) {
            let objectResult: SearchResult[] = this.getObjectsForGroup(groupResult);

            return this.getDeviceForObject(objectResult);
        }

        return [];
    }

    private searchObjectCategory(searchQuery: string, objectType?: string): SearchResult[] {
        let categoryResult: SearchResult[] = [];

        if (searchQuery === this.pipTranslate.translate('GLOBAL_SEARCH_ALL').toLocaleLowerCase()) {
            _.each(this.iqsTypeCollectionsService.getObjectCategory(), (item: TypeCollectionItem) => {
                categoryResult.push({
                    object_type: SearchObjectTypes.ObjectCategory,
                    item: null,
                    type: item.id
                });
            });
        } else {
            _.each(this.iqsTypeCollectionsService.getObjectCategory(), (item: TypeCollectionItem) => {
                if (item.name !== undefined && item.name !== null) {
                    if (item.name.toLocaleLowerCase().indexOf(searchQuery) >= 0) {
                        categoryResult.push({
                            object_type: SearchObjectTypes.ObjectCategory,
                            item: null,
                            type: item.id
                        });
                    }
                }
            });
        }

        if (!objectType || objectType == SearchObjectTypes.ObjectCategory) {

            return categoryResult;
        }
        if (objectType == SearchObjectTypes.ControlObject || objectType == SearchObjectTypes.ObjectsAndGroups) {

            return this.getObjectsForCategory(categoryResult);
        }
        if (objectType == SearchObjectTypes.Device) {
            let objectResult: SearchResult[] = this.getObjectsForCategory(categoryResult);

            return this.getDeviceForObject(objectResult);
        }

        return [];
    }

    private searchObjectType(searchQuery: string, objectType?: string): SearchResult[] {
        let typesResult: SearchResult[] = [];
        if (searchQuery === this.pipTranslate.translate('GLOBAL_SEARCH_ALL').toLocaleLowerCase()) {
            _.each(this.iqsTypeCollectionsService.getObjectType(), (item: TypeCollectionItem) => {
                typesResult.push({
                    object_type: SearchObjectTypes.ObjectType,
                    item: null,
                    type: item.id
                });
            });
        } else {
            _.each(this.iqsTypeCollectionsService.getObjectType(), (item: TypeCollectionItem) => {
                if (item.name !== undefined && item.name !== null) {
                    if (item.name.toLocaleLowerCase().indexOf(searchQuery) >= 0) {
                        typesResult.push({
                            object_type: SearchObjectTypes.ObjectType,
                            item: null,
                            type: item.id
                        });
                    }
                }
            });
        }

        if (!objectType || objectType == SearchObjectTypes.ObjectType) {

            return typesResult;
        }
        if (objectType == SearchObjectTypes.ControlObject || objectType == SearchObjectTypes.ObjectsAndGroups) {

            return this.getObjectsForType(typesResult);
        }
        if (objectType == SearchObjectTypes.Device) {
            let objectResult: SearchResult[] = this.getObjectsForType(typesResult);

            return this.getDeviceForObject(objectResult);
        }

        return [];
    }

    private searchDeviceType(searchQuery: string, objectType?: string): SearchResult[] {
        let deviceTypeResult: SearchResult[] = [];
        if (searchQuery === this.pipTranslate.translate('GLOBAL_SEARCH_ALL').toLocaleLowerCase()) {
            _.each(this.iqsTypeCollectionsService.getDeviceType(), (item: TypeCollectionItem) => {
                deviceTypeResult.push({
                    object_type: SearchObjectTypes.DeviceType,
                    item: null,
                    type: item.id
                });
            });
        } else {
            _.each(this.iqsTypeCollectionsService.getDeviceType(), (item: TypeCollectionItem) => {
                if (item.name !== undefined && item.name !== null) {
                    if (item.name.toLocaleLowerCase().indexOf(searchQuery) >= 0) {
                        deviceTypeResult.push({
                            object_type: SearchObjectTypes.DeviceType,
                            item: null,
                            type: item.id
                        });
                    }
                }
            });
        }
        if (!objectType || objectType == SearchObjectTypes.DeviceType) {

            return deviceTypeResult;
        }
        if (objectType == SearchObjectTypes.Device) {
            return this.getDeviceForType(deviceTypeResult);
        }
        if (objectType == SearchObjectTypes.ControlObject) {

            let devices: SearchResult[] = this.getDeviceForType(deviceTypeResult);
            return this.getObjectsForDevice(devices);
        }

        return [];
    }

    private searchZoneType(searchQuery: string, objectType?: string): SearchResult[] {
        let zoneTypesResult: SearchResult[] = [];
        if (searchQuery === this.pipTranslate.translate('GLOBAL_SEARCH_ALL').toLocaleLowerCase()) {
            _.each(this.iqsTypeCollectionsService.getZoneType(), (item: TypeCollectionItem) => {
                zoneTypesResult.push({
                    object_type: SearchObjectTypes.ZoneType,
                    item: null,
                    type: item.id
                });
            });
        } else {
            _.each(this.iqsTypeCollectionsService.getZoneType(), (item: TypeCollectionItem) => {
                if (item.name !== undefined && item.name !== null) {
                    if (item.name.toLocaleLowerCase().indexOf(searchQuery) >= 0) {
                        zoneTypesResult.push({
                            object_type: SearchObjectTypes.ZoneType,
                            item: null,
                            type: item.id
                        });
                    }
                }
            });
        }

        if (!objectType || objectType == SearchObjectTypes.ZoneType) {

            return zoneTypesResult;
        }
        if (objectType == SearchObjectTypes.Zone) {

            return this.getZoneForZoneType(zoneTypesResult);
        }
        if (objectType == SearchObjectTypes.ControlObject) {
            let zones: SearchResult[] = this.getZoneForZoneType(zoneTypesResult);

            return this.getObjectsForZone(zones);
        }
        if (objectType == SearchObjectTypes.Location) {

            let zones: SearchResult[] = this.getZoneForZoneType(zoneTypesResult);
            return this.getLocationForZone(zones);
        }
        if (objectType == SearchObjectTypes.Device) {
            let zones: SearchResult[] = this.getZoneForZoneType(zoneTypesResult);
            let objectResult: SearchResult[] = this.getObjectsForZone(zones)

            return this.getDeviceForObject(objectResult);
        }

        return [];
    }

    private searchGeometryZones(searchQuery: string, objectType?: string): SearchResult[] {
        let zoneResult: SearchResult[] = [];
        if (searchQuery === this.pipTranslate.translate('GLOBAL_SEARCH_ALL').toLocaleLowerCase()) {
            _.each(this.zonesGeometryCollection, (item: Zone) => {
                zoneResult.push(this.getSearchResultObject(SearchObjectTypes.Zone, item));
            });
        } else {
            _.each(this.zonesGeometryCollection, (item: Zone) => {
                if (item.name !== undefined && item.name !== null) {
                    if (item.name.toLocaleLowerCase().indexOf(searchQuery) >= 0) {
                        zoneResult.push(this.getSearchResultObject(SearchObjectTypes.Zone, item));
                    }
                }
            });
        }

        if (objectType == SearchObjectTypes.Zone || objectType == SearchObjectTypes.ZoneGeometry) {

            return zoneResult;
        }
        if (objectType == SearchObjectTypes.ControlObject) {

            return this.getObjectsForZone(zoneResult);
        }
        if (objectType == SearchObjectTypes.Location) {

            return this.getLocationForZone(zoneResult);
        }
        if (objectType == SearchObjectTypes.Device) {
            let objectResult: SearchResult[] = this.getObjectsForZone(zoneResult)

            return this.getDeviceForObject(objectResult);
        }

        return [];
    }

    private searchObjectZones(searchQuery: string, objectType?: string): SearchResult[] {
        let zoneResult: SearchResult[] = [];
        if (searchQuery === this.pipTranslate.translate('GLOBAL_SEARCH_ALL').toLocaleLowerCase()) {
            _.each(this.zonesObjectCollection, (item: Zone) => {
                zoneResult.push(this.getSearchResultObject(SearchObjectTypes.Zone, item));
            });
        } else {
            _.each(this.zonesObjectCollection, (item: Zone) => {
                if (item.name !== undefined && item.name !== null) {
                    if (item.name.toLocaleLowerCase().indexOf(searchQuery) >= 0) {
                        zoneResult.push(this.getSearchResultObject(SearchObjectTypes.Zone, item));
                    }
                }
            });
        }

        if (objectType == SearchObjectTypes.Zone || objectType == SearchObjectTypes.ZoneObject) {

            return zoneResult;
        }
        if (objectType == SearchObjectTypes.ControlObject) {

            return this.getObjectsForZone(zoneResult);
        }
        if (objectType == SearchObjectTypes.Location) {

            return this.getLocationForZone(zoneResult);
        }
        if (objectType == SearchObjectTypes.Device) {
            let objectResult: SearchResult[] = this.getObjectsForZone(zoneResult)

            return this.getDeviceForObject(objectResult);
        }

        return [];
    }
    // public search

    public searchObjectsParallel(search: string, objectType: string, successCallback?: (data: SearchResult[]) => void): angular.IPromise<any> {
        if (search === null || search === undefined) {
            throw new Error('Search query is empty!');
        }

        // if (!this._isInit) {
        this.init();
        // }

        let searchQuery: string = search.toLocaleLowerCase();
        let searchResultArray: SearchResult[] = [];
        let deferred = this.$q.defer();

        async.parallel([
            // search into conrol object
            (callback) => {
                if (objectType === SearchObjectTypes.ControlObject || objectType === SearchObjectTypes.Device || objectType === SearchObjectTypes.ObjectsAndGroups) {
                    let searchedArray: SearchResult[] = this.searchObject(searchQuery, objectType);
                    callback(null, searchedArray);
                } else {
                    callback(null, []);
                }
            },
            // search into device
            (callback) => {
                if (objectType === SearchObjectTypes.ControlObject || objectType === SearchObjectTypes.Device) {
                    let searchedArray: SearchResult[] = this.searchDevice(searchQuery, objectType);
                    callback(null, searchedArray);
                } else {
                    callback(null, []);
                }
            },
            // search into location
            (callback) => {
                if (objectType === SearchObjectTypes.Location) {
                    let searchedArray: SearchResult[] = this.searchLocations(searchQuery, objectType);
                    callback(null, searchedArray);
                } else {
                    callback(null, []);
                }
            },
            // search into object group
            (callback) => {
                if (objectType === SearchObjectTypes.ObjectGroup || objectType === SearchObjectTypes.ObjectsAndGroups || objectType === SearchObjectTypes.Device) {
                    let searchedArray: SearchResult[] = this.searchObjectGroup(searchQuery, objectType);
                    callback(null, searchedArray);
                } else {
                    callback(null, []);
                }
            },
            // search into zones
            (callback) => {
                if (objectType == SearchObjectTypes.ControlObject || objectType === SearchObjectTypes.Zone || objectType === SearchObjectTypes.Device) {
                    let searchedArray: SearchResult[] = _.union(this.searchGeometryZones(searchQuery, objectType), this.searchObjectZones(searchQuery, objectType));
                    callback(null, searchedArray);
                } else {
                    callback(null, []);
                }
            },
            // search into zones object
            (callback) => {
                if (objectType === SearchObjectTypes.ZoneObject) {
                    let searchedArray: SearchResult[] = this.searchObjectZones(searchQuery, objectType);
                    callback(null, searchedArray);
                } else {
                    callback(null, []);
                }
            },
            // search into zones Geometry
            (callback) => {
                if (objectType === SearchObjectTypes.ZoneGeometry) {
                    let searchedArray: SearchResult[] = this.searchGeometryZones(searchQuery, objectType);
                    callback(null, searchedArray);
                } else {
                    callback(null, []);
                }
            },
            // search into object category
            (callback) => {
                if (objectType == SearchObjectTypes.ControlObject || objectType === SearchObjectTypes.ObjectCategory || objectType === SearchObjectTypes.Device || objectType === SearchObjectTypes.ObjectsAndGroups) {
                    let searchedArray: SearchResult[] = this.searchObjectCategory(searchQuery, objectType);
                    callback(null, searchedArray);
                } else {
                    callback(null, []);
                }
            },
            // search into device type
            (callback) => {
                if (objectType == SearchObjectTypes.ControlObject || objectType === SearchObjectTypes.Device || objectType === SearchObjectTypes.DeviceType) {
                    let searchedArray: SearchResult[] = this.searchDeviceType(searchQuery, objectType);
                    callback(null, searchedArray);
                } else {
                    callback(null, []);
                }
            },
            // search into zone type
            (callback) => {
                if (objectType == SearchObjectTypes.ControlObject || objectType === SearchObjectTypes.Zone || objectType === SearchObjectTypes.Device
                    || objectType === SearchObjectTypes.ZoneType || objectType === SearchObjectTypes.Location) {
                    let searchedArray: SearchResult[] = this.searchZoneType(searchQuery, objectType);
                    callback(null, searchedArray);
                } else {
                    callback(null, []);
                }
            },
            // search into object type
            (callback) => {
                if (objectType == SearchObjectTypes.ControlObject || objectType === SearchObjectTypes.ObjectType || objectType === SearchObjectTypes.ObjectCategory
                    || objectType === SearchObjectTypes.Device || objectType === SearchObjectTypes.ObjectsAndGroups) {
                    let searchedArray: SearchResult[] = this.searchObjectType(searchQuery, objectType);
                    callback(null, searchedArray);
                } else {
                    callback(null, []);
                }
            }
        ],
            // optional callback
            (error, results) => {
                searchResultArray = _.unionBy(
                    <Array<SearchResult>>results[0],
                    <Array<SearchResult>>results[1],
                    <Array<SearchResult>>results[2],
                    <Array<SearchResult>>results[3],
                    <Array<SearchResult>>results[4],
                    <Array<SearchResult>>results[5],
                    <Array<SearchResult>>results[6],
                    <Array<SearchResult>>results[7],
                    <Array<SearchResult>>results[8],
                    <Array<SearchResult>>results[9],
                    <Array<SearchResult>>results[10],
                    'id'
                );

                deferred.resolve(searchResultArray);

                if (successCallback) {
                    successCallback(searchResultArray);
                }

                return deferred.promise;
            });

        return deferred.promise;
    }

    public clean(): void {
        this._isInit = false;
        this.objectCollection = [];
        this.deviceCollection = [];
        this.locationCollection = [];
        this.objectGroupsCollection = [];
        this.zonesObjectCollection = [];
        this.zonesGeometryCollection = [];
        this.stringObjectCollection = [];
        this.stringDeviceCollection = [];
        this.stringLocationCollection = [];
        this.stringObjectGroupsCollection = [];
        this.stringZonesObjectCollection = [];
        this.stringZonesGeometryCollection = [];
        this.stringObjectCategory = [];
        this.stringDeviceType = [];
        this.stringZoneType = [];
        this.stringObjectType = [];
    }
}

angular.module('iqsGlobalSearch', [
    'iqsTypeCollections.Service',
    'iqsObjects.ViewModel',
    'iqsDevices.ViewModel',
    'iqsLocations.ViewModel',
    'iqsObjectGroups.ViewModel',
    'iqsZones.ViewModel',
])
    .service('iqsGlobalSearch', GlobalSearchService);