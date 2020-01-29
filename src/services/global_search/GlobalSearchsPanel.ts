import { IGlobalSearchService } from './IGlobalSearchService';

interface IGlobalSearchPanelBindings {
    [key: string]: any;

    ngDisabled: any;
    // search query
    searchText: any;
    // launch when item selected
    searchCallback: any;
    cancelCallback: any;
    // default value for search
    defaultValues: any;
    // search collection
    searchCollection: any;
    minLength: any;
    placeholder: any;
    menuClass: any;
}

const GlobalSearchPanelBindings: IGlobalSearchPanelBindings = {

    ngDisabled: '<?',
    searchText: '=iqsSearchQuery',
    searchCallback: '&?iqsSearchCallback',
    cancelCallback: '&?iqsCancelCallback',
    defaultValues: '<?iqsDefaultValues',
    searchCollection: '<?iqsSearchCollection',
    minLength: '<?iqsMinLength',
    placeholder: '<?iqsPlaceholder',
    menuClass: '<?iqsMenuClass'
}

class GlobalSearchPanelChanges implements ng.IOnChangesObject, IGlobalSearchPanelBindings {
    [key: string]: ng.IChangesObject<any>;

    ngDisabled: ng.IChangesObject<boolean>;
    searchText: ng.IChangesObject<string>;
    searchCallback: ng.IChangesObject<(search: any) => ng.IPromise<void>>;
    cancelCallback: ng.IChangesObject<() => ng.IPromise<void>>;
    defaultValues: ng.IChangesObject<string[]>;
    searchCollection: ng.IChangesObject<string[]>;
    minLength: ng.IChangesObject<number>;
    placeholder: ng.IChangesObject<string>;
    menuClass: ng.IChangesObject<string>;
}

class GlobalSearchPanelController implements ng.IController {          public $onInit() {}
    private elementAutocomplete: any;

    public ngDisabled: boolean;
    public selectedItem: string;
    public searchText: string;
    public defaultValues: string[];
    public searchCollection: string[];
    public searchCallback: (search: any) => void;
    public cancelCallback: () => void;
    public placeholder: string;
    public minLength: number;
    public menuClass: string;

    private launchSearch: boolean = false;
    private launchDefaultSearch: boolean = false;
    public focused: boolean;
    private _debounceChange: Function;

    constructor(
        private $element: JQuery,
        private $timeout: ng.ITimeoutService,
        public pipMedia: pip.layouts.IMediaService,
        private iqsGlobalSearch: IGlobalSearchService,
    ) {
        this.$element.addClass('iqs-global-search-panel');

        this.iqsGlobalSearch.init();
        this.placeholder = this.placeholder ? this.placeholder : 'GLOBAL_SEARCH_PLACEHOLDER';
        this.searchCollection = this.searchCollection ? this.searchCollection : [];
        this.defaultValues = this.defaultValues ? this.defaultValues : [];
        this.searchText = this.searchText ? this.searchText : '';
        this.minLength = this.minLength ? this.minLength : 2;
        this.menuClass = this.menuClass || 'iqs-global-search-menu';


        this._debounceChange = _.debounce((item: string) => {
            let res = _.find(this.searchCollection, (s: string) => {
                return s == item;
            });
            if (res && this.searchCallback) {
                this.$timeout(() => {
                    this.searchCallback({ query: item });
                }, 0);
            }
        }, 500);
    }

    public $onDestroy(): void {

    }

    public $onChanges(changes: GlobalSearchPanelChanges): void {

    }

    public $postLink(): void {

    }

    public onDefaultResult() {
        if (!this.defaultValues || this.defaultValues.length == 0) {
            return;
        }
        this.launchDefaultSearch = true;

        setTimeout(() => {
            let elementDefaultPanel = angular.element('#default-panel');
            let elementFocused = elementDefaultPanel.find('.pip-focusable').get(0).focus();
        }, 100);
    }

    public onKeyDownDefaultPanel($event: KeyboardEvent, item: string): void {
        if ($event.keyCode === 13) {
            this.searchText = item;
            this.launchDefaultSearch = false;
            this.onSearchClick();
        }
    }

    public onSearchBackdropClick() {
        this.launchDefaultSearch = false;
        setTimeout(function () {
            let elementAutocomplete = angular.element('#GlobalSearchAutocomplete');
            if (elementAutocomplete) {
                elementAutocomplete.focus();
            }
        }, 0);
    }

    public onBackdropClick() {
        this.launchDefaultSearch = false;
    }

    public onKeyDown(event: KeyboardEvent): void {
        // Enter pressed
        if (event.keyCode === 13) {
            this.launchDefaultSearch = false;
            this.onSearchClick();
            setTimeout(function () {
                let elementAutocomplete = angular.element('#GlobalSearchButton');
                if (elementAutocomplete) {
                    elementAutocomplete.focus();
                }
            }, 50);

            // ESC pressed
        } else if (event.keyCode === 27) {
            this.searchText = '';
            this.searchTextChanged();
        }
    }

    public onSearchClick() {
        if (this.ngDisabled) { return; }

        if (this.searchCallback && this.searchText) {
            setTimeout(function () {
                let elementAutocomplete = angular.element('#GlobalSearchAutocomplete');
                if (elementAutocomplete) {
                    elementAutocomplete.blur();
                }

            }, 0);
            this.searchCallback({ query: this.searchText });
        } else {
            if (!this.searchText && this.cancelCallback) {
                this.cancelCallback();
            }
        }
    }

    public isUnActive(): boolean {
        return !this.launchDefaultSearch && !this.launchSearch && !this.focused || this.ngDisabled; //!this.searchText &&
    }

    public querySearch(query: string) {
        if (!query || query.length > this.minLength || this.launchSearch) {
            this.launchSearch = false;
            let searchQuery: string = query.toLocaleLowerCase();
            return _.filter(this.searchCollection, (s: string) => {
                
                return s !== undefined && s !== null && s.indexOf(searchQuery) >= 0
            });
        } else {
            return [];
        }
    }

    public searchTextChange(text: string) {
        if (!this.searchText && this.cancelCallback) {
            this.cancelCallback();
        }
    }

    public selectedItemChange(item) {
        this._debounceChange(item);
    }

    private searchTextChanged() {
        if (this.searchText) {
            if (this.searchCallback) {
                this.searchCallback({ query: this.searchText });
            }
        } else {
            if (this.cancelCallback) {
                this.cancelCallback();
            } else {
                if (this.searchCallback) {
                    this.searchCallback({ query: null });
                }
            }
        }
    }

    public selectItem(item: string): void {
        this.searchText = item;
        this.launchDefaultSearch = false;
        this.searchTextChanged();
    }
}

(() => {
    function declareGlobalSearchStringResources(pipTranslateProvider: pip.services.ITranslateProvider) {
        pipTranslateProvider.translations('en', {
            GLOBAL_SEARCH_PLACEHOLDER: 'Search...',
            GLOBAL_SEARCH_ALL: 'All',
        });
        pipTranslateProvider.translations('ru', {
            GLOBAL_SEARCH_PLACEHOLDER: 'Найти...',
            GLOBAL_SEARCH_ALL: 'Все',
        });
    }

    angular.module('iqsGlobalSearch')
        .component('iqsGlobalSearchPanel', {
            bindings: GlobalSearchPanelBindings,
            controller: GlobalSearchPanelController,
            controllerAs: '$ctrl',
            template:
            `<div class="pip-search-container" ng-class="{'pip-search-default' : $ctrl.defaultValues && $ctrl.defaultValues.length > 0 }">
                <md-autocomplete ng-initial autofocus 
                    md-input-id="GlobalSearchAutocomplete" 
                    id="GlobalSearchAutocomplete" 
                    class="pip-combobox w-stretch " 
                    ng-class="{'iqs-search-unactive': $ctrl.isUnActive()}"
                    ng-focus="$ctrl.focused = true"
                    ng-blur="$ctrl.focused = false"
                    ng-disabled="$ctrl.ngDisabled"
                    placeholder="{{::$ctrl.placeholder | translate}}"
                    ng-keydown="$ctrl.onKeyDown($event)"
                    md-no-cache="true" 
                    md-selected-item="$ctrl.selectedItem" 
                    md-search-text="$ctrl.searchText" 
                    md-items="item in $ctrl.querySearch($ctrl.searchText)"
                    md-search-text-change="$ctrl.searchTextChange($ctrl.searchText)"
                    md-item-text="item" 
                    md-selected-item-change="$ctrl.selectedItemChange(item)" 
                    md-delay="200" xxxmd-min-length="3"
                    md-menu-class="{{::$ctrl.menuClass}}"
                    md-match-case-insensitive>
            
                    <span md-highlight-text="$ctrl.searchText">{{ item }}</span>
                </md-autocomplete>
            
            
                <md-button class="md-icon-button search-button" id="GlobalSearchButton" ng-click="$ctrl.onSearchClick()" ng-disabled="$ctrl.ngDisabled">
                    <md-icon md-svg-icon="icons:search"></md-icon>
                </md-button>
                <md-button class="md-icon-button down-button" ng-disabled="$ctrl.ngDisabled"
                    ng-click="$ctrl.onDefaultResult()" ng-if="$ctrl.defaultValues && $ctrl.defaultValues.length > 0">
                    <md-icon md-svg-icon="icons:triangle-down"></md-icon>
                </md-button>
            
                <div class="iqs-search-backdrop-panel" ng-click="$ctrl.onSearchBackdropClick()" ng-if="$ctrl.launchDefaultSearch">
                    
                </div>
                <div class="iqs-search-default-panel pip-scroll pip-scroll-y" id="default-panel" ng-if="$ctrl.launchDefaultSearch">
                    <md-list class="pip-ref-list tp0 bp0" pip-focused pip-focused-opacity="true">
            
                        <md-list-item class="pip-focusable pip-ref-list-item pointer" 
                            ng-keydown="$ctrl.onKeyDownDefaultPanel($event, defaultItem)"
                            ng-click="$ctrl.selectItem(defaultItem)"
                            md-ink-ripple ng-repeat="defaultItem in $ctrl.defaultValues">
                            <div class="pip-content">
                                {{ defaultItem }}
                            </div>
                        </md-list-item>
                    </md-list>        
                </div>
                <div class="iqs-search-backdrop" ng-click="$ctrl.onBackdropClick()" ng-if="$ctrl.launchDefaultSearch"></div>
            </div>`
        })
        .config(declareGlobalSearchStringResources);
})();





