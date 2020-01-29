import '../zones/ZonesViewModel';

import { States } from '../../common';
import {
    Account,
    ControlObject,
    DataPage,
    EventRule,
    Incident,
    Location,
    ObjectGroup,
    OperationalEvent,
    OperationalEventType,
    Zone,
    IOperationalEventsDataService,
} from '../../data';
import {
    IAccountsViewModel,
    IEventRulesViewModel,
    IIncidentsViewModel,
    ILocationsViewModel,
    IObjectGroupsViewModel,
    IObjectsViewModel,
    IZonesViewModel,
    AssocietedObject
} from '../../models';
import { IOrganizationService, SearchObjectTypes } from '../../services';

export class OperationalEventsModel {
    private _state: string;
    private _filter: any;
    private _isSort: boolean;
    private _selectAllow: boolean;
    private expectedString = 'OPERATIONAL_EVENT_EXPECTED';

    private operationalEvents: OperationalEvent[];
    private operationalEventsFiltered: OperationalEvent[];
    private localFilters: any = null; // todo
    private _search: string = null; // todo

    private _selectIndex: number;
    private selectedItem: OperationalEvent;
    private transaction: pip.services.Transaction;
    private _selectedIndex: number;
    private _timeInterval: number = 24; // hours
    private _take: number = 100;

    private _defaultCollection: string[];
    private _searchedCollection: string[];

    constructor(
        private $log: ng.ILogService,
        private $location: ng.ILocationService,
        private $timeout: ng.ITimeoutService,
        private pipToasts: pip.controls.IToastService,
        private pipTransaction: pip.services.ITransactionService,
        private pipTranslate: pip.services.ITranslateService,
        private iqsOrganization: IOrganizationService,
        private iqsOperationalEventsData: IOperationalEventsDataService,
        private iqsObjectsViewModel: IObjectsViewModel,
        private iqsZonesViewModel: IZonesViewModel,
        private iqsLocationsViewModel: ILocationsViewModel,
        private iqsIncidentsViewModel: IIncidentsViewModel,
        private iqsObjectGroupsViewModel: IObjectGroupsViewModel,
        private pipDateFormat: pip.dates.IDateFormatService,
        private iqsAccountsViewModel: IAccountsViewModel,
        private iqsEventRulesViewModel: IEventRulesViewModel,
    ) {
        "ngInject";

        this.transaction = pipTransaction.create('Operational_Event');
        this.operationalEvents = [];
        this.operationalEventsFiltered = [];
    }

    private isEqual(oldObj: OperationalEvent, newObj: OperationalEvent): boolean {
        let isEqual: boolean = true;

        _.each(newObj, (value: any, key: string) => {
            if (!_.isObject(newObj[key])) {
                if (oldObj[key] === undefined || oldObj[key] !== newObj[key]) {
                    isEqual = false;
                }
            }
        });

        return isEqual;
    }

    // private operation
    private updateItemInCollection(item: OperationalEvent, reReadCollection?: boolean): boolean {
        let changed: boolean = false;
        this.referenceObject(item);

        let index: number = _.findIndex(this.operationalEvents, (ev) => {
            return ev.id == item.id;
        });

        // insert event without sort
        if (index > -1) {
            if (this.isEqual(this.operationalEvents[index], item)) {

                this.operationalEvents[index] = item;
                changed = true;
            }

            if (!reReadCollection) {
                if (this.selectedItem) {
                    if (this.selectedItem.id != item.id) {
                        this.selectItem(0);
                    }
                } else {
                    this.selectItem(index);
                }
            }
        } else {
            this.calcElapsedDate(item);
            changed = true;
            if (this._isSort) {
                index = _.findIndex(this.operationalEvents, (ev) => {
                    return new Date(ev.time).getTime() < new Date(item.time).getTime();
                });

                if (index > -1) {
                    this.operationalEvents.splice(index, 0, item);
                } else {
                    this.operationalEvents.unshift(item);
                }
            } else {
                this.operationalEvents.unshift(item);
            }

            // this.getFiltered();
            // if (reReadCollection && this.selectedItem && this.selectedItem.id) {
            //     index = _.findIndex(this.operationalEventsFiltered, (ev) => {
            //         return ev.id == this.selectedItem.id;
            //     });
            // } else {
            //     index = _.findIndex(this.operationalEventsFiltered, (ev) => {
            //         return ev.id == item.id;
            //     });
            // }

            // this.selectItem(index);
            if (!reReadCollection) {
                this.applyFilter();
            }
            // this.selectItem();
        }

        if (reReadCollection && changed) {
            this.collectionChanged();
        }

        return changed;
    }

    private collectionChanged() {
        this.$timeout(() => {
            this.setState();
        }, 0);
    }

    private setState() {
        this.state = (this.operationalEventsFiltered && this.operationalEventsFiltered.length > 0) ? States.Data : States.Empty;
    }

    private onRead(isReload: boolean, data: OperationalEvent[], callback?: (data: OperationalEvent[]) => void): void {
        let changed: boolean;
        let index: number = null;
        let operationalEvents: OperationalEvent[] = new Array();
        if (this.operationalEvents.length == 0 || isReload) {
            if (data && data.length > 0) {
                if (this._isSort) {
                    operationalEvents = _.sortBy(data, function (item: OperationalEvent) {
                        return - new Date(item.time).getTime();
                    });
                } else {
                    operationalEvents = data;
                }

                _.each(operationalEvents, (item: OperationalEvent) => {
                    this.referenceObject(item);
                });
                this.reCalcElapsedDate(operationalEvents);

            } else {
                operationalEvents = [];
                index = -1;
            }
            changed = true;

            this.operationalEvents = operationalEvents;
            this.applyFilter();
        } else {
            _.each(data, (item: OperationalEvent) => {
                if (this.updateItemInCollection(item, true)) {
                    changed = true;
                }
            });

            // remove depricate item
            let i: number;
            let n: number = this.operationalEvents.length;
            for (i = 0; i < n; i++) {
                let j = _.findIndex(data, { id: this.operationalEvents[i].id });
                if (j == -1) {
                    this.operationalEvents.splice(i, 1);
                    n -= 1;
                }
            }
            this.applyFilter();
            this.reCalcElapsedDate();
        }

        this.selectItem(index);

        this.transaction.end();
        if (changed) {
            this.collectionChanged();
        }
        if (callback) {
            callback(this.operationalEvents);
        }
    }

    // CRUD operation

    private getFilter(filter?: any): any {
        let _filter: any = _.cloneDeep(this._filter);

        if (!_filter || !angular.isObject(_filter)) {
            _filter = {};
        }

        if (filter) _filter = _.assign(_filter, filter);

        if (!_filter.org_id && this.iqsOrganization.orgId) {
            _filter.org_id = this.iqsOrganization.orgId
        }

        if (!_filter.type) {
            _filter.types = OperationalEventType.AutoRecord + ',' + OperationalEventType.ManualRecord + ',' + OperationalEventType.Incident;
        }

        if (!_filter.take) {
            _filter.take = this.take
        }

        if (this.search) {
            let object_id: string = this.iqsObjectsViewModel.getObjectByName(this.search)
            if (object_id) {
                _filter.object_id = object_id;
            } else {
                _filter.search = this.search;
            }
        }

        return _filter;
    }

    public readOptionaly(filter: any, successCallback?: (data: OperationalEvent[]) => void, errorCallback?: (error: any) => void): angular.IPromise<any> {
        this.transaction.begin('read');

        return this.iqsOperationalEventsData.readOperationalEvents(this.getFilter(filter),
            (response: DataPage<OperationalEvent>) => {
                let result: OperationalEvent[] = [];
                if (response && response.data && response.data.length > 0) {
                    result = response.data;
                    _.each(result, (item: OperationalEvent) => {
                        this.referenceObject(item);
                    });
                }
                if (successCallback) {
                    successCallback(result);
                }
                this.transaction.end();
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

    public read(isReload?: boolean, successCallback?: (data: OperationalEvent[]) => void, errorCallback?: (error: any) => void): angular.IPromise<any> {
        isReload = isReload === undefined || isReload === null ? false : isReload;

        this._defaultCollection = this.getDefaultCollection();
        this._searchedCollection = this.getSearchedCollection();
        if (isReload) this.state = States.Progress;

        this.transaction.begin('read');
        return this.iqsOperationalEventsData.readOperationalEvents(this.getFilter(),
            (response: DataPage<OperationalEvent>) => {
                this.onRead(isReload, response.data, successCallback);
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

    public create(operationalEvent: OperationalEvent, successCallback?: (data: OperationalEvent) => void, errorCallback?: (error: any) => void): void {
        this.transaction.begin('create_operational_event');
        this.iqsOperationalEventsData.createOperationalEvent(operationalEvent,
            (data: OperationalEvent) => {
                // this.state = States.Data;
                let nowDate: moment.Moment = moment().utc();
                let eventDate: moment.Moment = moment(data.time).utc();
                let diff = moment.duration(nowDate.diff(eventDate));
                if (diff.asHours() > this.timeInterval) {
                    // show toast
                    this.pipToasts.showNotification(this.pipTranslate.translate('OPERATIONAL_EVENT') + ': "' +
                        data.description + '" ' + this.pipTranslate.translate('OPERATIONAL_EVENT_ADD_TO_HISTORY'),
                        ['ok'], () => { }, () => { }, '');
                } else {
                    this.updateItemInCollection(data);
                }

                if (successCallback) {
                    successCallback(data);
                }
                this.transaction.end();
            },
            (error: any) => {
                this.transaction.end(error);
                this.$log.error('Create operational event error: ', JSON.stringify(error));
                if (errorCallback) {
                    errorCallback(error);
                }
            }
        );
    }

    public delete(id: string, successCallback?: () => void, errorCallback?: (error: any) => void): void {
        this.transaction.begin('delete_operational_event');
        let index: number;
        if (this.selectedItem && this.selectedItem.id == id) {
            index = this._selectIndex < this.operationalEventsFiltered.length - 1 ? this._selectIndex : this._selectIndex - 1;
        } else {
            index = this._selectIndex;
        }

        this.iqsOperationalEventsData.deleteOperationalEvent(id,
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
                this.$log.error('Delete operational event error: ', JSON.stringify(error));
                if (errorCallback) {
                    errorCallback(error);
                }
            }
        );
    }

    // property
    public get isSort(): boolean {
        return this._isSort;
    }

    public set isSort(value: boolean) {
        this._isSort = value;
    }

    public get state(): string {
        return this._state;
    }

    public set state(value: string) {
        if (value) {
            this._state = value;
        }
    }

    public get selectAllow(): boolean {
        return this._selectAllow;
    }

    public set selectAllow(value: boolean) {
        if (!!value) {
            this._selectAllow = value;
        }
    }

    public get search(): string {
        return this._search;
    }

    public set search(value: string) {
        this._search = value;
    }

    public set filter(value: any) {
        this._filter = value;
    }

    public get filter(): any {
        return this._filter;
    }

    private getOperationalEventDetails(item: OperationalEvent): string {
        let details: string = ''

        if (item.actual_value !== null && item.actual_value !== undefined && item.expected_value !== null && item.expected_value !== undefined) {
            details = details + item.actual_value + ' ' + item.value_units + ' (' +
                this.pipTranslate.translate(this.expectedString) + ' ' + item.expected_value + ' ' + item.value_units + ')';
        } else if (item.actual_value !== null && item.actual_value !== undefined) {
            details = details + item.actual_value + ' ' + item.value_units;
        } else if (item.expected_value !== null && item.expected_value !== undefined) {
            details = this.pipTranslate.translate(this.expectedString) + ' ' + item.expected_value + ' ' + item.value_units;
        }

        return details;
    }

    private getAccountName(accountId: string): string {
        if (!accountId) return;

        const account: Account = this.iqsAccountsViewModel.getAccountById(accountId);

        return account ? account.name : '';
    }

    public referenceDetails(item: OperationalEvent): void {
        let zone: Zone;
        let location: Location;
        let object: ControlObject;

        if (item.object_id) {
            object = this.iqsObjectsViewModel.getObjectById(item.object_id);
        }
        if (item.zone_id) {
            zone = _.find(this.iqsZonesViewModel.zones, { id: item.zone_id });
        }
        if (item.loc_id) {
            location = _.find(this.iqsLocationsViewModel.getCollection(), { id: item.loc_id });;
        }

        item.eventValue = this.iqsIncidentsViewModel.getIncidentDetails(item)
        if (location) {
            item.ref.locationName = location.name;
        } else if (zone) {
            item.ref.locationName = zone.name;
        }

        if (item.pos && item.pos.coordinates) {
            item.ref.latitude = item.pos.coordinates[1];
            item.ref.longitude = item.pos.coordinates[0];
        } else if (location && location.pos && (location.pos.coordinates || (location.pos.latitude && location.pos.longitude))) {
            item.ref.latitude = location.pos ? location.pos.latitude || location.pos.coordinates[1] : null;
            item.ref.longitude = location.pos ? location.pos.longitude || location.pos.coordinates[0] : null;
        } else if (zone && zone.center) {
            item.ref.latitude = zone.center.latitude;
            item.ref.longitude = zone.center.longitude;
        }

        if (item.type == OperationalEventType.Incident) {
            item.ref.incidentValue = this.iqsIncidentsViewModel.getIncidentDetails(item);
            if (object) {
                item.ref.ref_groups = this.iqsIncidentsViewModel.getGroups(object)
            }
        }
        let assignedObject: ControlObject = item.assign_id ? this.iqsObjectsViewModel.getObjectById(item.assign_id) : null;
        item.ref.assigned_name = assignedObject && assignedObject.name ? assignedObject.name : null;
    }

    private referenceObject(item: OperationalEvent): void {
        item.ref = {};
        let object: ControlObject;
        let group: ObjectGroup;

        let name: string;

        if (item.object_id) {
            object = this.iqsObjectsViewModel.getObjectById(item.object_id);
        }
        if (item.group_id) {
            group = this.iqsObjectGroupsViewModel.getGroupById(item.group_id);
        }
        item.ref.event_id = item.id;

        if (object) {
            item.ref.item = object;
            item.ref.name = object.name;
            item.ref.id = object.id;
            item.ref.description = object.description;
            item.ref.type = object.type;
            item.ref.object_type = SearchObjectTypes.ControlObject;
        }
        if (group) {
            item.ref.item = group;
            item.ref.name = group.name;
            item.ref.id = group.id;
            item.ref.description = null;
            item.ref.type = null;
            item.ref.object_type = SearchObjectTypes.ObjectGroup;
        }
        if (item.type == OperationalEventType.ManualRecord) {
            item.ref.accountName = this.getAccountName(item.creator_id);
        }
    }

    private getFiltered(localFilter?: AssocietedObject): OperationalEvent[] {
        let filtered: boolean = false;
        let filteredCollection: OperationalEvent[] = [];
        let searchedCollection: OperationalEvent[] = [];

        // not filtered, return all collection
        if (!localFilter) {
            this.localFilters = null;
            this.operationalEventsFiltered = this.operationalEvents;
            this.selectItem();

            return this.operationalEventsFiltered;
        }

        if ((localFilter && !_.isEqual(localFilter, this.localFilters))) {
            if (localFilter) {
                filteredCollection = _.filter(this.operationalEvents, (item: OperationalEvent) => {
                    let result: boolean = true;
                    for (let k in localFilter) {
                        if (localFilter.hasOwnProperty(k)) {
                            result = item[k] == localFilter[k];
                        }
                        if (!result) return false;
                    }

                    return result;
                });

                this.localFilters = localFilter;
                filtered = true;
            } else {
                filteredCollection = this.operationalEvents;
            }

            this.operationalEventsFiltered = filteredCollection;
            this.selectItem();
        }
        this.setState();
        return this.operationalEventsFiltered;
    }

    public get(): OperationalEvent[] {
        return this.operationalEventsFiltered
    }

    // data operation
    public applyFilter(localFilter?: AssocietedObject): OperationalEvent[] {
        let result = this.getFiltered(localFilter);

        return result;
    }

    public get timeInterval(): number {
        return this._timeInterval;
    }

    public get take(): number {
        return this._take;
    }

    public get defaultCollection(): string[] {
        return this._defaultCollection;
    }

    public get searchedCollection(): string[] {
        return this._searchedCollection;
    }

    public get selectedIndex(): number {
        return this._selectIndex;
    }

    public getSelectedItem(): OperationalEvent {
        return this.selectedItem;
    }

    public getTransaction(): pip.services.Transaction {
        return this.transaction;
    }

    public remove(id: string): void {
        _.remove(this.operationalEvents, { id: id });
        _.remove(this.operationalEventsFiltered, { id: id });

        this.collectionChanged();
    }

    public reload(successCallback?: (data: OperationalEvent[]) => void, errorCallback?: (error: any) => void) {
        this.operationalEvents = new Array();
        this.operationalEventsFiltered = new Array();
        this.state = States.Progress;
        this.read(false, successCallback, errorCallback);
    }

    public selectItem(index?: number): void {
        if (!this._selectAllow || this.operationalEventsFiltered.length == 0) {
            this._selectIndex = null;
            this.selectedItem = null;
            this.setState();

            return;
        }

        if (index === undefined || index === null || index < 0 || index > this.operationalEventsFiltered.length - 1) {
            if (this.$location.search()['event_id']) {
                index = _.findIndex(this.operationalEventsFiltered, (item: OperationalEvent) => {
                    return item.id == this.$location.search()['event_id'];
                });
            }
            if (!index || index == -1) {
                index = 0;
            }
        }

        this._selectIndex = index;

        this.selectedItem = (this.operationalEventsFiltered && this.operationalEventsFiltered.length > 0) ? this.operationalEventsFiltered[index] : undefined;
        if (this.selectedItem) {
            this.$location.search('event_id', this.selectedItem.id);
        }
    }

    public clean(): void {
        this.operationalEvents = [];
        this.operationalEventsFiltered = [];
        this._selectIndex = -1;
        this._selectedIndex = -1;
        this.selectedItem = null;
        this.state = States.Empty;
    }

    public reCalcElapsedDate(collection?: OperationalEvent[]): void {
        let start: moment.Moment = moment();
        if (collection) {
            _.each(collection, (item: OperationalEvent) => {
                item.timeString = this.pipDateFormat.formatMiddleElapsed(item.time, null, start);
            });
        } else {
            _.each(this.operationalEvents, (item: Incident) => {
                item.timeString = this.pipDateFormat.formatMiddleElapsed(item.time, null, start);
            });

            _.each(this.operationalEventsFiltered, (item: Incident) => {
                item.timeString = this.pipDateFormat.formatMiddleElapsed(item.time, null, start);
            });
        }
    }

    private calcElapsedDate(item): void {
        if (!item || !item.time) return;

        let start: moment.Moment = moment();
        item.timeString = this.pipDateFormat.formatMiddleElapsed(item.time, null, start);
    }

    public addReferences(collection: OperationalEvent[]): OperationalEvent[] {
        _.each(collection, (item: OperationalEvent) => {
            this.referenceObject(item);
        })

        return collection;
    }

    public readRefEvent(eventId: string, successCallback?: (data: any) => void, errorCallback?: (error: any) => void): angular.IPromise<any> {
        this.transaction.begin('read');
        return this.iqsOperationalEventsData.readOperationalEvents(
            {
                ref_event_id: eventId
            },
            (response: DataPage<OperationalEvent>) => {
                if (successCallback) {
                    successCallback(response);
                }
                this.transaction.end();
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

    private getSearchedCollection(): string[] {
        let collection: string[] = [];

        _.each(this.iqsEventRulesViewModel.getCollection(), (item: EventRule) => {
            if (item.name) {
                collection.push(item.name.toLocaleLowerCase())
            }
        });

        _.each(this.iqsObjectsViewModel.allObjects, (item: ControlObject) => {
            if (item.name) {
                collection.push(item.name.toLocaleLowerCase())
            }
        });

        collection = _.sortBy(_.uniqBy(collection,
            (s) => {
                return s;
            }),
            (s) => {
                return s;
            });

        return collection;
    }

    private getDefaultCollection(): string[] {
        let collection: string[] = [];
        _.each(this.iqsObjectsViewModel.allObjects, (item: ControlObject) => {
            if (item.name) {
                collection.push(item.name.toLocaleLowerCase())
            }
        });

        collection = _.sortBy(collection,
            (s) => {
                return s;
            });

        return collection;
    }

}