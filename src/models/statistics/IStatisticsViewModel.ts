import { Statistics } from '../../data/statistics/Statistics';

export interface IStatisticsViewModel {
    state: string;
    selectedIndex: number;
    statistics: Statistics | Statistics[];
    lastRequestDate: Date;
    lastRequestType: string;
    
    formatDisplayData(value, name);
    getStatistics(firstArg: string, secondArg: string, thirdArg: string, forthArg: string, from_time: Date | string, to_time: Date | string, type: string, each?: boolean, successCallback?): void;
}
