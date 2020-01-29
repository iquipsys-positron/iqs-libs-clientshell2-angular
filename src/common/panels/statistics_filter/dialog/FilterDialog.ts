import '../../../../services/global_search/GlobalSearchService';
import { IGlobalSearchService } from '../../../../services/global_search';
import { FilterDialogParams } from './IFilterDialogService';

export class FilterDialogController extends FilterDialogParams implements ng.IController {        
    
    public $onInit() {}

    public theme;

    public isZoneFilter: boolean;
    public isObjectFilter: boolean;
    public isActionFilter: boolean;
    public isEventRuleFilter: boolean;
    public isDatePeriod: boolean;
    public isParamsFilter: boolean;
    public isDeviceFilter: boolean;

    public startDate: Date;
    public currDate: Date;
    public datePeriodType: string;
    public dateLabel: string;

    public dialogParams: any;

    constructor(
        private $mdDialog: angular.material.IDialogService,
        private $state: ng.ui.IStateService,
        private $rootScope: ng.IRootScopeService,
        private iqsGlobalSearch: IGlobalSearchService,
        params
    ) {
        "ngInject";

        super();
        this.dialogParams = params;

        this.setFillData();
    }

    private setFillData() {
        if (this.dialogParams) {
            angular.extend(this, this.dialogParams);
        }
    }
    
    public change() {
        this.$mdDialog.hide(this);
    }

    public cancel() {
        this.$mdDialog.cancel();
    }

}

angular
    .module('iqsFilterDialog', [
        'ngMaterial'
    ])
    .controller('iqsFilterDialogController', FilterDialogController);

import "./FilterDialogService"
import './FilterDialogStrings';