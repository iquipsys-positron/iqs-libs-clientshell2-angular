import '../data/statistics/StatisticsDataService';
import '../models/statistics/StatisticsViewModel';
import '../rest/StatisticsResources';
import '../services/statistics/StatisticsDateService';

angular.module('iqsStatistics', [
    'iqsStatistics.Data',
    'iqsStatistics.DateService',
    'iqsStatistics.Resource',
    'iqsStatistics.ViewModel'
]);