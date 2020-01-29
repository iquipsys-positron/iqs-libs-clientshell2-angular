import { IIncidentsResolutionDialogService, IncidentsResolutionDialogParams } from './IIncidentsResolutionDialogService';

class IncidentsResolutionDialogService implements IIncidentsResolutionDialogService {
    public _mdDialog: angular.material.IDialogService;

    public constructor($mdDialog: angular.material.IDialogService) {
        this._mdDialog = $mdDialog;
    }

    public show(event: any, params: IncidentsResolutionDialogParams, successCallback?: (data?: any) => void, cancelCallback?: () => void) {
        this._mdDialog.show({
            targetEvent: event,
            // templateUrl: 'incidents/dialogs/IncidentsResolutionDialog.html',
            controller: 'iqsIncidentsResolutionDialogController',
            controllerAs: '$ctrl',
            locals: params,
            bindToController: true,
            clickOutsideToClose: true,
            template: `
                <md-dialog class="pip-dialog iqs-incidents-resolution-dialog layout-column bp0 pip-scroll" md-theme="{{$ctrl.theme}}">

                <div class="pip-body pip-scroll-y p0 flex" ng-if="$ctrl.resolutions.length > 0">
                    <md-list class="pip-ref-list tp8">
                        <md-list-item class="pip-ref-list-item pointer" 
                            ng-click="$ctrl.selectItem(resolution)"
                            md-ink-ripple ng-repeat="resolution in $ctrl.resolutions track by $index">
                            <div class="pip-content">
                                {{ resolution.resolution }}
                            </div>
                        </md-list-item>
                    </md-list>
                </div>
                <div class="layout-column layout-align-center-center flex" ng-if="$ctrl.resolutions.length == 0">
                        <div class="pip-empty tp24 bp24">
                            <img src="images/empty/empty.svg" class="pip-pic">
                            <div class="pip-text tm8">
                                    {{ ::'INCIDENTS_RESOLUTION_EMPTY_TITLE' | translate }} 
                            </div>
                        </div>
                </div>
            
                <div class="pip-footer p0">
                    <md-list class="pip-ref-list flex tp0">
                        <md-list-item class="pip-ref-list-item pointer" 
                            ng-click="$ctrl.onResolutionSetting()"
                            md-ink-ripple>
                            <div class="pip-content">
                               {{ ::'INCIDENTS_RESOLUTION_SETTINGS' | translate }}
                            </div>
                        </md-list-item>
                    </md-list>        
                </div>
                </md-dialog>
            `
        })
            .then(
                (data?: any) => {
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
    .module('iqsIncidents.Dialog.Resolution')
    .service('iqsIncidentsResolutionDialog', IncidentsResolutionDialogService);