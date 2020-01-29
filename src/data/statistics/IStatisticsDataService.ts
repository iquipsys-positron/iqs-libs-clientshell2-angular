export interface IStatisticsDataService {
    readStatistics(params: any, successCallback?: (data: any[]) => void, errorCallback?: (error: any) => void): any;
    updateStatistics(id: string, data: any, successCallback?: (data: any) => void, errorCallback?: (error: any) => void);
    saveStatistics(data: any, successCallback?: (data: any) => void, errorCallback?: (error: any) => void);
}

export interface IStatisticsDataProvider {

}