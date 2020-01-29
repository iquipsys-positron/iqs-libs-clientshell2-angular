import { ITypeCollectionsService, TypeCollectionItem } from '../../../services/type_collections';
import { IStatisticsDateService } from '../../../services/statistics/IStatisticsDateService';
import { DatePeriods } from './DatePeriods';
import { IObjectsViewModel } from '../../../models/objects/IObjectsViewModel';
import { IEventRulesViewModel } from '../../../models/event_rules/IEventRulesViewModel';
import { IZonesViewModel } from '../../../models/zones/IZonesViewModel';
import { IDevicesViewModel } from '../../../models/devices/IDevicesViewModel';
import { IObjectGroupsViewModel } from '../../../models/object_groups/IObjectGroupsViewModel';
import { IShiftsViewModel } from '../../../models/shifts/IShiftsViewModel';
import { SearchObjectTypes } from '../../../services/global_search/SearchObjectTypes';
import { StatisticsFilterResult } from './StatisticsFilterResult';
import { StatisticsFilterValues } from './StatisticsFilterValues';
import { StatisticsFilterVisibility } from './StatisticsFilterVisibility';
import { DatePeriodValues } from './DatePeriodValues';
import { StatisticsParams } from './StatisticsParams';
import { IFilterDialogService } from './dialog/IFilterDialogService';
import { StatisticsDataCollectionItem } from './StatisticsDataCollectionItem';
import { IStatisticsCollectionsService } from './IStatisticsCollectionsService';
import { LoadingCompleteEvent } from '../../../services/loading';

class StatisticsFilterParams {
    public params: StatisticsFilterResult;
}

interface IStatisticsFilterPanelBindings {
    [key: string]: any;

    ngDisabled: any;
    startDate: any;
    datePeriodType: any;
    dateLabel: any;
    filterValues: any;
    filterVisibility: any;
    onStatisticsRefresh: any;
    intervalLimited: any;
    intervalMaxTimeDiff: any;
}

const StatisticsFilterPanelBindings: IStatisticsFilterPanelBindings = {

    ngDisabled: '<?',
    startDate: '<iqsStartDate',
    datePeriodType: '<iqsDatePeriodType',
    dateLabel: '<?iqsDateLabel',
    filterValues: '<iqsFilterValues',
    filterVisibility: '<iqsFilterVisibility',
    onStatisticsRefresh: '&iqsStatisticsRefresh',
    intervalLimited: '<?iqsIntervalLimited',
    intervalMaxTimeDiff: '<?iqsIntevalMaxTimeDiff'
}

class StatisticsFilterPanelChanges implements ng.IOnChangesObject, IStatisticsFilterPanelBindings {
    [key: string]: ng.IChangesObject<any>;

    ngDisabled: ng.IChangesObject<boolean>;
    startDate: ng.IChangesObject<Date>;
    datePeriodType: ng.IChangesObject<string>;
    dateLabel: ng.IChangesObject<string>;
    filterValues: ng.IChangesObject<StatisticsFilterValues>;
    filterVisibility: ng.IChangesObject<StatisticsFilterVisibility>;
    onStatisticsRefresh: ng.IChangesObject<() => ng.IPromise<void>>;
    intervalLimited: ng.IChangesObject<boolean>;
    intervalMaxTimeDiff: ng.IChangesObject<Number>;
}

class StatisticsFilterPanelController implements ng.IController {
    public ngDisabled: boolean;

    public allId: string = 'all';

    public ruleFilter: string;
    public rulesCollection: StatisticsDataCollectionItem[];

    public objectFilter: string;
    public objectsCollection: StatisticsDataCollectionItem[];

    public deviceFilter: string;
    public devicesCollection: StatisticsDataCollectionItem[];

    public zoneFilter: string;
    public zonesCollection: StatisticsDataCollectionItem[];

    public datePeriod: string; // yearly, daily, weekly, monthly

    public dateFilters: DatePeriods[];

    public shiftFilter: string;
    public shiftsCollection: StatisticsDataCollectionItem[];

    public ruleAction: string;
    public paramsFilter: string;
    public ruleActionsCollection: StatisticsDataCollectionItem[];
    public paramsCollection: StatisticsDataCollectionItem[];

    private timeDiff: number = 8 * 60 * 60 * 1000;
    private intervalLimited: boolean;
    private defaultMaxTimeDiff: number = 24 * 60 * 60 * 1000;
    private intervalMaxTimeDiff: number;

    // public dailyDate: Date;
    // public weeklyDate: Date;
    // public monthlyDate: Date;
    // public yearlyDate: number;
    // public yearsCollection: number[];

    public isZoneFilter: boolean;
    public isObjectFilter: boolean;
    public isActionFilter: boolean;
    public isEventRuleFilter: boolean;
    public isDatePeriod: boolean;
    public isParamsFilter: boolean;
    public isDeviceFilter: boolean | number;

    public startDate: Date;
    public endDate: Date;
    public currDate: Date;
    public datePeriodType: string;
    public dateLabel: string;
    public filterValues: StatisticsFilterValues;
    public filterVisibility: StatisticsFilterVisibility;

    public openDatePicker: boolean;

    public onStatisticsRefresh: (value: StatisticsFilterParams) => void;

    public nowDate: Date;
    private filterChange: Function;
    private storeFormatDate: Function;
    private cf: Function[] = [];

    constructor(
        private $rootScope: ng.IRootScopeService,
        private $element: JQuery,
        public pipMedia: pip.layouts.IMediaService,
        private pipTranslate: pip.services.ITranslateService,
        private pipDateConvert: pip.dates.IDateConvertService,
        private iqsEventRulesViewModel: IEventRulesViewModel,
        private iqsObjectsViewModel: IObjectsViewModel,
        private iqsObjectGroupsViewModel: IObjectGroupsViewModel,
        private iqsZonesViewModel: IZonesViewModel,
        private iqsDevicesViewModel: IDevicesViewModel,
        private iqsShiftsViewModel: IShiftsViewModel,
        private iqsTypeCollectionsService: ITypeCollectionsService,
        private pipDateFormat: pip.dates.IDateFormatService,
        private $mdDateLocale,
        private iqsFilterDialog: IFilterDialogService,
        private pipToasts: pip.controls.IToastService,
        private iqsStatisticsCollectionsService: IStatisticsCollectionsService,
        private iqsStatisticsDateService: IStatisticsDateService
    ) {
        $element.addClass('iqs-statistics-filter-panel');

        this.storeFormatDate = $mdDateLocale.formatDate;
        this.nowDate = new Date();
        this.filterChange = _.debounce(() => {
            this.onStatisticsRefresh({ params: this.getStatisticsParams() });
        }, 500);
        this.cf.push($rootScope.$on(LoadingCompleteEvent, () => {
            this.prepare();
        }));
        if (!this.intervalMaxTimeDiff) this.intervalMaxTimeDiff = this.defaultMaxTimeDiff;
    }

    public $onDestroy(): void {
        this.$mdDateLocale.formatDate = this.storeFormatDate;
        for (const f of this.cf) { f(); }
    }

    public $onChanges(changes: StatisticsFilterPanelChanges): void {
        if (changes.filterValues) {

            if (this.filterValues.ruleValue != this.ruleFilter ||
                this.filterValues.objectValue != this.objectFilter ||
                this.filterValues.zoneValue != this.zoneFilter ||
                this.filterValues.deviceValue != this.deviceFilter ||
                this.filterValues.actionEventRuleValue != this.ruleAction ||
                this.filterValues.paramsValue != this.paramsFilter) {
                this.prepare();
            }
        }
    }

    public $onInit(): void {
        this.prepare();
    }

    private setDate() {
        switch (this.datePeriod) {
            // case DatePeriodValues.Daily:
            //     this.$mdDateLocale.formatDate = (date) => {
            //         var m = moment(date);
            //         return m.isValid() ? m.format('ll') : '';
            //     }
            //     break;
            // case DatePeriodValues.Weekly:
            //     this.$mdDateLocale.formatDate = (date) => {
            //         var m = moment(date);
            //         return m.isValid() ? m.format('ll') : '';
            //     }
            //     break;
            case DatePeriodValues.Monthly:
                this.$mdDateLocale.formatDate = (date) => {
                    var m = moment(date);
                    return m.isValid() ? this.pipDateFormat.formatLongMonth(date) + ' ' + this.pipDateFormat.formatYear(date) : '';
                }
                break;
            case DatePeriodValues.Yearly:
                this.$mdDateLocale.formatDate = (date) => {
                    var m = moment(date);
                    return m.isValid() ? this.pipDateFormat.formatYear(date) : '';
                }
                break;
            default:
                this.$mdDateLocale.formatDate = (date) => {
                    var m = moment(date);
                    return m.isValid() ? m.format('ll') : '';
                }
                break;
        }

        switch (this.datePeriod) {
            case DatePeriodValues.Daily:
                this.startDate = this.pipDateConvert.toStartDay(this.currDate);
                break;
            case DatePeriodValues.Weekly:
                this.startDate = this.pipDateConvert.toStartWeek(this.currDate);
                break;
            case DatePeriodValues.Monthly:
                this.startDate = this.pipDateConvert.toStartMonth(this.currDate);
                break;
            case DatePeriodValues.Yearly:
                this.startDate = this.pipDateConvert.toStartYear(this.currDate);
                break;
            case DatePeriodValues.Range:
                this.startDate = moment(this.startDate).startOf('hour').toDate();
                this.endDate = moment(this.endDate).startOf('hours').toDate();
                if (this.startDate.getTime() >= this.endDate.getTime()) {
                    this.endDate = moment(this.startDate.getTime() + this.timeDiff).toDate();
                }
                break;
            case DatePeriodValues.Shift:
                this.startDate = this.pipDateConvert.toStartDay(this.currDate);
                this.endDate = moment(this.startDate).toDate();
                this.endDate.setHours(this.endDate.getHours() + (this.timeDiff / (60 * 60 * 1000)));
                break;
            default:
                this.startDate = this.pipDateConvert.toStartDay(this.currDate);
                break;
        }
    }

    private prepare() {
        this.prepareCollections();
        this.setFilter();

        if (!this.startDate) {
            this.startDate = <Date>this.iqsStatisticsDateService.getStartDate();
        }
        if (!this.endDate) {
            this.endDate = <Date>this.iqsStatisticsDateService.getEndDate();
        }
        this.currDate = _.cloneDeep(this.startDate);
        if (!this.datePeriodType) {
            this.datePeriodType = DatePeriodValues.Daily;
        }

        let index: number = _.findIndex(this.dateFilters, { id: this.datePeriodType });
        this.datePeriod = index > -1 ? this.dateFilters[index].id : this.dateFilters[0].id;
        this.datePeriodType = this.datePeriod;
        this.paramsFilter = StatisticsParams.allParams;
        this.setDate();

        if (this.filterValues) {
            this.ruleFilter = this.filterValues.ruleValue !== undefined && this.filterValues.ruleValue !== null ? this.filterValues.ruleValue : 'all';
            this.objectFilter = this.filterValues.objectValue !== undefined && this.filterValues.objectValue !== null ? this.filterValues.objectValue : 'all';
            this.zoneFilter = this.filterValues.zoneValue !== undefined && this.filterValues.zoneValue !== null ? this.filterValues.zoneValue : 'all';
            this.deviceFilter = this.filterValues.deviceValue !== undefined && this.filterValues.deviceValue !== null ? this.filterValues.deviceValue : 'all';
            this.ruleAction = this.filterValues.actionEventRuleValue !== undefined && this.filterValues.actionEventRuleValue !== null ? this.filterValues.actionEventRuleValue : 'all';
            this.paramsFilter = this.filterValues.paramsValue !== undefined && this.filterValues.paramsValue !== null ? this.filterValues.paramsValue : StatisticsParams.allParams;
            if (this.shiftsCollection.length > 0) this.shiftFilter = this.filterValues.shiftValue !== undefined && this.filterValues.shiftValue !== null ? this.filterValues.shiftValue :
                this.shiftsCollection[0].id;
        } else {
            this.ruleFilter = 'all';
            this.objectFilter = 'all';
            this.zoneFilter = 'all';
            this.ruleAction = 'all';
            this.deviceFilter = 'all';
            this.shiftFilter = 'all';
        }
        this.refreshStatistics();
    }

    private setFilter() {
        if (this.filterVisibility) {
            this.isActionFilter = this.filterVisibility.ActionFilter;
            this.isObjectFilter = this.filterVisibility.ObjectFilter;
            this.isEventRuleFilter = this.filterVisibility.EventRuleFilter || this.filterVisibility.IncidentFilter;
            this.isZoneFilter = this.filterVisibility.ZoneFilter;
            this.isDatePeriod = this.filterVisibility.DatePeriod;
            this.isParamsFilter = this.filterVisibility.ParamsFilter;
            this.isDeviceFilter = this.filterVisibility.DeviceFilter;
        } else {
            this.isActionFilter = false;
            this.isObjectFilter = false;
            this.isEventRuleFilter = false;
            this.isZoneFilter = false;
            this.isDatePeriod = false;
            this.isParamsFilter = false;
            this.isDeviceFilter = false;
        }
    }

    private prepareStatisticsDataCollectionItem(objectType: string, resource: any[], fieldName?: string, resultCollection?: StatisticsDataCollectionItem[], filterIncident: boolean = false): StatisticsDataCollectionItem[] {
        if (!fieldName) { fieldName = 'name'; }
        if (!resultCollection) { resultCollection = []; }

        _.each(resource, (item: any) => {
            if (filterIncident && objectType === SearchObjectTypes.EventRule && !item.incident) return;

            resultCollection.push({
                id: item.id,
                name: item[fieldName],
                object_type: objectType
            });
        });

        return resultCollection;
    }

    private prepareDeviceStatisticsDataCollectionItem(objectType: string, resource: any[], resultCollection?: StatisticsDataCollectionItem[], filterIncident: boolean = false): StatisticsDataCollectionItem[] {
        if (!resultCollection) { resultCollection = []; }

        _.each(resource, (item: any) => {
            if (filterIncident && objectType === SearchObjectTypes.EventRule && !item.incident) return;

            resultCollection.push({
                id: item.id,
                name: this.filterVisibility.DeviceFilter === 2 && item.object && item.object.name ? item.object.name : item['label'] || item['udi'],
                object_type: objectType
            });
        });

        return resultCollection;
    }

    private prepareShiftStatisticsDataCollectionItem(resource: any[], resultCollection?: StatisticsDataCollectionItem[]): StatisticsDataCollectionItem[] {
        if (!resultCollection) { resultCollection = []; }

        _.each(resource, (item: any, index) => {
            resultCollection.push({
                id: item.id,
                name: item['name'],
                object_type: 'shift',
                startHour: item.start / 60,
                endHour: item.start + item.duration == 0 ? 24 : (item.start + item.duration) / 60
            });
        });

        return resultCollection;
    }

    private prepareCollections() {
        this.rulesCollection = this.prepareStatisticsDataCollectionItem(SearchObjectTypes.EventRule, this.iqsEventRulesViewModel.getCollection(), 'name', null, this.filterVisibility.IncidentFilter);
        this.rulesCollection.unshift({ id: 'all', name: this.pipTranslate.translate('FILTER_EVENT_RULE_ALL') });

        // this.objectsCollection = this.prepareStatisticsDataCollectionItem(SearchObjectTypes.ControlObject, this.iqsObjectsViewModel.allObjects, 'name');
        // this.objectsCollection = this.prepareStatisticsDataCollectionItem(SearchObjectTypes.ObjectGroup, this.iqsObjectGroupsViewModel.getCollection(), 'name', this.objectsCollection);
        // this.objectsCollection.unshift({ id: 'all', name: this.pipTranslate.translate('FILTER_OBJECT_ALL') });
        // this.zonesCollection = this.prepareStatisticsDataCollectionItem(SearchObjectTypes.Zone, this.iqsZonesViewModel.getCollection(), 'name');
        // this.zonesCollection.unshift({ id: 'all', name: this.pipTranslate.translate('FILTER_ZONES_ALL') });

        this.objectsCollection = this.iqsStatisticsCollectionsService.getObjectAndGroupCollection();
        this.zonesCollection = this.iqsStatisticsCollectionsService.getZoneCollection();

        this.devicesCollection = this.prepareDeviceStatisticsDataCollectionItem(SearchObjectTypes.Device, this.iqsDevicesViewModel.allDevices);
        this.devicesCollection.unshift({ id: 'all', name: this.pipTranslate.translate('FILTER_DEVICES_ALL') });

        this.shiftsCollection = this.prepareShiftStatisticsDataCollectionItem(this.iqsShiftsViewModel.allShifts);

        this.dateFilters = [
            { id: DatePeriodValues.Daily, name: 'FILTER_DATE_PERIOD_DAILY' },
            { id: DatePeriodValues.Range, name: 'FILTER_DATE_PERIOD_RANGE' },
            { id: DatePeriodValues.Weekly, name: 'FILTER_DATE_PERIOD_WEEKLY' },
            { id: DatePeriodValues.Monthly, name: 'FILTER_DATE_PERIOD_MONTHLY' },
            { id: DatePeriodValues.Yearly, name: 'FILTER_DATE_PERIOD_YEARLY' },
        ];

        if (this.shiftsCollection.length > 0) {
            this.dateFilters.splice(1, 0, { id: DatePeriodValues.Shift, name: 'FILTER_DATE_PERIOD_SHIFT' });
        }

        this.paramsCollection = [
            { id: StatisticsParams.allParams, name: 'FILTER_PARAMS_ALL' },
            { id: StatisticsParams.distance, name: 'FILTER_PARAMS_DISTANCE' },
            { id: StatisticsParams.online, name: 'FILTER_PARAMS_ONLINE' },
            // { id: StatisticsParams.offline, name: 'FILTER_PARAMS_OFFLINE' },
            { id: StatisticsParams.speed, name: 'FILTER_PARAMS_SPEED' },
            { id: StatisticsParams.freezed, name: 'FILTER_PARAMS_FREEZED' }
        ];

        this.ruleActionsCollection = [];
        _.each(this.iqsTypeCollectionsService.getEventRuleType(), (item: TypeCollectionItem) => {
            this.ruleActionsCollection.push({
                id: item.id,
                name: item.name
            });
        });
        this.ruleActionsCollection.unshift({ id: 'all', name: this.pipTranslate.translate('FILTER_EVENT_RULE_ACTION_ALL') });
    }

    public openFilterDialog() {
        this.getAllExceptFunctions();
        this.iqsFilterDialog.show(this.getAllExceptFunctions(), (updatedData) => {
            angular.extend(this, updatedData);
            this.refreshStatistics();
        });
    }

    private getAllExceptFunctions() {
        let result: any = {};
        _.each(this, (value, key) => {
            if (typeof value != 'function')
                result[key] = value;
        });

        return result;
    }

    private getEndDate(date: Date): Date {
        let endDate: Date;

        switch (this.datePeriod) {
            case DatePeriodValues.Daily:
                endDate = this.pipDateConvert.toEndDay(date, 0);
                break;
            case DatePeriodValues.Weekly:
                endDate = this.pipDateConvert.toEndWeek(date, 0);
                break;
            case DatePeriodValues.Monthly:
                endDate = this.pipDateConvert.toEndMonth(date, 0);
                break;
            case DatePeriodValues.Yearly:
                endDate = this.pipDateConvert.toEndYear(date, 0);
                break;
            case DatePeriodValues.Shift:
                let currentShift = _.find(this.shiftsCollection, (shift) => {
                    return shift.id == this.shiftFilter;
                });
                endDate = moment(date).toDate();
                endDate.setHours(currentShift.endHour);
                if (currentShift.startHour > currentShift.endHour) {
                    this.pipDateConvert.addHours(endDate, 24);
                }
                break;
            case DatePeriodValues.Range:
                endDate = this.endDate;
                break;
        }

        return endDate;
    }

    private getStatisticsParams(): StatisticsFilterResult {
        let result = new StatisticsFilterResult();
        result.objectId = null;
        result.objectGroupId = null;
        result.ruleId = null;
        result.deviceId = null;
        result.zoneId = null;
        result.actionId = null;
        if (this.filterVisibility.ObjectFilter) {
            if (this.objectFilter === this.allId) {
                result.objectId = null;
                result.objectGroupId = null;
            } else {
                let index = _.findIndex(this.iqsObjectsViewModel.allObjects, { id: this.objectFilter });
                if (index > -1) {
                    result.objectId = this.objectFilter;
                    result.object = this.iqsObjectsViewModel.getObjectById(this.objectFilter);
                    result.objectGroupId = null;
                } else {
                    result.objectId = null;
                    result.objectGroupId = this.objectFilter;
                    result.objectGroup = this.iqsObjectGroupsViewModel.getGroupById(this.objectFilter);
                }
            }
        }
        if (this.filterVisibility.EventRuleFilter || this.filterVisibility.IncidentFilter) {
            if (this.ruleFilter === this.allId) {
                // result.ruleId = 'all';
                result.ruleId = null;
            } else {
                result.ruleId = this.ruleFilter;
                result.rule = this.iqsEventRulesViewModel.getEventRuleById(this.ruleFilter);
            }
        }
        if (this.filterVisibility.DeviceFilter) {
            if (this.deviceFilter === this.allId) {
                // result.deviceId = 'all';
                result.deviceId = null;
            } else {
                result.deviceId = this.deviceFilter;
                result.device = this.iqsDevicesViewModel.getDeviceById(this.ruleFilter);
            }
        }
        if (this.filterVisibility.ZoneFilter) {
            if (this.zoneFilter === this.allId) {
                result.zoneId = null;
            } else {
                result.zoneId = this.zoneFilter;
                result.zone = this.iqsZonesViewModel.getZoneById(this.zoneFilter);
            }
        }
        if (this.filterVisibility.ActionFilter) {
            if (this.ruleAction === this.allId) {
                result.actionId = null;
            } else {
                result.actionId = this.ruleAction;
            }
        }
        if (this.filterVisibility.ParamsFilter) {
            result.param = this.paramsFilter;
            result.paramName = this.getParamName(this.paramsFilter);
        }

        if (this.filterVisibility.DatePeriod) {
            result.datePeriod = this.datePeriod;// == DatePeriodValues.Range ? DatePeriodValues.Shift : this.datePeriod;
        }

        result.fromDate = this.startDate;
        result.toDate = this.getEndDate(this.startDate);
        if (this.datePeriod == DatePeriodValues.Shift) {
            let currentShift = _.find(this.shiftsCollection, (shift) => {
                return shift.id == this.shiftFilter;
            });
            result.fromDate.setHours(currentShift.startHour);
        }
        result.formattedDate = this.$mdDateLocale.formatDate(this.startDate);

        return result;
    }

    public getParamName(id) {
        let param = _.find(this.paramsCollection, (param) => {
            return param.id === id;
        });

        return param ? param.name : '';
    }

    public refreshStatistics(): void {
        // update current date
        this.nowDate = new Date();

        if (this.onStatisticsRefresh) {
            this.filterChange();
        }
    }

    public changeDatePeriod() {
        this.setDate();
        this.refreshStatistics();
    }

    public prevDate(): void {
        switch (this.datePeriod) {
            case DatePeriodValues.Daily:
                this.startDate = this.pipDateConvert.toPrevRange(this.startDate, 'day');
                break;
            case DatePeriodValues.Weekly:
                this.startDate = this.pipDateConvert.toPrevRange(this.startDate, 'week');
                break;
            case DatePeriodValues.Monthly:
                this.startDate = this.pipDateConvert.toPrevRange(this.startDate, 'month');
                break;
            case DatePeriodValues.Yearly:
                this.startDate = this.pipDateConvert.toPrevRange(this.startDate, 'year');
                break;
            case DatePeriodValues.Shift:
                this.startDate = this.pipDateConvert.toPrevRange(this.startDate, 'day');
                let currentShift = _.find(this.shiftsCollection, (shift) => {
                    return shift.id == this.shiftFilter;
                });
                this.startDate.setHours(currentShift.startHour);
                break;
            case DatePeriodValues.Range:
                // this.startDate = this.pipDateConvert.toPrevRange(this.startDate, 'day');
                // this.endDate = moment(this.startDate).toDate();
                // this.endDate.setHours(this.endDate.getHours() + (this.timeDiff / (60 * 60 * 1000)));
                this.endDate = _.clone(this.startDate);
                this.startDate = moment(this.startDate.getTime() - this.timeDiff).toDate();
                break;
        }
        this.refreshStatistics();
    }

    public currentDate(): void {
        this.startDate = new Date();
        if (this.datePeriod == DatePeriodValues.Shift) {
            let hour = this.startDate.getHours()
            let currentShift = _.find(this.shiftsCollection, (shift) => {
                return (shift.startHour < shift.endHour && shift.startHour <= hour && shift.endHour > hour) ||
                    (shift.startHour >= shift.endHour && (shift.startHour <= hour || shift.endHour > hour));
            });
            this.shiftFilter = currentShift.id
            this.startDate.setHours(currentShift.startHour);
        }
        this.currDate = _.cloneDeep(this.startDate);
        this.setDate();
        this.refreshStatistics();
    }

    public nextDate(): void {
        switch (this.datePeriod) {
            case DatePeriodValues.Daily:
                this.startDate = this.pipDateConvert.toNextRange(this.startDate, 'day');
                break;
            case DatePeriodValues.Weekly:
                this.startDate = this.pipDateConvert.toNextRange(this.startDate, 'week');
                break;
            case DatePeriodValues.Monthly:
                this.startDate = this.pipDateConvert.toNextRange(this.startDate, 'month');
                break;
            case DatePeriodValues.Yearly:
                this.startDate = this.pipDateConvert.toNextRange(this.startDate, 'year');
                break;
            case DatePeriodValues.Shift:
                this.startDate = this.pipDateConvert.toNextRange(this.startDate, 'day');
                let currentShift = _.find(this.shiftsCollection, (shift) => {
                    return shift.id == this.shiftFilter;
                });
                this.startDate.setHours(currentShift.startHour);
                break;
            case DatePeriodValues.Range:
                // this.startDate = this.pipDateConvert.toNextRange(this.startDate, 'day');
                // this.endDate = moment(this.startDate).toDate();
                // this.endDate.setHours(this.endDate.getHours() + (this.timeDiff / (60 * 60 * 1000)));
                this.startDate = _.clone(this.endDate);
                this.endDate = moment(this.endDate.getTime() + this.timeDiff).toDate();
                break;
        }
        this.refreshStatistics();
    }

    public openCalendar() {
        this.openDatePicker = true;
    }

    public onCalendarDateChange() {
        this.openDatePicker = false;
        this.currDate = _.cloneDeep(this.startDate);
        this.setDate();
        this.refreshStatistics();
    }

    public startDateTimeChanged = (startDate) => {
        this.startDate = startDate;
        this.timeDiff = this.endDate.getTime() - this.startDate.getTime();
        if (this.timeDiff < 0 || (this.intervalLimited && Math.abs(this.timeDiff) > this.intervalMaxTimeDiff)) {
            this.timeDiff = 8 * 60 * 60 * 1000;
            this.endDate = new Date(this.startDate.getTime() + this.timeDiff);
            this.pipToasts.showNotification(this.pipTranslate.translate( this.timeDiff <= 0 ? 'STATISTICS_RANGE_OVERLAP_ERROR' : 'STATISTICS_RANGE_ERROR'),
                    ['ok'], () => { }, () => { }, '');
        }
        this.onCalendarDateChange();
    }

    public endDateTimeChanged = (endDate) => {
        this.endDate = endDate;

        if (this.startDate.getTime() == this.endDate.getTime()) {
            this.startDate = new Date(this.endDate.getTime() - 60 * 60 * 1000);
            this.pipToasts.showNotification(this.pipTranslate.translate('STATISTICS_RANGE_OVERLAP_ERROR'),
                ['ok'], () => { }, () => { }, '');
        }
        if (this.startDate > this.endDate) {
            this.startDate = new Date(this.endDate.getTime() - (this.timeDiff));
            this.pipToasts.showNotification(this.pipTranslate.translate('STATISTICS_RANGE_OVERLAP_ERROR'),
                ['ok'], () => { }, () => { }, '');
        }
        this.timeDiff = this.endDate.getTime() - this.startDate.getTime();
        if (this.intervalLimited && this.timeDiff > this.intervalMaxTimeDiff) {
            this.timeDiff = this.intervalMaxTimeDiff;
            this.startDate = new Date(this.endDate.getTime() - this.intervalMaxTimeDiff);
            // todo: show toasts
            this.pipToasts.showNotification(this.pipTranslate.translate('STATISTICS_RANGE_ERROR'),
                ['ok'], () => { }, () => { }, '');
        }
        this.onCalendarDateChange();
    }

    public endTimeChanged = (endTime) => {
        this.endDate.setHours(endTime.getHours());
        this.endDate.setMinutes(endTime.getMinutes());
        this.endDateTimeChanged(this.endDate);
    }
}

angular.module('iqsStatisticsFilterPanel', [
    'iqsStatistics.CollectionsService',
    'iqsShifts.ViewModel',
    'iqsTypeCollections.Service',
    'pipTimeAutocomplete',
    'iqsFilterDialog'
])
    .component('iqsStatisticsFilterPanel', {
        bindings: StatisticsFilterPanelBindings,
        // templateUrl: 'common/panels/statistics_filter/StatisticsFilterPanel.html',
        controller: StatisticsFilterPanelController,
        controllerAs: '$ctrl',
        template:
            `
        <div class="iqs-filter-panel-container layout-row divider-bottom lp24-flex rp24-flex">
            <div class="flex" ng-if="$ctrl.pipMedia('gt-sm')">
                <!-- params -->
                <div class="text-caption rm4 param-block" ng-if="$ctrl.isParamsFilter">
                    <md-input-container class="md-block iqs-medium-select hide-md-errors-spacer m0">
                        <md-select class="flex" aria-label="RULES" ng-change="$ctrl.refreshStatistics()" ng-disabled="$ctrl.ngDisabled" ng-model="$ctrl.paramsFilter">
                            <md-option ng-value="opt.id" ng-repeat="opt in $ctrl.paramsCollection track by opt.id">
                                {{ ::opt.name | translate }}
                            </md-option>
                        </md-select>
                    </md-input-container>
                </div>

                <div class="text-caption rm4 param-block" ng-if="$ctrl.isEventRuleFilter">
                    <md-input-container class="md-block iqs-medium-select hide-md-errors-spacer m0">
                        <md-select class="flex" aria-label="RULES" ng-change="$ctrl.refreshStatistics()" ng-disabled="$ctrl.ngDisabled" ng-model="$ctrl.ruleFilter">
                            <md-option ng-value="rule.id" ng-repeat="rule in $ctrl.rulesCollection track by rule.id">
                                {{ ::rule.name }}
                            </md-option>
                        </md-select>
                    </md-input-container>
                </div>
                <!--rule action-->
                <div class="text-caption rm4 param-block" ng-if="$ctrl.isActionFilter">
                    <md-input-container class="md-block iqs-medium-select hide-md-errors-spacer m0">
                        <md-select class="flex" aria-label="RULES_ACTION" ng-change="$ctrl.refreshStatistics()" ng-disabled="$ctrl.ngDisabled" ng-model="$ctrl.ruleAction">
                            <md-option ng-value="action.id" ng-repeat="action in $ctrl.ruleActionsCollection track by action.id">
                                {{ ::action.name }}
                            </md-option>
                        </md-select>
                    </md-input-container>
                </div>
                <!--zones-->
                <div class="text-caption rm4 param-block" ng-if="$ctrl.isZoneFilter">
                    <md-input-container class="md-block iqs-medium-select hide-md-errors-spacer m0">
                        <md-select class="flex" aria-label="ZONES" ng-change="$ctrl.refreshStatistics()" ng-disabled="$ctrl.ngDisabled" ng-model="$ctrl.zoneFilter">
                            <md-option ng-value="zone.id" ng-repeat="zone in $ctrl.zonesCollection track by zone.id">
                                {{ ::zone.name }}
                            </md-option>
                        </md-select>
                    </md-input-container>
                </div>
                <!--objects-->
                <div class="text-caption rm4 param-block" ng-if="$ctrl.isObjectFilter">
                    <md-input-container class="md-block iqs-medium-select hide-md-errors-spacer m0">
                        <md-select class="flex" aria-label="OBJECTS" ng-change="$ctrl.refreshStatistics()" ng-disabled="$ctrl.ngDisabled" ng-model="$ctrl.objectFilter">
                            <md-option ng-value="object.id" ng-repeat="object in $ctrl.objectsCollection track by object.id">
                                {{ ::object.name }}
                            </md-option>
                        </md-select>
                    </md-input-container>
                </div>
                <!--devices-->
                <div class="text-caption rm4 param-block" ng-if="$ctrl.isDeviceFilter">
                    <md-input-container class="md-block iqs-medium-select hide-md-errors-spacer m0">
                        <md-select class="flex" aria-label="DEVICE" ng-change="$ctrl.refreshStatistics()" ng-disabled="$ctrl.ngDisabled" ng-model="$ctrl.deviceFilter">
                            <md-option ng-value="device.id" ng-repeat="device in $ctrl.devicesCollection track by device.id">
                                {{ ::device.name }}
                            </md-option>
                        </md-select>
                    </md-input-container>
                </div>

                <!--date periods-->
                <div class="text-caption rm4 param-block" ng-if="$ctrl.isDatePeriod">
                    <md-input-container class="md-block iqs-small-select hide-md-errors-spacer  m0">
                        <md-select class="flex" aria-label="Status" ng-model="$ctrl.datePeriod" ng-disabled="$ctrl.ngDisabled" ng-change="$ctrl.changeDatePeriod()">
                            <md-option ng-value="opt.id" ng-repeat="opt in $ctrl.dateFilters track by opt.id">
                                {{ ::opt.name | translate }}
                            </md-option>
                        </md-select>
                    </md-input-container>
                </div>

                <div class="text-caption rm4 param-block" ng-if="$ctrl.datePeriod != 'range'">
                    <md-input-container class="md-block flex tm0 bm0 iqs-stats-datepicker">
                        <md-datepicker md-hide-icons="calendar" class="text-caption rm0 tm4 {{ $ctrl.datePeriod == 'Weekly' ? 'iqs-week' : '' }} {{ $ctrl.openDatePicker ? '' : 'iqs-active-date color-accent' }}"
                            ng-model="$ctrl.startDate" aria-label="START_DATE" ng-change="$ctrl.onCalendarDateChange()">
                        </md-datepicker>
                    </md-input-container>
                </div>

                <div class="text-caption" ng-if="$ctrl.datePeriod == 'range'">
                    <div class="text-caption rm4 param-block">
                        <md-input-container  class="md-block flex tm0 bm0 iqs-stats-datepicker">
                            <md-datepicker class="w-stretch " md-hide-icons="calendar" aria-label="TIME" ng-change="$ctrl.startDateTimeChanged($ctrl.startDate)"
                                ng-model="$ctrl.startDate" ng-disabled="$ctrl.ngDisabled">
                            </md-datepicker>
                        </md-input-container>
                    </div>
                    <div class="param-block rm4 time-block">
                        <pip-time-autocomplete pip-time-label="false" pip-change-callback="$ctrl.startDateTimeChanged" ng-disabled="$ctrl.ngDisabled"
                            pip-date-time="$ctrl.startDate" pip-time-step="60" pip-select-font-size="12">
                        </pip-time-autocomplete>
                    </div>
                    <div class="text-caption rm4 param-block">
                        <md-input-container class="md-block flex tm0 bm0 iqs-stats-datepicker">
                            <md-datepicker class="w-stretch " md-hide-icons="calendar" aria-label="TIME" ng-change="$ctrl.endDateTimeChanged($ctrl.endDate)"
                                ng-model="$ctrl.endDate" ng-disabled="$ctrl.ngDisabled">
                            </md-datepicker>
                        </md-input-container>
                    </div>
                    <div class="param-block rm4 time-block">
                        <pip-time-autocomplete pip-time-label="false" pip-change-callback="$ctrl.endTimeChanged" ng-disabled="$ctrl.ngDisabled"
                            pip-date-time="$ctrl.endDate" pip-time-step="60" pip-select-font-size="12">
                        </pip-time-autocomplete>
                    </div>
                </div>

                <!-- shifts -->

                <div class="text-caption rm4 param-block" ng-if="$ctrl.isDatePeriod && $ctrl.datePeriod == 'shift'">
                    <md-input-container class="md-block iqs-medium-select hide-md-errors-spacer m0">
                        <md-select class="flex" aria-label="DEVICE" ng-change="$ctrl.refreshStatistics()" ng-disabled="$ctrl.ngDisabled" ng-model="$ctrl.shiftFilter">
                            <md-option ng-value="shift.id" ng-repeat="shift in $ctrl.shiftsCollection track by shift.id">
                                {{ ::shift.name }}
                            </md-option>
                        </md-select>
                    </md-input-container>
                </div>
            </div>

            <div class="flex layout-row layout-align-start-center" ng-if="!$ctrl.pipMedia('gt-sm')">
                <md-button class="md-icon-button m0" ng-click="$ctrl.openFilterDialog()" aria-label="filter button" tabindex="-1">
                    <md-icon md-svg-icon="icons:filter"></md-icon>
                </md-button>
            </div>

            <!--datetime interval-->
            <div class="layout-row layout-align-center-center flex-fixed">
                <!--date range-->
                <div class="layout-row layout-align-center-center iqs-statistics-date-buttons">
                    <md-button class="md-icon-button m0" ng-click="$ctrl.prevDate()" aria-label="current user" tabindex="-1">
                        <md-tooltip md-visible="showTooltip" md-direction="bottom">
                            {{ ::'STATISTICS_FILTER_DATE_PREV' | translate }}
                        </md-tooltip>
                        <md-icon md-svg-icon="icons:chevron-big-left"></md-icon>
                    </md-button>
                    <md-button class="md-icon-button flex-fixed m0" aria-label="current user" tabindex="-1" ng-click="$ctrl.currentDate()">
                        <md-tooltip md-visible="showTooltip" md-direction="bottom">
                            {{ ::'STATISTICS_FILTER_DATE_CURRENT' | translate }}
                        </md-tooltip>                
                        <md-icon md-svg-icon="icons:date"></md-icon>
                    </md-button>
                    <md-button class="md-icon-button flex-fixed m0" aria-label="current user" tabindex="-1" ng-click="$ctrl.nextDate()">
                        <md-tooltip md-visible="showTooltip" md-direction="bottom">
                            {{ ::'STATISTICS_FILTER_DATE_NEXT' | translate }}
                        </md-tooltip>                
                        <md-icon md-svg-icon="icons:chevron-big-right"></md-icon>
                    </md-button>
                </div>
            </div>
        </div>
        `
    });

import './StatisticsFilterPanelResource';
