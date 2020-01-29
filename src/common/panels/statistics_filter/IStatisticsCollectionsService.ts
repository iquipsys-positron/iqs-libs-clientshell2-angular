import { StatisticsDataCollectionItem } from './StatisticsDataCollectionItem';

export interface IStatisticsCollectionsService {
    getObjectAndGroupCollection(): StatisticsDataCollectionItem[];
    getZoneCollection(): StatisticsDataCollectionItem[];
}
