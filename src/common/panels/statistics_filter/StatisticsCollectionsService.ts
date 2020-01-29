import { IStatisticsCollectionsService } from './IStatisticsCollectionsService';
import { IObjectsViewModel } from '../../../models/objects/IObjectsViewModel';
import { IObjectGroupsViewModel } from '../../../models/object_groups/IObjectGroupsViewModel';
import { IZonesViewModel } from '../../../models/zones/IZonesViewModel';
import { StatisticsDataCollectionItem } from './StatisticsDataCollectionItem';
import { SearchObjectTypes } from '../../../services/global_search/SearchObjectTypes';

class StatisticsCollectionsService implements IStatisticsCollectionsService {
    constructor(
        private pipTranslate: pip.services.ITranslateService,
        private iqsZonesViewModel: IZonesViewModel,
        private iqsObjectsViewModel: IObjectsViewModel,
        private iqsObjectGroupsViewModel: IObjectGroupsViewModel
    ) {
        "ngInject";


    }

    private prepareCollection(resource: any[], fieldName?: string, objectType?: string, resultCollection?: any[]): any[] {
        if (!fieldName) { fieldName = 'name'; }
        if (!resultCollection) { resultCollection = []; }

        resource = _.sortBy(resource, function (item: any) {
            return item.name ? item.name.toLocaleLowerCase() : '';
        });

        _.each(resource, (obj: any) => {
            let item: StatisticsDataCollectionItem = {
                id: obj.id,
                name: obj[fieldName]
            }
            if (objectType) {
                item.object_type = objectType;
            }
            if (obj.object_ids) {
                item.count = obj.object_ids.length;
            }
            resultCollection.push(item);
        });

        return resultCollection;
    }
    
    public getObjectAndGroupCollection(): StatisticsDataCollectionItem[] {
        let collection: StatisticsDataCollectionItem[] = [];

        collection = this.prepareCollection(this.iqsObjectGroupsViewModel.getCollection(), 'name', SearchObjectTypes.ObjectGroup );
        collection = this.prepareCollection(this.iqsObjectsViewModel.allObjects, 'name', SearchObjectTypes.ControlObject, collection);

        collection.unshift({ id: 'all', name: this.pipTranslate.translate('FILTER_OBJECT_ALL') });

        return collection;
    }

    public getZoneCollection(): StatisticsDataCollectionItem[] {
        let collection: StatisticsDataCollectionItem[] = [];

        collection = this.prepareCollection(this.iqsZonesViewModel.zones, 'name', SearchObjectTypes.Zone );

        collection.unshift({ id: 'all', name: this.pipTranslate.translate('FILTER_ZONES_ALL') });

        return collection;
    }
}

{
    angular.module('iqsStatistics.CollectionsService', [])
        .service('iqsStatisticsCollectionsService', StatisticsCollectionsService);

}