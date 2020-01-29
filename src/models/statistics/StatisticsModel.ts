import { IStatisticsDataService } from '../../data/statistics/IStatisticsDataService';
import { Statistics } from '../../data/statistics/Statistics';
import { States } from '../../common/States';
import { IObjectGroupsViewModel } from '../object_groups/IObjectGroupsViewModel';
import { IObjectsViewModel } from '../../models/objects/IObjectsViewModel';
import { IEventRulesViewModel } from '../../models/event_rules/IEventRulesViewModel';
import { IZonesViewModel } from '../../models/zones/IZonesViewModel';
import { ObjectGroup } from '../../data';
import { StatisticsParams } from '../../common/panels/statistics_filter/StatisticsParams';
import { IOrganizationService } from '../../services';

export class StatisticsModel {
    private _state: string;

    private selectIndex: number;
    private transaction: pip.services.Transaction;

    private groupIds: string[];
    private groups: ObjectGroup[];
    private prevRequest: any = null;

    public lastRequestDate: Date = null;
    public lastRequestType: string = null;

    private allStatistics: Statistics[];
    private DateTypes: any = {
        daily: 4,
        shift: 4,
        range: 4,
        weekly: 3,
        monthly: 3,
        yearly: 2
    };

    private minuteNumber: any = {
        daily: 60,
        weekly: 1440,
        monthly: 1440,
        yearly: 43200
    };

    private _statistics: any | any[];

    constructor(
        private $log: ng.ILogService,
        private $location: ng.ILocationService,
        private $timeout: ng.ITimeoutService,
        private pipTransaction: pip.services.ITransactionService,
        private pipTranslate: pip.services.ITranslateService,
        private iqsOrganization: IOrganizationService,
        private iqsObjectGroupsViewModel: IObjectGroupsViewModel,
        private iqsObjectsViewModel: IObjectsViewModel,
        private iqsEventRulesViewModel: IEventRulesViewModel,
        private iqsZonesViewModel: IZonesViewModel,
        private iqsStatisticsData: IStatisticsDataService
    ) {
        "ngInject";
        this.transaction = pipTransaction.create('Statistics');
    }

    public get state() {
        return this._state;
    }

    public get selectedIndex() {
        return this.selectedIndex;
    }

    public set selectedIndex(index) {
        this.selectedIndex = index;
    }

    public getStatistics(firstArg: string, secondArg: string, thirdArg: string, forthArg: string, from_time: Date | string, to_time: Date | string, type: string, each: boolean = false, successCallback?) {
        if (this.isSameRequest(firstArg, secondArg, thirdArg, forthArg, from_time, to_time, type, each)) return;
        this._state = States.Progress;
        this.lastRequestDate = moment(from_time).toDate();
        this.lastRequestType = type;

        if (firstArg === 'states') {
            this.statesForSpecificDevice(from_time, to_time, type, secondArg, successCallback);

            return;
        }

        if (firstArg === 'incidents' && forthArg === 'all') {
            this.allEvents(from_time, to_time, type, firstArg, secondArg, thirdArg, true, each, successCallback);
            return;
        }

        if (firstArg === 'params' && secondArg === 'all' && thirdArg === 'all' && forthArg === 'all') {
            this.allParams(from_time, to_time, type, secondArg, thirdArg, firstArg, successCallback);
            return;
        }

        if (firstArg === 'events' && secondArg === 'all' && thirdArg === 'all' && forthArg === 'all') {
            this.allEvents(from_time, to_time, type, firstArg, 'all', thirdArg, false, each, successCallback);
            return;
        }
        // ----------------------------
        // for list

        // список объектов группы для зоны
        if (firstArg === 'presence' && secondArg !== 'all' && thirdArg !== 'all' && each) {
            this.specificZoneForAllObjectsOfGroup(from_time, to_time, type, secondArg, thirdArg, forthArg, firstArg, successCallback);
            return;
        }

        // список объектов и групп для зоні
        if (firstArg === 'presence' && secondArg === 'all' && thirdArg !== 'all' && each) {
            this.allObjects(from_time, to_time, type, firstArg, secondArg, thirdArg, successCallback);
            return;
        }

        if (firstArg === 'presence' && secondArg !== 'all' && thirdArg === 'all' && each) {
            this.allZones(from_time, to_time, type, firstArg, secondArg, thirdArg, each, successCallback);
            return;
        }

        // for chart 
        if (firstArg === 'presence' && secondArg === 'all' && thirdArg === 'all' && !each) {
            this.allZones(from_time, to_time, type, firstArg, secondArg, thirdArg, each, successCallback);
            return;
        }

        if (firstArg === 'presence' && secondArg !== 'all' && !each) {
            this.specificForSpecificObjectOrGroup(from_time, to_time, type, secondArg, thirdArg, forthArg, firstArg, successCallback);
            return;
        }

        if (firstArg === 'presence' && thirdArg !== 'all' && !each) {
            this.specificForSpecificObjectOrGroup(from_time, to_time, type, secondArg, thirdArg, forthArg, firstArg, successCallback);
            return;
        }




        // ----------------------------
        //
        if (StatisticsParams.all.indexOf(firstArg) != -1 && secondArg === 'all' && thirdArg === 'all' && each) {
            this.allObjects(from_time, to_time, type, firstArg, secondArg, 'all', successCallback);
            return;
        }

        if (StatisticsParams.all.indexOf(firstArg) != -1 && secondArg === 'all' && thirdArg === 'all' && !each) {
            this.allZones(from_time, to_time, type, firstArg, secondArg, thirdArg, each, successCallback);
            return;
        }
        //
        if (StatisticsParams.all.indexOf(firstArg) != -1 && secondArg === 'all' && thirdArg != 'all' && each) {
            this.allObjects(from_time, to_time, type, firstArg, secondArg, thirdArg, successCallback);
            return;
        }

        if (StatisticsParams.all.indexOf(firstArg) != -1 && secondArg === 'all' && thirdArg != 'all' && !each) {
            this.specificForSpecificZone(from_time, to_time, type, secondArg, thirdArg, forthArg, firstArg, successCallback);
            return;
        }
        //
        if (StatisticsParams.all.indexOf(firstArg) != -1 && secondArg !== 'all' && thirdArg === 'all' && !each) {
            // this.allZones(from_time, to_time, type, firstArg, secondArg, thirdArg, each, successCallback);
            this.specificForSpecificZone(from_time, to_time, type, secondArg, thirdArg, forthArg, firstArg, successCallback);
            return;
        }
        //
        if (StatisticsParams.all.indexOf(firstArg) != -1 && secondArg !== 'all' && thirdArg != 'all' && !each) {
            this.specificForSpecificZone(from_time, to_time, type, secondArg, thirdArg, forthArg, firstArg, successCallback);
            return;
        }
        //
        if (StatisticsParams.all.indexOf(firstArg) != -1 && secondArg !== 'all' && each) {
            this.specificZoneForAllObjectsOfGroup(from_time, to_time, type, secondArg, thirdArg, forthArg, firstArg, successCallback);
        }
        //
        if (secondArg === 'all' && thirdArg === 'all' && forthArg !== 'all') {
            this.specificForAll(from_time, to_time, type, secondArg, thirdArg, forthArg, firstArg, successCallback);
            return;
        }

        if (firstArg === 'params' && (secondArg !== 'all' || thirdArg !== 'all') && forthArg === 'all') {
            this.allParams(from_time, to_time, type, secondArg, thirdArg, firstArg, successCallback);
            return;
        }

        if (firstArg === 'events' && (secondArg !== 'all' || thirdArg !== 'all') && forthArg === 'all') {
            this.allEvents(from_time, to_time, type, firstArg, secondArg, thirdArg, false, each, successCallback);
            return;
        }

        if ((secondArg !== 'all' || thirdArg !== 'all') && forthArg !== 'all' && !each) {
            this.specificForAll(from_time, to_time, type, secondArg, thirdArg, forthArg, firstArg, successCallback);
            return;
        }

        if (firstArg === 'params' && (secondArg !== 'all' || thirdArg !== 'all') && forthArg !== 'all' && each) {
            this.specificParamForAllObjectsOfGroup(from_time, to_time, type, secondArg, thirdArg, forthArg, firstArg, successCallback);
            return;
        }

        if ((firstArg === 'events' || firstArg === 'incidents') && (secondArg !== 'all' || thirdArg !== 'all') && forthArg !== 'all' && each) {
            this.specificEventForAllObjectsOfGroup(from_time, to_time, type, secondArg, thirdArg, forthArg, 'events', successCallback);
            return;
        }
    }

    private isActualRequest(firstArg: string, secondArg: string, thirdArg: string, forthArg: string, from_time: Date | string, to_time: Date | string, type: string, each: boolean = false) {

        let isEqual = _.isEqual(this.prevRequest, {
            firstArg: firstArg,
            secondArg: secondArg,
            thirdArg: thirdArg,
            forthArg: forthArg,
            from_time: from_time,
            to_time: to_time,
            type: type,
            each: each
        });
        return isEqual;
    }

    private isSameRequest(firstArg: string, secondArg: string, thirdArg: string, forthArg: string, from_time: Date | string, to_time: Date | string, type: string, each: boolean = false) {
        let isEqual = _.isEqual(this.prevRequest, {
            firstArg: firstArg,
            secondArg: secondArg,
            thirdArg: thirdArg,
            forthArg: forthArg,
            from_time: from_time,
            to_time: to_time,
            type: type,
            each: each
        });

        if (isEqual) {
            return this.state == 'progress';
        } else {
            this.prevRequest = {
                firstArg: firstArg,
                secondArg: secondArg,
                thirdArg: thirdArg,
                forthArg: forthArg,
                from_time: from_time,
                to_time: to_time,
                type: type,
                each: each
            };

            return false;
        }

    }

    public prepareParamsStatisticsData(data, secondArg, thirdArg, forthArg, from_time, to_time, type, dateType, callback) {
        switch (type) {
            case 'offline': {
                let allMinutes = this.minuteNumber[dateType];

                _.each(data.values, (statValue) => {
                    statValue.value = allMinutes - statValue.value;
                });

                if (callback) callback();
                break;
            }

            case 'speed': {
                this.iqsStatisticsData.readStatistics(this.prepareRequest('params', secondArg, thirdArg, 'online', from_time, to_time, dateType), (onlineData: Statistics[]) => {
                    _.each(data.values, (statValue) => {
                        statValue.value = this.getSameDateValue(statValue, onlineData.values);
                    });

                    if (callback) callback();
                })
                break;
            }

            default: {
                if (callback) callback();
            }
        }
    }

    public specificForAll(from_time: Date | string, to_time: Date | string, type: string, secondArg, thirdArg, forthArg: string, firstArg: string = 'params', successCallback) {
        this._statistics = {};

        this.iqsStatisticsData.readStatistics(this.prepareRequest(firstArg == 'incidents' ? 'events' : firstArg, secondArg, thirdArg, forthArg, from_time, to_time, type), (data: Statistics[]) => {
            if (this.isActualRequest(firstArg, secondArg, thirdArg, forthArg, from_time, to_time, type, false)) {
                this._statistics = data;

                if (firstArg === 'params') {
                    this.prepareParamsStatisticsData(this._statistics, secondArg, thirdArg, forthArg, from_time, to_time, forthArg, type, () => {
                        this.specificDataCallback(firstArg, forthArg, type, from_time, to_time);
                        if (successCallback) successCallback(this._statistics);
                    })
                } else {
                    this.specificDataCallback(firstArg, forthArg, type, from_time, to_time);
                    if (successCallback) successCallback(this._statistics);
                }
            }
        });
    }

    private statesForSpecificDevice(from_time: Date | string, to_time: Date | string, type: string, secondArg: string, successCallback) {
        this._statistics = {};
        let fisrtArgs = ['state_updates', 'state_errors'];
        let colors = {
            state_updates: '#42A5F5',
            state_errors: '#EF5350'
        };

        async.each(fisrtArgs, (arg, callback) => {
            this.iqsStatisticsData.readStatistics(this.prepareRequest(arg, secondArg, null, null, from_time, to_time, type), (data: Statistics[]) => {
                if (this.isActualRequest('states', secondArg, null, null, from_time, to_time, type, false)) {
                    this._statistics[arg] = data;
                    this.prepareSeries(this._statistics[arg], type, from_time, to_time);
                }

                callback();
            })
        }, (error) => {
            if (!error) {
                if (this.isActualRequest('states', secondArg, null, null, from_time, to_time, type, false)) {
                    this._statistics.series = [];

                    for (let prop in this._statistics) {
                        if (prop === 'series') continue;
                        this._statistics.series.push({
                            key: this.pipTranslate.translate('STATISTICS_' + prop.toUpperCase()),
                            values: this._statistics[prop].filledValues,
                            color: colors[prop]
                        });

                    }
                    if (successCallback) successCallback(this._statistics);
                    this._state = States.Data;
                }
            }
        });
    }

    private specificDataCallback(firstArg, forthArg, type, from_time, to_time) {
        this.prepareSeries(this._statistics, type, from_time, to_time);
        this._statistics.series = [{
            key: this.getSeriaName(forthArg, firstArg),
            values: this._statistics.filledValues
        }];
        this._state = States.Data;
    }

    private getSeriaName(name, type) {
        switch (type) {
            case 'params':
                return this.pipTranslate.translate('FILTER_PARAMS_' + name.toUpperCase());
            default:
                return '';
        }
    }

    public specificForSpecificObjectOrGroup(from_time: Date | string, to_time: Date | string, type: string, id: string, thirdArg: string, forthArg: string, firstArg: string = 'params', successCallback) {
        this._statistics = {};

        this.iqsStatisticsData.readStatistics(this.prepareRequest(firstArg == 'incidents' ? 'events' : firstArg, id, thirdArg, forthArg === 'offline' ? 'online' : forthArg, from_time, to_time, type),
            (data: Statistics[]) => {
                if (this.isActualRequest(firstArg, id, thirdArg, forthArg, from_time, to_time, type, false)) {
                    this._statistics = data;

                    if (firstArg === 'params') {
                        this.prepareParamsStatisticsData(this._statistics, id, thirdArg, forthArg, from_time, to_time, forthArg, type, () => {
                            this.specificDataCallback(firstArg, forthArg, type, from_time, to_time);
                            if (successCallback) successCallback(this._statistics);
                        })
                    } else {
                        this.specificDataCallback(firstArg, forthArg, type, from_time, to_time);
                        if (successCallback) successCallback(this._statistics);
                    }
                }
            });
    }

    public specificForSpecificZone(from_time: Date | string, to_time: Date | string, type: string, secondArg: string, id: string, forthArg: string, firstArg: string = 'params', successCallback) {
        this._statistics = {};
        let fArg = StatisticsParams.all.indexOf(firstArg) != -1 ? 'params' : firstArg == 'incidents' ? 'events' : firstArg;
        this.iqsStatisticsData.readStatistics(this.prepareRequest(fArg, secondArg, id, forthArg === 'offline' ? 'online' : forthArg, from_time, to_time, type),
            (data: Statistics[]) => {
                if (this.isActualRequest(firstArg, secondArg, id, forthArg, from_time, to_time, type, false)) {
                    this._statistics = data;
                    if (firstArg === 'params' || fArg === 'params') {
                        this.prepareParamsStatisticsData(this._statistics, secondArg, id, forthArg, from_time, to_time, forthArg, type, () => {
                            this.specificDataCallback(firstArg, forthArg, type, from_time, to_time);
                            if (successCallback) successCallback(this._statistics);
                        })
                    } else {
                        this.specificDataCallback(firstArg, forthArg, type, from_time, to_time);
                        if (successCallback) successCallback(this._statistics);
                    }
                }
            });
    }

    public specificParamForAllObjectsOfGroup(from_time: Date | string, to_time: Date | string, type: string, id: string, thirdArg: string, forthArg: string, firstArg: string = 'params', successCallback) {
        let group = this.iqsObjectGroupsViewModel.getGroupById(id);
        if (!group) {
            this._state = States.Empty;
            return;
        }

        this._statistics = {};
        async.each(group.object_ids, (object_id, callback) => {
            this.iqsStatisticsData.readStatistics(this.prepareRequest(firstArg === 'incidents' ? 'events' : firstArg, object_id, thirdArg, forthArg === 'offline' ? 'online' : forthArg, from_time, to_time, type),
                (data: Statistics[]) => {
                    if (this.isActualRequest(firstArg, id, thirdArg, forthArg, from_time, to_time, type, true)) {
                        this._statistics[object_id] = data;
                        if (forthArg === 'speed') {
                            this.iqsStatisticsData.readStatistics(this.prepareRequest(firstArg, object_id, thirdArg, 'online', from_time, to_time, type), (onlineData) => {
                                this._statistics[object_id].value = this.getSum(data.values, true, onlineData.values);
                                callback();
                            });
                        } else {
                            if (forthArg === 'offline') {
                                let diff = (moment(to_time).valueOf() - moment(from_time).valueOf()) / 1000;
                                this._statistics[object_id].value = diff - this.getSum(data.values, false, null);
                            } else {
                                this._statistics[object_id].value = this.getSum(data.values, false, null);
                            }
                            callback();
                        }
                    } else {
                        callback();
                    }

                });
        }, (error) => {
            if (!error) {
                if (this.isActualRequest(firstArg, id, thirdArg, forthArg, from_time, to_time, type, true)) {
                    this._state = States.Data;
                    this._statistics.series = [];
                    for (let prop in this._statistics) {
                        let object = this.iqsObjectsViewModel.getObjectById(prop);
                        if (object) {
                            this._statistics.series.push({
                                key: object.name,
                                value: this._statistics[prop].value,
                                display: this.prepareDisplayValue(this._statistics[prop], thirdArg)
                            });
                        }
                    }
                    if (successCallback) successCallback(this._statistics);
                }
            }
        });
    }

    public specificEventForAllObjectsOfGroup(from_time: Date | string, to_time: Date | string, type: string, id: string, thirdArg: string, forthArg: string, firstArg: string = 'params', successCallback) {
        let group = this.iqsObjectGroupsViewModel.getGroupById(id);
        if (!group) {
            this._state = States.Empty;
            return;
        }

        this._statistics = {};

        async.each(group.object_ids, (object_id, callback) => {
            this.iqsStatisticsData.readStatistics(this.prepareRequest(firstArg, object_id, thirdArg, forthArg, from_time, to_time, type),
                (data: Statistics[]) => {
                    if (this.isActualRequest(firstArg, id, thirdArg, forthArg, from_time, to_time, type, true)) {
                        this._statistics[object_id] = data;
                        if (forthArg === 'speed') {
                            this.iqsStatisticsData.readStatistics(this.prepareRequest(firstArg, object_id, thirdArg, 'online', from_time, to_time, type), (onlineData) => {
                                this._statistics[object_id].value = this.getSum(data.values, true, onlineData.values);
                                callback();
                            });
                        } else {
                            this._statistics[object_id].value = this.getSum(data.values, false, null);
                            callback();
                        }
                    } else {
                        callback();
                    }
                });
        }, (error) => {
            if (!error) {
                if (this.isActualRequest(firstArg, id, thirdArg, forthArg, from_time, to_time, type, true)) {
                    this._state = States.Data;
                    this._statistics.series = [];
                    for (let prop in this._statistics) {
                        let object = this.iqsObjectsViewModel.getObjectById(prop);
                        if (object) {
                            this._statistics.series.push({
                                key: object.name,
                                value: this._statistics[prop].value
                            });
                        }
                    }
                    if (successCallback) successCallback(this._statistics);
                }
            }
        });
    }

    public specificZoneForAllObjectsOfGroup(from_time: Date | string, to_time: Date | string, type: string, id: string, thirdArg: string, forthArg: string, firstArg: string = 'params', successCallback) {
        let group = this.iqsObjectGroupsViewModel.getGroupById(id);
        if (!group) {
            this._state = States.Empty;
            return;
        }
        this._statistics = {};
        let displayFormat = StatisticsParams.all.indexOf(firstArg) != -1 && firstArg != 'presence' ? firstArg : 'online';
        let fArg = StatisticsParams.all.indexOf(firstArg) != -1 ? 'params' : firstArg == 'incidents' ? 'events' : firstArg;
        async.each(group.object_ids, (object_id, callback) => {
            this.iqsStatisticsData.readStatistics(this.prepareRequest(fArg, object_id, thirdArg, forthArg, from_time, to_time, type),
                (data: Statistics[]) => {
                    if (this.isActualRequest(firstArg, id, thirdArg, forthArg, from_time, to_time, type, true)) {
                        this._statistics[object_id] = data;
                        if (forthArg === 'speed') {
                            this.iqsStatisticsData.readStatistics(this.prepareRequest(firstArg, object_id, thirdArg, 'online', from_time, to_time, type), (onlineData) => {
                                this._statistics[object_id].value = this.getSum(data.values, true, onlineData.values);
                                callback();
                            });
                        } else {
                            this._statistics[object_id].value = this.getSum(data.values, false, null);
                            callback();
                        }
                    } else {
                        callback();
                    }
                });
        }, (error) => {
            if (!error) {
                if (this.isActualRequest(firstArg, id, thirdArg, forthArg, from_time, to_time, type, true)) {
                    this._state = States.Data;
                    this._statistics.series = [];
                    for (let prop in this._statistics) {
                        let object = this.iqsObjectsViewModel.getObjectById(prop);
                        if (object) {
                            this._statistics.series.push({
                                key: object.name,
                                value: this._statistics[prop].value,
                                // display: this.prepareDisplayValue(this._statistics[prop], 'online')
                                display: this.prepareDisplayValue(this._statistics[prop], displayFormat)
                            });
                        }
                    }
                    if (successCallback) successCallback(this._statistics);
                }
            }
        });
    }

    private prepareSeries(data, type: string, from_time: Date | string, to_time: Date | string) {
        switch (type) {
            case 'yearly': {
                data.filledValues = new Array(13);
                _.each(data.values, (statValue) => {
                    data.filledValues.splice(statValue.month, 1, statValue);
                });
                _.each(data.filledValues, (statValue, index: number) => {
                    statValue = statValue || {};
                    statValue.x = statValue.month ? statValue.month : index;
                    statValue.value = statValue.value || 0;
                    if (index !== 0) data.filledValues.splice(index, 1, statValue);
                });
                data.filledValues.splice(0, 1);
                break;
            }
            case 'daily': {
                data.filledValues = new Array(24);
                _.each(data.values, (statValue) => {
                    data.filledValues.splice(statValue.hour, 1, statValue);
                });
                _.each(data.filledValues, (statValue, index) => {
                    statValue = statValue || {};
                    statValue.x = statValue.hour || index;
                    statValue.value = statValue.value || 0;
                    data.filledValues.splice(index, 1, statValue);
                });

                break;
            }
            case 'monthly': {
                data.filledValues = new Array(moment(from_time).daysInMonth() + 1);
                _.each(data.values, (statValue) => {
                    data.filledValues.splice(statValue.day, 1, statValue);
                });
                _.each(data.filledValues, (statValue, index: number) => {
                    statValue = statValue === undefined ? {} : statValue;
                    statValue.x = statValue.day || index;
                    statValue.value = statValue.value || 0;
                    if (index !== 0) data.filledValues.splice(index, 1, statValue);
                });
                data.filledValues.splice(0, 1);
                break;
            }
            case 'weekly': {
                data.filledValues = new Array(7);
                _.each(data.values, (statValue) => {
                    let date = new Date(statValue.year, statValue.month - 1, statValue.day);
                    let diff = Math.round((date.getTime() - moment(from_time).valueOf()) / (1000 * 60 * 60 * 24));
                    statValue.x = diff;
                    data.filledValues.splice(diff, 1, statValue);
                });
                _.each(data.filledValues, (statValue, index) => {
                    statValue = statValue || {};
                    statValue.x = statValue.x || index;
                    statValue.value = statValue.value || 0;
                    data.filledValues.splice(index, 1, statValue);
                });
                break;
            }
            default: { // shift and range
                let count = (moment(to_time).valueOf() - moment(from_time).valueOf()) / (1000 * 60 * 60);
                let multiplier = 4;
                let curDate = moment(from_time).toDate();

                data.filledValues = new Array(Math.round(count) + 1);

                _.each(data.filledValues, (statValue, index) => {
                    let value = _.find(data.values, (v: any) => {
                        return v.day == curDate.getDate() && v.hour == curDate.getHours();
                    });

                    let xHour = value ? value.hour : curDate.getHours();
                    let l = String(xHour).length == 1;

                    statValue = value || {};
                    statValue.x = curDate.getTime();
                    statValue.value = value ? value.value : 0;
                    data.filledValues.splice(index, 1, statValue);
                    curDate.setHours(curDate.getHours() + 1);
                });

            }
        }
    }

    private prepareValue(value, type) {
        if (value === 0) return 0;

        switch (type) {
            case 'online': {
                return value / 1000;
            }

            case 'offline': {
                return value / 1000;
            }

            case 'distance': {
                return value / 1000;
            }

            case 'freezed': {
                return value / 3600;
            }

            case 'immobile': {
                return value / 3600;
            }

            case 'speed': {
                return typeof value === 'number' ? value : new Number(value);
            }

            default: {
                return typeof value === 'number' ? value : new Number(value);
            }
        }
    }



    public allParams(from_time: Date | string, to_time: Date | string, type: string, id: string, thirdArg: string, firstArg: string = 'params', successCallback) {
        let fortArgs = _.without(StatisticsParams.all, 'online');
        this._statistics = {};

        this.iqsStatisticsData.readStatistics(this.prepareRequest(firstArg, id, thirdArg, 'online', from_time, to_time, type), (data: Statistics[]) => {
            this._statistics['online'] = data;
            this._statistics['online'].value = this.getSum(data.values, false, null);
            this.prepareDisplayValue(this._statistics['online'], 'online');
            async.each(fortArgs, (arg, callback) => {
                this.iqsStatisticsData.readStatistics(this.prepareRequest(firstArg, id, thirdArg, arg, from_time, to_time, type), (data: Statistics[]) => {
                    if (this.isActualRequest(firstArg, id, thirdArg, 'all', from_time, to_time, type, false)) {
                        this._statistics[arg] = data;
                        this._statistics[arg].value = arg === 'speed' ? this.getSum(data.values, true, this._statistics['online'].values) : this.getSum(data.values, false, null);
                        if (arg === 'offline') {
                            let diff = (moment(to_time).valueOf() - moment(from_time).valueOf()) / 1000;
                            this._statistics[arg].value = diff - this._statistics['online'].value;
                        }
                        this.prepareDisplayValue(this._statistics[arg], arg);
                    }

                    callback();
                });
            }, (error) => {
                if (!error) {
                    this._state = States.Data;
                    if (successCallback) successCallback(this._statistics);
                }
            });
        });
    }

    public allEvents(from_time: Date | string, to_time: Date | string, type: string, firstArg: string = 'events', id: string = 'all', thirdArg: string, isIncidents: boolean = false, each: boolean = false, successCallback) {
        let forthArgs = this.iqsEventRulesViewModel.getCollection();
        if (isIncidents) forthArgs = _.filter(forthArgs, (event) => { return event.incident; });
        this._statistics = { series: [] };
        async.each(forthArgs, (arg, callback) => {
            this.iqsStatisticsData.readStatistics(this.prepareRequest('events', id, thirdArg, arg.id, from_time, to_time, type), (data: Statistics[]) => {
                if (this.isActualRequest(firstArg, id, thirdArg, 'all', from_time, to_time, type, each)) {
                    this._statistics[arg.id] = data;
                    this._statistics[arg.id].value = this.getSum(data.values, false, null);
                    this._statistics.series.push({
                        key: arg.name,
                        value: this._statistics[arg.id].value
                    });
                }
                callback();
            });
        }, (error) => {
            if (!error) {
                this._state = States.Data;
                if (successCallback) successCallback(this._statistics);
            }
        });
    }

    public allZones(from_time: Date | string, to_time: Date | string, type: string, firstArg: string = 'params', id: string = 'all', thirdArg: string, each: boolean, successCallback) {
        let thirdArgs = this.iqsZonesViewModel.zones;
        this._statistics = { series: [] };

        async.each(thirdArgs, (arg, callback) => {
            let tArg = firstArg == 'presence' || StatisticsParams.all.indexOf(firstArg) != -1 ? arg.id : thirdArg;
            let fArg = firstArg == 'presence' || StatisticsParams.all.indexOf(firstArg) != -1 ? null : arg.id;
            let displayFormat = StatisticsParams.all.indexOf(firstArg) != -1 && firstArg != 'presence' ? firstArg : 'online';
            let fActualArg = StatisticsParams.all.indexOf(firstArg) != -1 ? firstArg : 'all';

            this.iqsStatisticsData.readStatistics(this.prepareRequest(firstArg, id, tArg, fArg, from_time, to_time, type),
                (data: Statistics[]) => {
                    if (this.isActualRequest(firstArg, id, 'all', fActualArg, from_time, to_time, type, each)) {
                        this._statistics[arg.id] = data;
                        if (firstArg === 'speed') {
                            this.iqsStatisticsData.readStatistics(this.prepareRequest(firstArg, id, tArg, 'online', from_time, to_time, type), (onlineData) => {
                                this._statistics[arg.id].value = this.getSum(data.values, true, onlineData.values);
                                this._statistics.series.push({
                                    key: arg.name,
                                    value: this._statistics[arg.id].value,
                                    display: this.prepareDisplayValue(this._statistics[arg.id], displayFormat)
                                });
                                callback();
                            });
                        } else {
                            this._statistics[arg.id].value = this.getSum(data.values, false, null);
                            this._statistics.series.push({
                                key: arg.name,
                                value: this._statistics[arg.id].value,
                                display: this.prepareDisplayValue(this._statistics[arg.id], displayFormat)
                            });
                            callback();
                        }
                    } else {
                        callback();
                    }
                });
        }, (error) => {
            if (!error) {
                this._state = States.Data;
                if (successCallback) successCallback(this._statistics);
            }
        });
    }

    public allObjects(from_time: Date | string, to_time: Date | string, type: string, firstArg: string = 'params', secondArg: string, id: string = 'all', successCallback) {
        let thirdArgs = [];
        _.each(this.iqsObjectGroupsViewModel.getCollection(), (item) => {
            thirdArgs.push(item);
        });
        _.each(this.iqsObjectsViewModel.allObjects, (item) => {
            thirdArgs.push(item);
        });
        this._statistics = { series: [] };

        async.each(thirdArgs, (arg, callback) => {
            let fArg = StatisticsParams.all.indexOf(firstArg) != -1 || firstArg == 'presence' ? arg.id : secondArg;
            let tArg = StatisticsParams.all.indexOf(firstArg) != -1 ? null : arg.id;
            let displayFormat = StatisticsParams.all.indexOf(firstArg) != -1 && firstArg != 'presence' ? firstArg : 'online';
            let evArg = firstArg != 'presence' ? firstArg : 'all';
            this.iqsStatisticsData.readStatistics(this.prepareRequest(firstArg, fArg, id, tArg, from_time, to_time, type),
                (data: Statistics[]) => {
                    if (this.isActualRequest(firstArg, 'all', id, evArg, from_time, to_time, type, true)) {
                        this._statistics[arg.id] = data;
                        if (firstArg === 'speed') {
                            this.iqsStatisticsData.readStatistics(this.prepareRequest(firstArg, fArg, id, 'online', from_time, to_time, type), (onlineData) => {
                                this._statistics[arg.id].value = this.getSum(data.values, true, onlineData.values);
                                this._statistics.series.push({
                                    key: arg.name,
                                    value: this._statistics[arg.id].value,
                                    display: this.prepareDisplayValue(this._statistics[arg.id], displayFormat)
                                });
                                callback();
                            });
                        } else {
                            this._statistics[arg.id].value = this.getSum(data.values, false, null);
                            this._statistics.series.push({
                                key: arg.name,
                                value: this._statistics[arg.id].value,
                                display: this.prepareDisplayValue(this._statistics[arg.id], displayFormat)
                            });
                            callback();
                        }
                    } else {
                        callback();
                    }

                });
        }, (error) => {
            if (!error) {
                this._state = States.Data;
                if (successCallback) successCallback(this._statistics);
            }
        });
    }

    private prepareRequest(firstArg: string, secondArg: string, thirdArg: string, forthArg: string, from_time: Date | string, to_time: Date | string, type: string) {
        let name = null;

        if (firstArg == 'presence') name = firstArg + '.' + secondArg + (thirdArg === null ? '' : ('.' + thirdArg))
        else if (StatisticsParams.all.indexOf(firstArg) != -1) {
            name = 'params' + '.' + secondArg + (thirdArg === null ? '' : ('.' + thirdArg)) + (forthArg === null ? ('.' + firstArg) : ('.' + forthArg));
        } else name = firstArg + '.' + secondArg + (thirdArg === null ? '' : ('.' + thirdArg)) + (forthArg === null ? '' : ('.' + forthArg));
        let from = typeof from_time === 'string' ? from_time : from_time.toISOString();
        let to = typeof to_time === 'string' ? to_time : to_time.toISOString();
        let t = this.DateTypes[type];
        let er = new Error();

        return { name: name, from_time: from, to_time: to, type: t };
    }

    private getSameDateValue(value, values) {
        let index = _.findIndex(values, (val: any) => {
            return value.year === val.year && value.month === val.month && value.day === val.day && value.hour === val.hour;
        });

        return index > -1 ? (values[index].value > 0 ? value.value / values[index].value : 0) : 0;
    }

    private getSum(values, average = false, dividerValues) {
        let sum = 0;
        let result = null;
        let count: number = 0;
        _.each(values, (v) => {
            let value = v.value;
            if (dividerValues && _.isArray(dividerValues)) {
                value = this.getSameDateValue(v, dividerValues);
            }

            sum += value;
            if (value) count += 1;
        });
        result = average && count > 0 ? sum / count : sum;

        return result;
    }

    public get statistics() {
        return this._statistics;
    }

    private prepareDisplayValue(data, name) {
        switch (name) {
            case 'speed': {
                data.display = data.value ? this.prepareValue(data.value, name).toFixed(0) : 0;
                break;
            }

            case 'distance': {
                data.display = data.value ? this.prepareValue(data.value, name).toFixed(2) : 0;
                break;
            }

            default: {
                if (!data.value) {
                    data.display = {
                        hours: 0,
                        minutes: 0,
                        seconds: 0
                    };
                } else {
                    let h: number = Math.floor(data.value / 3600);

                    data.display = {
                        hours: h,
                        minutes: ((data.value / 60) % 60).toFixed(0),
                        seconds: ((data.value) % 60).toFixed(0)
                    };
                }
            }
        }

        return data.display;
    }

    public formatDisplayData(value, name) {
        let display = this.prepareDisplayValue({ value: value }, name);

        switch (name) {
            case 'speed': {
                return display + ' ' + this.pipTranslate.translate('KM_IN_H');
            }

            case 'distance': {
                return display + ' ' + this.pipTranslate.translate('KM');
            }

            default: {
                let h: number = Math.floor(value / 3600);
                let m: number = value - h * 3600 > 0 ? Math.floor((value - h * 3600) / 60) : 0;
                let s: number = value - h * 3600 - m * 60 > 1 ? Math.floor((value - h * 3600 - m * 60)) : 0;

                return (h > 0 ? (("0" + h).substr(-2, 2) + ':') : '00:')
                    + (m > 0 ? ("0" + m).substr(-2, 2) : '00');
            }
        }
    }

    private changeDateTypeForAllParamsRequest(type) {
        switch (type) {
            case 'daily': {
                return 'weekly';
            }

            case 'monthly': {
                return 'yearly';
            }

            default: {
                return type;
            }
        }
    }

}

