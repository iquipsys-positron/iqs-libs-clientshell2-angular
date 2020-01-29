import { IStatisticsDataService } from '../../data/statistics/IStatisticsDataService';
import { StatisticsModel } from './StatisticsModel';
import { IStatisticsViewModel } from './IStatisticsViewModel';
import { IObjectGroupsViewModel } from '../object_groups/IObjectGroupsViewModel';
import { IEventRulesViewModel } from '../event_rules/IEventRulesViewModel';
import { IZonesViewModel } from '../zones/IZonesViewModel';
import { IObjectsViewModel } from '../objects/IObjectsViewModel';
import { IOrganizationService } from '../../services';

class StatisticsViewModel implements IStatisticsViewModel {
    private model: StatisticsModel;

    constructor(
        private $log: ng.ILogService,
        private $location: ng.ILocationService,
        private $timeout: ng.ITimeoutService,
        private pipTranslate: pip.services.ITranslateService,
        private pipTransaction: pip.services.ITransactionService,
        private iqsOrganization: IOrganizationService,
        private iqsObjectGroupsViewModel: IObjectGroupsViewModel,
        private iqsObjectsViewModel: IObjectsViewModel,
        private iqsEventRulesViewModel: IEventRulesViewModel,
        private iqsZonesViewModel: IZonesViewModel,
        private iqsStatisticsData: IStatisticsDataService
    ) {
        "ngInject";

        this.model = new StatisticsModel($log, $location, $timeout, pipTransaction, pipTranslate, iqsOrganization,
            iqsObjectGroupsViewModel, iqsObjectsViewModel, iqsEventRulesViewModel, iqsZonesViewModel, iqsStatisticsData);
    }

    public get state() {
        return this.model.state;
    }

    public get selectedIndex() {
        return this.model.selectedIndex;
    }

    public get lastRequestDate(): Date {
        return this.model.lastRequestDate;
    }

    public get lastRequestType(): string {
        return this.model.lastRequestType;
    };

    public set selectedIndex(index) {
        this.model.selectedIndex = index;
    }

    public getStatistics(firstArg: string, secondArg: string, thirdArg: string, forthArg: string, from_time: Date | string, to_time: Date | string, type: string, each?: boolean, successCallback?) {
        this.model.getStatistics(firstArg, secondArg, thirdArg, forthArg, from_time, to_time, type, each, successCallback);
    }

    public get statistics() {
        return this.model.statistics;
    }

    public formatDisplayData(value, name) {
        return this.model.formatDisplayData(value, name);
    }
}

angular.module('iqsStatistics.ViewModel', ['iqsStatistics.Data'])
    .service('iqsStatisticsViewModel', StatisticsViewModel);

