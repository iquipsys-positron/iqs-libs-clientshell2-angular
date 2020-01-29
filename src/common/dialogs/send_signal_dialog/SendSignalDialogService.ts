import { ISendSignalDialogService } from './ISendSignalDialogService';
import { SendSignalData } from '../../../data';

class SendSignalDialogService implements ISendSignalDialogService {
    public _mdDialog: angular.material.IDialogService;
    
    public constructor($mdDialog: angular.material.IDialogService) {
        this._mdDialog = $mdDialog;
    }


    public show(successCallback?: (data?: SendSignalData) => void, cancelCallback?: () => void) {
        this._mdDialog.show({
            controller: 'iqsSendSignalDialogController',
            controllerAs: '$ctrl',
            clickOutsideToClose: true,
            template:
            `<md-dialog class="pip-dialog layout-column bp0 pip-scroll iqs-send-signal-dialog" style="min-height: 450px; max-width: 80%"
             md-theme="{{$ctrl.theme}}">
            
                <div class="pip-header p16 layout-column">
                    <div class="w-stretch">
                        <h3 class="m0 w-stretch">{{ ::'SEND_SIGNAL_DIALOG_TITLE' | translate }}</h3>
                    </div>
                    <iqs-global-search-panel class="bm16" ng-if="$ctrl.dialogState === 'objects'" iqs-search-query="$ctrl.queryObjects"
                     iqs-search-callback="$ctrl.onSearchResultObjects(query)" iqs-default-values="$ctrl.defaultCollectionObjects"
                     iqs-search-collection="$ctrl.searchedCollectionObjects" iqs-cancel-callback="$ctrl.onCanselSearchObjects()">
                    </iqs-global-search-panel>
                    <iqs-global-search-panel class="bm16" ng-if="$ctrl.dialogState === 'zones'" iqs-search-query="$ctrl.queryZones"
                     iqs-search-callback="$ctrl.onSearchResultZones(query)" iqs-default-values="$ctrl.defaultCollectionZones"
                     iqs-search-collection="$ctrl.searchedCollectionZones" iqs-cancel-callback="$ctrl.onCanselSearchZones()">
                    </iqs-global-search-panel>
                </div>
            
                <div class="pip-body lp16 rp16" ng-if="$ctrl.dialogState === 'main'">
            
                    <md-input-container class="md-block flex hide-md-errors-spacer">
                        <label>
                            {{ 'SEND_SIGNAL_TYPE_LABEL' | translate }}
                        </label>
                        <md-select ng-model="$ctrl.signalType">
            
                            <md-option ng-repeat="obj in $ctrl.signalTypeCollection track by $index" ng-value="obj.id">
                                {{ ::obj.title | translate}}
                            </md-option>
                        </md-select>
                    </md-input-container>
            
                    <md-radio-group ng-model="$ctrl.objectCategory" class="layout-row bm24">
                        <md-radio-button ng-value="$ctrl.controlObject" class="flex">
                            {{:: 'SEND_SIGNAL_OBJECT_OPTION_TITLE' | translate}}
                        </md-radio-button>
                        <md-radio-button ng-value="$ctrl.zone" class="flex">
                            {{:: 'SEND_SIGNAL_ZONE_OPTION_TITLE' | translate}}
                        </md-radio-button>
                    </md-radio-group>
            
                    <div class="layout-row" xxxstyle="margin-top: -16px" ng-if="$ctrl.objectCategory == $ctrl.controlObject">
                        <md-chips class="display flex" ng-model="$ctrl.objectInclude" md-autocomplete-snap md-require-match="true">
                            <md-autocomplete class="text-subhead1 flex" md-items="chip in $ctrl.getVariantsObjectsInclude($ctrl.includeObjectSearch)"
                             md-selected-item='chip' md-search-text="$ctrl.includeObjectSearch" md-menu-class="iqs-global-search-menu"
                             placeholder="{{ ::'SEND_SIGNAL_OBJECTS_PLACEHOLDER' | translate }}">
                                <span md-highlight-text="$ctrl.includeObjectSearch">{{ chip.name }}</span>
                                <md-item-template>
                                    {{ chip.name }}
                                </md-item-template>
                            </md-autocomplete>
                            <md-chip-template class="layout-row rm8">
                                <pip-avatar class="pip-face rm8" pip-rebind="true" pip-id="$chip.id" pip-name="$chip.name">
                                </pip-avatar>
                                <span>
                                    {{ $chip.name }}
                                </span>
                            </md-chip-template>
                        </md-chips>
                        <md-button class="md-icon-button flex-fixed tm8 rm0" ng-click="$ctrl.openObjectsAndGroupsState()">
                            <md-icon md-svg-icon="icons:search"></md-icon>
                        </md-button>
                    </div>
            
                    <div class="layout-row" xxxstyle="margin-top: -16px" ng-if="$ctrl.objectCategory == $ctrl.zone">
                        <md-chips class="display flex" ng-model="$ctrl.zoneInclude" md-autocomplete-snap md-require-match="true">
                            <md-autocomplete class="text-subhead1 flex" md-items="chip in $ctrl.getVariantsZonesInclude($ctrl.includeZoneSearch)"
                             md-selected-item='chip' md-search-text="$ctrl.includeZoneSearch" md-menu-class="iqs-global-search-menu"
                             placeholder="{{ ::'SEND_SIGNAL_ZONES_PLACEHOLDER' | translate }}">
                                <span md-highlight-text="$ctrl.includeZoneSearch">{{ chip.name }}</span>
                                <md-item-template>
                                    {{ chip.name }}
                                </md-item-template>
                            </md-autocomplete>
                            <md-chip-template class="layout-row rm8">
                                <pip-avatar class="pip-face rm8" pip-rebind="true" pip-id="$chip.id" pip-name="$chip.name">
                                </pip-avatar>
                                <span>
                                    {{ $chip.name }}
                                </span>
                            </md-chip-template>
                        </md-chips>
                        <md-button class="md-icon-button flex-fixed tm8 rm0" ng-click="$ctrl.openZonesState()">
                            <md-icon md-svg-icon="icons:search"></md-icon>
                        </md-button>
                    </div>
                </div>
            
            
                <div class="pip-body lp0 rp0" ng-if="$ctrl.dialogState === 'objects'">
                    <md-list class="pip-ref-list tp0" ng-if="$ctrl.collectionObjects.length > 0">
                        <md-list-item class="pip-ref-list-item divider-bottom" md-ink-ripple ng-repeat="section in $ctrl.collectionObjects track by $index"
                         ng-click="$ctrl.selectItem($index, $ctrl.collectionObjects)">
                            <div class="layout-row w-stretch layout-align-start-center">
                                <div class="pip-pic tm0 flex-fixed" ng-if="section.item.id || section.item.name">
                                    <pip-avatar class="pip-face" pip-rebind="true" pip-id="section.item.id" pip-name="section.item.name"></pip-avatar>
                                </div>
                                <div class="pip-content flex" ng-class="{'content-single': section.object_type != $ctrl.objectType }">
                                    <p class="pip-title text-overflow flex">
                                        {{ section.item.name }}
                                    </p>
                                    <p class="pip-subtitle text-overflow flex" ng-if="section.object_type == $ctrl.objectType">
                                        {{ section.item | formatObjectSubtitle }}
                                    </p>
                                </div>
                                <div class="flex-fixed">
                                    <md-checkbox ng-model="section.checked" class="bm0">
                                    </md-checkbox>
                                </div>
                            </div>
                        </md-list-item>
                    </md-list>
            
                    <div class="pip-empty bm24" ng-if="$ctrl.collectionObjects.length === 0">
                        <img src="images/EmptyState.svg" class="pip-pic">
                        <div class="pip-text">
                            {{ ::'SEARCH_DIALOG_NO_OBJECTS' | translate }}
                        </div>
                    </div>
                </div>
            
            
                <div class="pip-body lp0 rp0" ng-if="$ctrl.dialogState === 'zones'">
                    <md-list class="pip-ref-list tp0" ng-if="$ctrl.collectionZones.length > 0">
                        <md-list-item class="pip-ref-list-item divider-bottom" md-ink-ripple ng-repeat="section in $ctrl.collectionZones track by $index"
                         ng-click="$ctrl.selectItem($index, $ctrl.collectionZones)">
                            <div class="layout-row w-stretch layout-align-start-center">
                                <div class="pip-pic tm0 flex-fixed" ng-if="section.item.id || section.item.name">
                                    <pip-avatar class="pip-face" pip-rebind="true" pip-id="section.item.id" pip-name="section.item.name"></pip-avatar>
                                </div>
                                <div class="pip-content flex content-single">
                                    <p class="pip-title text-overflow flex">
                                        {{ section.item.name }}
                                    </p>
                                </div>
                                <div class="flex-fixed">
                                    <md-checkbox ng-model="section.checked" class="bm0">
                                    </md-checkbox>
                                </div>
                            </div>
                        </md-list-item>
                    </md-list>
            
                    <div class="pip-empty bm24" ng-if="$ctrl.collectionZones.length === 0">
                        <img src="images/EmptyState.svg" class="pip-pic">
                        <div class="pip-text">
                            {{ ::'SEARCH_DIALOG_NO_ZONESS' | translate }}
                        </div>
                    </div>
                </div>
            
            
                <div class="pip-footer ">
                    <div class="flex"></div>
                    <md-button class="md-accent" ng-click="$ctrl.cancel()">{{ ::'CANCEL' | translate }}</md-button>
                    <md-button class="md-accent" ng-if="$ctrl.dialogState === 'main'" ng-click="$ctrl.send()">
                        {{ ::'SEND_SIGNAL_DIALOG_SEND' | translate }}
                    </md-button>
                    <md-button class="md-accent" ng-if="$ctrl.dialogState === 'objects'" ng-click="$ctrl.onSetObjectsClick()">
                        {{ ::'SEND_SIGNAL_DIALOG_OBJECTS' | translate }}
                    </md-button>
                    <md-button class="md-accent" ng-if="$ctrl.dialogState === 'zones'" ng-click="$ctrl.onSetZonesClick()">
                        {{ ::'SEND_SIGNAL_DIALOG_ZONES' | translate }}
                    </md-button>
                </div>
            </md-dialog>`
        })
        .then(
            (data?: SendSignalData) => {
                if (successCallback) {
                    successCallback(data);
                }
            },
            () => {
                if (cancelCallback) {
                    cancelCallback();
                }
            }
        );
    }

}

angular
    .module('iqsSendSignalDialog')
    .service('iqsSendSignalDialog', SendSignalDialogService);