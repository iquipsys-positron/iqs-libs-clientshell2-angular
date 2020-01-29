
import { MultiSelectDialogData, SearchResultChecked } from '../';
import { SendSignalData, SignalType } from '../../../data';
import {
    IObjectsViewModel,
    IObjectGroupsViewModel,
    IZonesViewModel
} from '../../../models';
import {
    IGlobalSearchService,
    SearchObjectTypes
} from '../../../services';

export class SendSignalDialogController implements ng.IController {          public $onInit() {}
    public theme;
    public signalTypeCollection: any;
    public signalType: number = SignalType.Attention;

    public objectCategory: string = SearchObjectTypes.ControlObject;
    public controlObject: string = SearchObjectTypes.ControlObject;
    public zone: string = SearchObjectTypes.Zone;

    public objectInclude: MultiSelectDialogData[];
    public zoneInclude: MultiSelectDialogData[];
    public includeObjectSearch: string;
    public includeZoneSearch: string;
    private variantsObject: any[];
    private variantsZone: any[];

    public dialogState: string;
    
    public collectionObjects: SearchResultChecked[];
    public collectionZones: SearchResultChecked[];
    // public objectInclude: SearchResultChecked[];
    // public zoneInclude: SearchResultChecked[];
    public objectType: string;

    public searchedCollectionObjects: string[];
    public defaultCollectionObjects: string[];
    public searchedCollectionZones: string[];
    public defaultCollectionZones: string[];
    public queryObjects: string = '';
    public queryZones: string = '';

    constructor(
        private $mdDialog: angular.material.IDialogService,
        private $state: ng.ui.IStateService,
        private $rootScope: ng.IRootScopeService,
        private iqsGlobalSearch: IGlobalSearchService,
        private iqsObjectsViewModel: IObjectsViewModel,
        private iqsObjectGroupsViewModel: IObjectGroupsViewModel,
        private iqsZonesViewModel: IZonesViewModel
    ) {
        "ngInject";

        this.theme = $rootScope[pip.themes.ThemeRootVar];
        this.objectType = SearchObjectTypes.ControlObject;
        this.searchedCollectionObjects = this.iqsGlobalSearch.getSpecialSearchCollection(SearchObjectTypes.ObjectsAndGroups);
        this.searchedCollectionZones = this.iqsGlobalSearch.getSpecialSearchCollection(SearchObjectTypes.Zone);        
        this.dialogState = 'main';
        this.onSearchResultObjects(this.queryObjects);
        this.onSearchResultZones(this.queryZones);

        this.init();
    }

    private init() {
        this.signalTypeCollection = [];
        // this.signalTypeCollection.push({ title: 'SIGNAL_TYPE_NONE', id: SignalType.None });
        this.signalTypeCollection.push({ title: 'SIGNAL_TYPE_ATTENSION', id: SignalType.Attention });
        this.signalTypeCollection.push({ title: 'SIGNAL_TYPE_WARNING', id: SignalType.Warning });
        this.signalTypeCollection.push({ title: 'SIGNAL_TYPE_EMERGENCY', id: SignalType.Emergency });
        this.signalTypeCollection.push({ title: 'SIGNAL_TYPE_CONFIRMATION', id: SignalType.Confirmation });

        this.variantsObject = [];
        this.variantsZone = [];

        _.each(this.iqsObjectsViewModel.allObjects, (item: any) => {
            if (item.device_id) {
                item.object_type = SearchObjectTypes.ControlObject;
                this.variantsObject.push(item);
            }
        });
        _.each(this.iqsObjectGroupsViewModel.getCollection(), (item: any) => {
            item.object_type = SearchObjectTypes.ObjectGroup;
            this.variantsObject.push(item);
        });

        _.each(this.iqsZonesViewModel.zones, (item: any) => {
            item.object_type = SearchObjectTypes.Zone;
            this.variantsZone.push(item);
        });

        this.objectInclude = [];
        this.zoneInclude = [];
    }

    private getSelected(): SendSignalData {
        let result: SendSignalData = new SendSignalData();

        result.object_ids = this.getIds(this.objectInclude, SearchObjectTypes.ControlObject);
        result.zone_ids = this.getIds(this.zoneInclude, SearchObjectTypes.Zone);
        result.group_ids = this.getIds(this.objectInclude, SearchObjectTypes.ObjectGroup);
        result.signal = this.signalType;

        return result;
    }

    private getCollection(collection: any[], collectionIds: string[], type?: string): MultiSelectDialogData[] {
        let result: MultiSelectDialogData[] = [];

        _.each(collectionIds, (id: string) => {
            let index = _.findIndex(collection, { id: id });
            if (index != -1) {
                let item = collection[index];
                item.object_type = type;
                result.push(item);
            }
        });

        return result;
    }

    private getIds(collection: any[], entityType?: string): string[] {
        let result: string[] = [];
        _.each(collection, (item: any) => {
            if (entityType && item.object_type == entityType) {
                result.push(item.id);
            }
        });

        return result;
    }

    public send() {
        this.$mdDialog.hide(this.getSelected());
    }

    public cancel() {
        this.$mdDialog.cancel();
    }

    public getVariantsObjectsInclude(search: string) {
        let res = _.filter(this.variantsObject, (variant: any) => {
            return variant.name.toLowerCase().includes(search.toLowerCase()) ||
                variant.id.toLowerCase().includes(search.toLowerCase());
        });
        return _.differenceBy(res, this.objectInclude, 'id');
    }

    public getVariantsZonesInclude(search: string) {
        let res = _.filter(this.variantsZone, (variant: any) => {
            return variant.name.toLowerCase().includes(search.toLowerCase()) ||
                variant.id.toLowerCase().includes(search.toLowerCase());
        });
        return _.differenceBy(res, this.zoneInclude, 'id');
    }

    public onSearchResultObjects(query: string) {
        this.queryObjects = query;
        this.iqsGlobalSearch.searchObjectsParallel(query, SearchObjectTypes.ObjectsAndGroups,
            (data) => {
                this.collectionObjects = data;
                this.initSelectedObjectsItems();
            });
    }

    public onSearchResultZones(query: string) {
        this.queryZones = query;
        this.iqsGlobalSearch.searchObjectsParallel(query, SearchObjectTypes.Zone,
            (data) => {
                this.collectionZones = data;
                this.initSelectedZonesItems();
            });
    }

    public initSelectedObjectsItems() {
        this.collectionObjects.forEach((element, i) => {
            let index: number = _.findIndex(this.objectInclude, { id: element.id });
            this.collectionObjects[i].checked = index != - 1;
        });
    }

    public initSelectedZonesItems() {
        this.collectionZones.forEach((element, i) => {
            let index: number = _.findIndex(this.zoneInclude, { id: element.id });
            this.collectionZones[i].checked = index != - 1;
        });
    }
    
    public onCanselSearchObjects() {
        this.queryObjects = '';
        this.onSearchResultObjects(this.queryObjects);
    }
    
    public onCanselSearch() {
        this.queryZones = '';
        this.onSearchResultZones(this.queryZones);
    }

    public openObjectsAndGroupsState() {
        this.initSelectedObjectsItems();
        this.dialogState = 'objects';
    }

    public openZonesState() {
        this.initSelectedZonesItems();
        this.dialogState = 'zones';
    }

    public onSetObjectsClick() {
        this.dialogState = 'main';
        this.objectInclude = [];
        this.queryObjects = '';
        _.each(this.collectionObjects, (item) => {
            if (item.checked) {
                item.item.object_type = item.object_type;
                this.objectInclude.push(item.item);
            }
        });
    }

    public onSetZonesClick() {
        this.dialogState = 'main';
        this.zoneInclude = [];
        this.queryZones = '';
        _.each(this.collectionZones, (item) => {
            if (item.checked) {
                item.item.object_type = item.object_type;
                this.zoneInclude.push(item.item);
            }
        });
    }

}


angular
    .module('iqsSendSignalDialog', [
        'ngMaterial', 'iqsFormats.ObjectFilter'
    ])
    .controller('iqsSendSignalDialogController', SendSignalDialogController);

import './SendSignalDialogService';
import './SendSignalDialogStrings';