import { SearchResultChecked } from '../';
import {
    IGlobalSearchService,
    SearchObjectTypes
} from '../../../services';
import { MultiSelectDialogParams, MultiSelectDialogData } from './IMultiSelectDialogService';

export class MultiSelectDialogController extends MultiSelectDialogParams implements ng.IController {        
    
    public $onInit() {}
    
    public theme;
    public defaultCollection: string[];
    public searchedCollection: string[];

    public search: string;
    public collection: SearchResultChecked[];
    public allCollection: SearchResultChecked[];
    public initCollection: MultiSelectDialogData[];

    public objectType: string;

    constructor(
        private $mdDialog: angular.material.IDialogService,
        private $state: ng.ui.IStateService,
        private $rootScope: ng.IRootScopeService,
        private iqsGlobalSearch: IGlobalSearchService,
        params
    ) {
        "ngInject";

        super();

        this.dialogTitle = params.dialogTitle ? params.dialogTitle : 'ENTITY_DEFAULT_DIALOG_TITLE';
        this.initCollection = params.initCollection ? _.uniq(params.initCollection) : [];
        this.entityType = params.entityType ? params.entityType : SearchObjectTypes.ControlObject;
        this.configState = params.configState ? params.configState : '';
        this.addButtonLabel = params.addButtonLabel ? params.addButtonLabel : 'ADD';

        this.theme = $rootScope[pip.themes.ThemeRootVar];
        this.search = '';
        this.objectType = SearchObjectTypes.ControlObject;

        this.searchedCollection = this.iqsGlobalSearch.getSpecialSearchCollection(
            this.entityType,
            () => {
                this.searchedCollection = this.iqsGlobalSearch.getSpecialSearchCollection(this.entityType);
                this.onSearchResult(this.search);
            });
        this.defaultCollection = this.iqsGlobalSearch.getDefaultCollection(this.entityType);
        this.onSearchResult(this.search, true);
    }

    private initSelectedItems() {
        if (this.initCollection && this.initCollection.length > 0) {
            this.initCollection.forEach(element => {
                let index: number = _.findIndex(this.collection, { id: element.id });
                if (index != - 1) {
                    this.collection[index].checked = true;
                }
            });
        }
    }

    private updateCollection() {
        let initCollection: MultiSelectDialogData[] = [];
        _.each(this.collection, (item: SearchResultChecked) => {
            let index = _.findIndex(this.allCollection, { id: item.id });
            if (index > -1) {
                this.allCollection[index].checked = item.checked;
            } 
        });

        _.each(this.allCollection, (item: SearchResultChecked) => {
            if (item.checked) {
                initCollection.push(item);
            }
        });

        this.initCollection = initCollection;
    }

    public onSearchResult(query: string, notUpdateCollection?: boolean) {
        this.search = query;
        if (!notUpdateCollection) this.updateCollection();
        this.iqsGlobalSearch.searchObjectsParallel(query, this.entityType,
            (data) => {
                this.collection = data;
                this.initSelectedItems();
                if (notUpdateCollection) this.allCollection = _.cloneDeep(this.collection);;
            });
    }

    public onCanselSearch() {
        this.search = '';
        this.onSearchResult(this.search);
    }

    private getSelected() {
        this.updateCollection();
        let result: SearchResultChecked[] = [];
        _.each(this.allCollection, (item: SearchResultChecked) => {
            if (item.checked) {
                result.push(item)
            }
        });

        return result;
    }

    public change() {
        this.$mdDialog.hide(this.getSelected());
    }

    public cancel() {
        this.$mdDialog.cancel();
    }

    public config() {
        if (this.configState) {
            this.$mdDialog.cancel();
            this.$state.go(this.configState);
        }
    }

}


angular
    .module('iqsMultiSelectDialog', [
        'ngMaterial', 'iqsFormats.ObjectFilter'
    ])
    .controller('iqsMultiSelectDialogController', MultiSelectDialogController);

import './MultiSelectDialogService'
import './MultiSelectDialogStrings';