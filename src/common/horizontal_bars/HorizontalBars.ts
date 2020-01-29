declare var $: JQueryStatic;

class BarElement {
    public label: string = null;
    public key: string = null;
    public value: number = null;
    public display: any;
    public color: string = 'rgba(0, 0, 0, 0.54)';
    public width: any = 0;
}

class HorizontalBarsDetailsParams {
    public item: any;
}

class HorizontalBarsController implements ng.IController {          public $onInit() {}
    private _log: ng.ILogService;
    private _$timeout: ng.ITimeoutService;
    private _$scope: ng.IScope;
    public barElements: BarElement[] = [];
    public class: string = "";
    public type: string;
    public colors: string[] = [
        '#66BB6A',
        '#FFEE58',
        '#EF5350',
        '#42A5F5',
        '#FFA726',
        '#EC407A',
        '#5C6BC0',
        '#B0BEC5',
        '#26A69A',
        '#FFCA28',
        '#7E57C2',
        '#D4E157',
        '#FF7043',
        '#FFCA28',
        '#AB47BC',
        '#9CCC65',
        '#FF7043'
    ];
    public openDetails: (param: HorizontalBarsDetailsParams) => void;

    constructor(
        public $element: any,
        $attrs: angular.IAttributes,
        $scope: angular.IScope,
        $log: ng.ILogService,
        public $timeout: ng.ITimeoutService
    ) {
        "ngInject";

        this._$scope = $scope;
        this._$scope.$watch('bars', (newBars) => {
            if (newBars == undefined || (newBars['length'] && newBars['length'] == 0)) return;

            this.barsChanged(newBars);
        });

        this.class = $attrs['class'];
        this.type = this._$scope['type'];
        this.openDetails = this._$scope['openDetails'];
    }

    private barsChanged(newBars) {
        let maxElement = _.maxBy(newBars, (bar) => { return Number(bar['value']); }),
            max = maxElement ? maxElement['value'] : 0,
            names = [],
            length = _.clone(this.barElements.length);

        newBars = _.filter(newBars, (bar: any) => {
            return bar.value != 0;
        });

        _.each(newBars, (bar) => {
            let index = _.findIndex(this.barElements,
                (el) => { return (el.label == bar.label && el.label != undefined) || (el.key == bar.key && el.key != undefined); }
            );
            names.push(bar.key || bar.label);

            if (index > -1) {
                this.barElements[index].value = bar.value;
                this.barElements[index].key = bar.key;
                this.barElements[index].label = bar.label;
                this.barElements[index].display = bar.display;
                this.barElements[index].width = this.calcRelativity(bar, max);
            } else {
                this.barElements.push(angular.extend(bar, { width: this.calcRelativity(bar, max) }));
            }
        });

        for (let i = 0; i < this.barElements.length; i) {
            if (this.barElements[i] && !names.includes(this.barElements[i].key || this.barElements[i].label)) {
                this.barElements.splice(i, 1);
            } else {
                i++;
            }
        }

        this.$timeout(() => {
            if (this.barElements.length === 0) this.$element.find('.iqs-horizontal-bars-container').addClass('no-data');
            else this.$element.find('.iqs-horizontal-bars-container').removeClass('no-data');
        });
    }

    private calcRelativity(bar, max): number {
        return max == 0 ? max : (Number(bar['value']) / max * 100);
    }

    public onDetails(bar): void {
        if (this.openDetails) {
            this.openDetails({ item: bar });
        }
    }
}

// Prevent junk from going into typescript definitions
(() => {
    function HorizontalBarsDirective() {
        return {
            restrict: 'E',
            controller: HorizontalBarsController,
            controllerAs: '$ctrl',
            scope: {
                bars: '=iqsBars',
                type: '=?iqsStatType',
                openDetails: '&iqsOpenDetails',
                class: '=class'
            },
            // templateUrl: 'common/horizontal_bars/HorizontalBars.html'
            template:
            `
            <div class="iqs-horizontal-bars-container no-data {{ $ctrl.class }} tp16">
                <div ng-repeat="bar in $ctrl.barElements" class="iqs-horizontal-bar bm16" ng-click="$ctrl.onDetails(bar)"
                     ng-style="{ 'background-color': bar.color || $ctrl.colors[$index%$ctrl.colors.length], 'width': bar.width + '%' }">
                     <div class="iqs-bar-label text-overflow" ng-class="{'white-color': bar.width > 10}">{{ bar.label || bar.key }}</div>
                     <div class="iqs-bar-value" ng-class="{'white-color': bar.width > 50}" ng-if="!$ctrl.type">{{ bar.display || bar.value }}</div>
                     <div class="iqs-bar-value" ng-class="{'white-color': bar.width > 50}" ng-if="$ctrl.type == 'speed'">{{ bar.display || 0 }} {{ 'KM_IN_H' | translate }}</div>
                     <div class="iqs-bar-value" ng-class="{'white-color': bar.width > 50}" ng-if="$ctrl.type == 'distance'">{{ bar.display || 0 }} {{ 'KM' | translate }}</div>
                     <div class="iqs-bar-value" ng-class="{'white-color': bar.width > 50}" ng-if="$ctrl.type && $ctrl.type != 'distance' && $ctrl.type != 'speed'">
                         <span ng-if="bar.display.hours && bar.display.hours > 0">{{ bar.display.hours }} {{ 'HOURS' | translate }}</span> 
                         <span ng-if="bar.display.minutes && bar.display.minutes > 0"> {{ bar.display.minutes }} {{ 'MINUTES' | translate }}</span>
                         <span>{{ bar.display.seconds || 0 }} {{ 'SECONDS' | translate }}</span>
                    </div>
                    <div class="w-stretch iqs-bar-backdrop"></div>
                </div>
                <div class="no-data-container layout-row layout-align-center-center">
                    <div class="flex empty-text">
                        {{ 'HORIZONTAL_BARS_NO_DATA' | translate }}
                    </div>
                </div>
            </div>
            `
        };
    }

    angular
        .module('iqsHorizontalBars', [])
        .directive('iqsHorizontalBars', HorizontalBarsDirective);

})();

import './HorizontalBarsStrings';
