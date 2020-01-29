import { States } from '../../common';
import {
    IIncidentsDataService,
    DataPage,
    Incident,
    IncidentActions,
    ControlObject,
    ObjectGroup,
    Location,
    Zone,
    EventRule,
    EventRuleType
} from '../../data';
import {
    ILocationsViewModel,
    IObjectsViewModel,
    IObjectGroupsViewModel,
    ISettingsViewModel,
    IZonesViewModel,
    SettingsUncover
} from '../../models';
import {
    IOrganizationService,
    ITypeCollectionsService,
    TypeCollection
} from '../../services';
import { IEventRulesViewModel } from '../../models/event_rules/IEventRulesViewModel';

class IncidentEventRules {
    [key: string]: string;
}

export class IncidentsModel {
    private _state: string;
    private _isSort: boolean;
    private _filter: any;
    private lastIncidentTime: any = null;
    private currentTimeUpdate: moment.Moment;
    private TAKE_INCIDENT: number = 14;
    private _hideAll: boolean = true;;

    private incident: Incident[];
    private topIncident: Incident[];
    private _selectIndex: number;
    private selectedItem: Incident;
    private transaction: pip.services.Transaction;
    private _selectedId: string;
    private defaultResolution = 'INCIDENT_DEFAULT_RESOLUTION';
    private expectedString = 'INCIDENT_EXPECTED';
    private _mustOpened: Incident;
    private incidentBaseKey: string = 'incident_rules';
    private incidentsEventRules: IncidentEventRules;

    private totalIncident: number;
    private cf: Function[] = [];

    constructor(
        private $log: ng.ILogService,
        private $location: ng.ILocationService,
        private $rootScope: ng.IRootScopeService,
        private $timeout: ng.ITimeoutService,
        private pipToasts: pip.controls.IToastService,
        private pipActions: pip.nav.IActionsService,
        private pipTransaction: pip.services.ITransactionService,
        private pipTranslate: pip.services.ITranslateService,
        private iqsOrganization: IOrganizationService,
        private iqsIncidentsData: IIncidentsDataService,
        private pipMedia: pip.layouts.IMediaService,
        private iqsObjectsViewModel: IObjectsViewModel,
        private iqsObjectGroupsViewModel: IObjectGroupsViewModel,
        private iqsLocationsViewModel: ILocationsViewModel,
        private iqsTypeCollectionsService: ITypeCollectionsService,
        private iqsEventRulesViewModel: IEventRulesViewModel,
        private iqsZonesViewModel: IZonesViewModel,
        private iqsSettingsViewModel: ISettingsViewModel,
        private pipDateFormat: pip.dates.IDateFormatService
    ) {
        "ngInject";
        this.transaction = pipTransaction.create('Incidents');
        this.incident = [];
        this._mustOpened = null;

        let incidentSettings: SettingsUncover[] = this.iqsSettingsViewModel.getSettingsBy(this.incidentBaseKey);
        this.incidentsEventRules = this.getEventRulesIds(incidentSettings);


        this.cf.push(this.$rootScope.$on('iqsLoadingSuccess', () => {
            incidentSettings = this.iqsSettingsViewModel.getSettingsBy(this.incidentBaseKey);
            this.incidentsEventRules = this.getEventRulesIds(incidentSettings);
            this.incident = _.cloneDeep(this.filterIncidentBySettings(this.incident));
            this.topIncident = _.take(this.incident, this.TAKE_INCIDENT);

            this.cf.push(this.$rootScope.$on('iqsSettingsCollectionChange', () => {
                incidentSettings = this.iqsSettingsViewModel.getSettingsBy(this.incidentBaseKey);
                this.incidentsEventRules = this.getEventRulesIds(incidentSettings);
                this.incident = _.cloneDeep(this.filterIncidentBySettings(this.incident));
                this.topIncident = _.take(this.incident, this.TAKE_INCIDENT);
            }));
        }));
    }

    public $onDestroy(): void {
        for (const f of this.cf) { f(); }
    }

    private getEventRulesIds(incidentSettings: SettingsUncover[]): IncidentEventRules {
        let result: IncidentEventRules = {};
        _.each(incidentSettings, (setting: SettingsUncover) => {
            let ruleId: string = setting.key.substring(this.incidentBaseKey.length + 1);
            let rule: EventRule = this.iqsEventRulesViewModel.getEventRuleById(ruleId);
            if (rule) {
                let value = JSON.parse(setting.value, function (key, value) {
                    return value;
                });
                result[ruleId] = value;
            }
        });

        return result;
    }
    // todo show toast if have new incidents

    // private operation
    private updateItemInCollection(item: Incident, reReadCollection?: boolean): boolean {
        let changed: boolean = false;
        // add reference


        // search incident
        let index: number = _.findIndex(this.incident, (incident: Incident) => {
            return incident.id == item.id;
        });

        // insert event without sort
        if (index > -1) {
            // for incident panel 
            // if (!_.isEqual(this.incident[index], item)) {
            //     this.incident[index] = item;
            //     changed = true;
            // }

            // select item if its updated and not reread collection
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
            changed = true;
            this.referenceObject(item);
            this.calcElapsedDate(item);
            if (this._isSort) {
                index = _.findIndex(this.incident, (incident: Incident) => {
                    return moment(incident.time).valueOf() < moment(item.time).valueOf();
                });

                if (index > -1) {
                    this.incident.splice(index, 0, item);
                    this.selectedIndex = index;
                } else {
                    this.incident.push(item);
                    this.selectedIndex = this.incident.length - 1;
                }
            } else {
                this.incident.unshift(item);
                this._selectIndex = 0;
            }

            this.selectItem(this._selectIndex);
        }

        if (!reReadCollection) {
            this.checkLatest(item);
        }

        if (reReadCollection && changed) {
            this.collectionChanged();
        }
        return changed;
    }

    private checkLatest(item: Incident): void {
        if (!item) { return }
        if (!this.lastIncidentTime) { 
            this.openIncident(item);
        
            return 
        }

        let date: moment.Moment = moment(item.time);;
        let lastTimeUpdate: moment.Moment = moment(this.lastIncidentTime)

        let diff = moment.duration(lastTimeUpdate.diff(date));

        if (diff.asSeconds() < 0) {
            this.openIncident(item);
        }
    }

    private openIncident(item: Incident): void {
        if (!item) { return }

        if (this.pipMedia('gt-sm')) {
            this._mustOpened = _.cloneDeep(item);
            this.$rootScope.$broadcast('iqsIncidentsOpen');
        } else {
            this.showToast(item);
        }
    }

    private collectionChanged() {
        this.setState();
        this.totalIncident = this.incident.length;
        this.$timeout(() => {
            this.pipActions.updateCount('global.incidents', this.incidentsCount);
            this.setState();
        }, 0);
    }

    private setState() {
        this.state = (this.incident && this.incident.length > 0) ? States.Data : States.Empty;
    }

    private referenceObject(item: Incident): void {
        item.object = this.iqsObjectsViewModel.getObjectById(item.object_id);
        item.ref_name = item.object ? item.object.name : '';
        item.ref_id = item.object ? item.object.id : '';

        let assignedObject: ControlObject = item.assign_id ? this.iqsObjectsViewModel.getObjectById(item.assign_id) : null;
        item.assigned_name = assignedObject && assignedObject.name ? assignedObject.name : null;
    }

    private onRead(data: Incident[], callback?: (data: Incident[]) => void): void {
        let changed: boolean;

        if (this.incident.length == 0) {
            if (data && data.length > 0) {
                this.incident = this.filterIncidentBySettings(data);
                let id = this._selectedId;
                if (id) {
                    this._selectIndex = _.findIndex(this.incident, (item: Incident) => {
                        return item.id == id;
                    });
                }
                this._selectIndex = this._selectIndex > -1 ? this._selectIndex : 0;
                _.each(this.incident, (item: Incident) => {
                    this.referenceObject(item);
                });
                this.reCalcElapsedDate();
            } else {
                this.incident = [];
                this._selectIndex = -1;
            }
            changed = true;

        } else {
            // todo update collection
            let collection: Incident[] = this.filterIncidentBySettings(data)
            _.each(collection, (item: Incident) => {
                if (this.updateItemInCollection(item, true)) {
                    changed = true;
                }
            });

            let incidentCount: number = this.incident.length;
            this.deleteUnExistItem(this.incident, data);
            if (incidentCount !== this.incident.length) {
                changed = true;
            }
        }

        if (this.incident.length > 0) {
            this.checkLatest(this.incident[0]);
        }

        // todo select
        this.topIncident = _.take(this.incident, this.TAKE_INCIDENT);
        this.selectItem(this._selectIndex);
        this.transaction.end();
        if (changed) {
            this.collectionChanged();
        }

        this.lastIncidentTime = this.incident.length > 0 ? this.incident[0].time : null;
        if (callback) {
            callback(this.incident);
        }
    }

    private deleteUnExistItem(oldCollection: Incident[], newCollection: Incident[]): void {
        // delete 
        let i: number;
        let index: number;
        for (i = 0; i < oldCollection.length; i++) {
            index = _.findIndex(newCollection, { id: oldCollection[i].id });
            if (index === -1) {
                oldCollection.splice(i, 1);
                i--;
            }
        }
    }

    // CRUD operation

    private getFilter(filter?: any): any {
        let _filter: any = _.cloneDeep(this._filter);

        if (!_filter || !angular.isObject(_filter)) {
            _filter = {};
        }

        if (!_filter.org_id && this.iqsOrganization.orgId) {
            _filter.org_id = this.iqsOrganization.orgId
        }

        if (filter) {
            _filter = _.defaults(filter, _filter);
        }

        return _filter;
    }

    public read(successCallback?: (data: Incident[]) => void, errorCallback?: (error: any) => void): angular.IPromise<any> {
        this.transaction.begin('read');
        this.currentTimeUpdate = moment();
        return this.iqsIncidentsData.readIncidents(this.getFilter(),
            (response: DataPage<Incident>) => {
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

    public readOptionaly(filter: any, successCallback?: (data: Incident[]) => void, errorCallback?: (error: any) => void): angular.IPromise<any> {
        this.transaction.begin('read');
        return this.iqsIncidentsData.readIncidents(this.getFilter(filter),
            (response: DataPage<Incident>) => {
                let result: Incident[] = [];
                if (response && response.data && response.data.length > 0) {
                    result = response.data;
                    _.each(result, (item: Incident) => {
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

    public readIncidentsCount(successCallback?: (cnt: number) => void, errorCallback?: (error: any) => void) {
        this.iqsIncidentsData.readIncidentsCount((cnt: number) => {
            this.$timeout(() => {
                this.pipActions.updateCount('global.incidents', cnt);
                if (successCallback) successCallback(cnt);
            }, 0);
        }, errorCallback);
    }

    public readForEvent(eventId: string, successCallback?: (data: any) => void, errorCallback?: (error: any) => void): angular.IPromise<any> {
        this.transaction.begin('read');
        return this.iqsIncidentsData.readIncidents(
            {
                event_id: eventId
            },
            (response: any) => {
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

    public create(Incident: Incident, successCallback?: (data: Incident) => void, errorCallback?: (error: any) => void): void {
        this.transaction.begin('create_event_template');
        this.iqsIncidentsData.createIncident(Incident,
            (data: Incident) => {
                this.state = States.Data;
                this.updateItemInCollection(data);
                if (successCallback) {
                    successCallback(data);
                }
                this.transaction.end();
            },
            (error: any) => {
                this.transaction.end(error);
                this.$log.error('Create event template error: ', JSON.stringify(error));
                if (errorCallback) {
                    errorCallback(error);
                }
            }
        );
    }

    public delete(id: string, successCallback?: () => void, errorCallback?: (error: any) => void): void {
        this.transaction.begin('delete_event_template');

        this.iqsIncidentsData.deleteIncident(id,
            () => {
                this.remove(id);
                if (successCallback) {
                    successCallback();
                }
                this.selectItem();
                this.transaction.end();
            },
            (error: any) => {
                this.transaction.end(error);
                this.$log.error('Delete event template error: ', JSON.stringify(error));
                if (errorCallback) {
                    errorCallback(error);
                }
            }
        );
    }

    public update(id: string, incident: Incident, successCallback?: (data: Incident) => void, errorCallback?: (error: any) => void): void {
        this.transaction.begin('update_event_template');

        this.iqsIncidentsData.updateIncident(id, incident,
            (data: Incident) => {
                this.state = States.Data;
                this.updateItemInCollection(data);
                if (successCallback) {
                    successCallback(data);
                }
                this.transaction.end();
            },
            (error: any) => {
                this.transaction.end(error);
                this.$log.error('Update event template error: ', JSON.stringify(error));
                if (errorCallback) {
                    errorCallback(error);
                }
            }
        );
    }

    // property
    public get total(): number {
        return this.totalIncident;
    }

    public set hideAll(value: boolean) {
        this._hideAll = value;
    }

    public get hideAll(): boolean {
        return this._hideAll;
    }

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

    public get mustOpened(): Incident {
        return this._mustOpened;
    }

    public set mustOpened(incident: Incident) {
        this._mustOpened = _.cloneDeep(incident);
    }

    public set selectedId(value: string) {
        this._selectedId = value;
    }

    public get incidentsCount(): number {
        return this.incident.length;
    }

    // data operation
    public get(): Incident[] {
        return this._hideAll ? this.topIncident : this.incident;
    }

    // data operation
    public getAll(): Incident[] {
        return this.incident;
    }


    public get selectedIndex(): number {
        return this._selectIndex;
    }

    public set selectedIndex(value: number) {
        this._selectIndex = value;
    }

    public getSelectedItem(): Incident {
        return this.selectedItem;
    }

    public getTransaction(): pip.services.Transaction {
        return this.transaction;
    }

    public remove(id: string): void {
        _.remove(this.incident, { id: id });
        _.remove(this.topIncident, { id: id });
        this.topIncident = _.take(this.incident, this.TAKE_INCIDENT);
        this.collectionChanged();
    }

    public reload(successCallback?: (data: Incident[]) => void, errorCallback?: (error: any) => void) {
        this._selectIndex = 0;
        this.incident = new Array();
        this.state = States.Progress;
        this.read(successCallback, errorCallback);
    }

    public get shortIncidentListCount(): number {
        return this.TAKE_INCIDENT;
    }

    public selectItem(index?: number): void {
        let collection: Incident[] = this.hideAll ? this.topIncident : this.incident;
        if (index === undefined || index === null || index >= collection.length || index < 0) {
            if (this._selectIndex !== undefined && this._selectIndex !== null) {
                if (this._selectIndex < collection.length && this._selectIndex > -1) {
                    index = this.selectedIndex;
                } else {
                    if (this._selectIndex >= collection.length) {
                        index = collection.length - 1;
                    } else {
                        index = 0;
                    }
                }
            } else {
                index = 0;
            }
        }

        this._selectIndex = index;
        this.selectedItem = (collection && collection.length > 0) ? collection[index] : undefined;
        if (this.selectedItem) {
            this.$location.search('incident_id', this.selectedItem.id);
        }
    }

    public selectItemById(id: string): void {
        let index: number;
        if (!id) {
            index = 0;
        } else {
            index = _.findIndex(this.incident, { id: id });
            index = index > -1 ? index : 0;
        }

        this.selectItem(index);
    }

    public showToast(item: Incident): void {
        let message: string = item.ref_name ? item.description + ' • ' + item.ref_name : item.description;
        this._mustOpened = null;
        this.pipToasts.showNotification(
            message,
            [IncidentActions.Open, IncidentActions.Hide],
            (result: any) => {
                this._mustOpened = _.cloneDeep(item);
                if (result && result.action == IncidentActions.Open) {
                    this.$rootScope.$broadcast('iqsIncidentsOpen', { incident: item });
                } else {
                    this._mustOpened = null;
                }
            },
            () => {
                this._mustOpened = null;
            },
            item.id
        );
    }

    public getIncidentCount(objectId: string): number {
        let count: number = 0;
        let currDay = new Date();
        let delta: number = 24 * 60 * 60 * 1000; // msec
        _.each(this.incident, (item: Incident) => {
            if (item.object_id == objectId) {
                let incidentDate = moment(item.time);
                if (currDay.getTime() - incidentDate.valueOf() < delta) {
                    count += 1;
                }
            }
        });

        return count;
    }

    public getGroups(object: ControlObject): string {
        if (!object) return '';

        let strGroups: string = '';
        let groups: ObjectGroup[] = this.iqsObjectGroupsViewModel.getCollection();

        _.each(object.group_ids, (id: string) => {
            let group: ObjectGroup = _.find(groups, { id: id });
            if (group && group.name) {
                strGroups = !!strGroups ? strGroups + ', ' + group.name : group.name;
            }
        });

        return strGroups;
    }

    public getLocationName(incident: Incident): string {
        let name: string = ''
        if (incident.loc_id) {
            let location: Location = _.find(this.iqsLocationsViewModel.getCollection(), { id: incident.loc_id });
            if (location) {
                return location.name;
            }
        }

        if (incident.zone_id) {
            let zone: Zone = <Zone>_.find(this.iqsZonesViewModel.zones, { id: incident.zone_id });
            if (zone) {
                return zone.name;
            }
        }

        return null;
    }

    public getIncidentDetails(incident: any): string {
        let details: string = ''
        let rule: EventRule = this.iqsEventRulesViewModel.getEventRuleById(incident.rule_id);
        let value_units: string = incident.value_units
        let expectedString: string = this.expectedString;
        let ruleTypeMeasure: TypeCollection = this.iqsTypeCollectionsService.getEventRuleTypeMeasure();
        let typeCollection: TypeCollection = this.iqsTypeCollectionsService.getEventRuleType();
        let actualValue: number;
        if (rule && ruleTypeMeasure[rule.type] && typeCollection[rule.type]) {
            value_units = this.pipTranslate.translate(ruleTypeMeasure[rule.type].title);
            expectedString = this.pipTranslate.translate(typeCollection[rule.type].shortTitle);
        }
        if (rule) {
            if (incident.actual_value != null) {
                switch (rule.type) {
                    case EventRuleType.MaxSpeed:
                        actualValue = Math.round(incident.actual_value * 100) / 100;
                        break;
                    case EventRuleType.MinSpeed:
                        actualValue = Math.round(incident.actual_value * 100) / 100;
                        break;
                    case EventRuleType.Immobility:
                        actualValue = Math.floor(incident.actual_value);
                        break;
                    case EventRuleType.Presence:
                        actualValue = Math.floor(incident.actual_value);
                        break;
                    default:
                        actualValue = Math.round(incident.actual_value * 100) / 100;
                }
            } else {
                actualValue = null;
            }
        } else {
            actualValue = incident.actual_value != null ? Math.round(incident.actual_value * 100) / 100 : null;
        }

        if (actualValue !== null && actualValue !== undefined && incident.expected_value !== null && incident.expected_value !== undefined) {
            details = actualValue + ' ' + value_units + ' (' +
                this.pipTranslate.translate(expectedString) + ' ' + incident.expected_value + ' ' + value_units + ')';
        } else if (actualValue !== null && actualValue !== undefined) {
            details = actualValue + ' ' + value_units;
        } else if (incident.expected_value !== null && incident.expected_value !== undefined) {
            details = this.pipTranslate.translate(expectedString) + ' ' + incident.expected_value + ' ' + value_units;
        }
        return details;
    }

    public clean(): void {
        this.incident = [];
        this._selectIndex = -1;
        this.selectedItem = null;
        this._selectedId = null;
        this.state = States.Empty;
    }

    private filterIncidentBySettings(data: Incident[]): Incident[] {
        let incidents: Incident[] = _.filter(data, (item: Incident) => {
            let settingEventRule = this.incidentsEventRules[item.rule_id];

            if (settingEventRule) {
                if (settingEventRule['enabled']) {
                    if (item.group_id && settingEventRule['exclude_group_ids'] && settingEventRule['exclude_group_ids'].length > 0) {
                        if (settingEventRule['exclude_group_ids'].indexOf(item.group_id)) {
                            return false;
                        }
                    }
                    if (item.object_id && settingEventRule['exclude_object_ids'] && settingEventRule['exclude_object_ids'].length > 0) {
                        if (settingEventRule['exclude_object_ids'].indexOf(item.object_id)) {
                            return false;
                        }
                    }
                    if (item.group_id && settingEventRule['include_group_ids'] && settingEventRule['include_group_ids'].length > 0) {
                        if (settingEventRule['include_group_ids'].indexOf(item.group_id)) {
                            return true;
                        } else {
                            return false;
                        }
                    }
                    if (item.object_id && settingEventRule['include_object_ids'] && settingEventRule['include_object_ids'].length > 0) {
                        if (settingEventRule['include_object_ids'].indexOf(item.object_id)) {
                            return true;
                        } else {
                            return false;
                        }
                    }

                    return true;
                } else {
                    if (item.group_id && settingEventRule['exclude_group_ids'] && settingEventRule['exclude_group_ids'].length > 0) {
                        if (settingEventRule['exclude_group_ids'].indexOf(item.group_id)) {
                            return true;
                        }
                    }
                    if (item.object_id && settingEventRule['exclude_object_ids'] && settingEventRule['exclude_object_ids'].length > 0) {
                        if (settingEventRule['exclude_object_ids'].indexOf(item.object_id)) {
                            return true;
                        }
                    }
                    if (item.group_id && settingEventRule['include_group_ids'] && settingEventRule['include_group_ids'].length > 0) {
                        if (settingEventRule['include_group_ids'].indexOf(item.group_id)) {
                            return false;
                        } else {
                            return true;
                        }
                    }
                    if (item.object_id && settingEventRule['include_object_ids'] && settingEventRule['include_object_ids'].length > 0) {
                        if (settingEventRule['include_object_ids'].indexOf(item.object_id)) {
                            return false;
                        } else {
                            return true;
                        }
                    }

                    return false;
                }
            } else {
                return true;
            }
        });

        return incidents;
    }

    public reCalcElapsedDate(): void {
        let start: moment.Moment = moment();

        _.each(this.incident, (item: Incident) => {
            item.timeString = this.pipDateFormat.formatMiddleElapsed(item.time, null, start);
        });
    }

    private calcElapsedDate(item): void {
        if (!item || !item.time) return;

        let start: moment.Moment = moment();
        item.timeString = this.pipDateFormat.formatMiddleElapsed(item.time, null, start);
    }
}