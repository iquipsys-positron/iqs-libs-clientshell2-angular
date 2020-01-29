import { CreditCard, CreditCardType } from '../../../../data';

class CreditCardParams {
    card: CreditCard;
}

interface ICreditCardPanelBindings {
    [key: string]: any;

    onSave: any;
    onInit: any;
    item: any;
    ngDisabled: any;
}

const CreditCardPanelBindings: ICreditCardPanelBindings = {
    onSave: '&iqsSave',
    onInit: '&iqsInit',
    item: '<?iqsItem',
    ngDisabled: '&?'
}

class CreditCardPanelChanges implements ng.IOnChangesObject, ICreditCardPanelBindings {
    [key: string]: ng.IChangesObject<any>;

    onSave: ng.IChangesObject<() => ng.IPromise<void>>;
    onInit: ng.IChangesObject<() => ng.IPromise<void>>;
    item: ng.IChangesObject<CreditCard>;
    ngDisabled: ng.IChangesObject<() => ng.IPromise<void>>;
}

class CreditCardPanelController implements ng.IController {
    $onInit() { }

    public item: CreditCard;
    public onSave: (param: CreditCardParams) => void;
    public onInit: (api: any) => void;
    public ngDisabled: () => boolean;

    // public cardNumber: string = null;
    // public cardCode: string = null;
    // public customerFirstName: string = null;
    // public customerLastName: string = null;
    public cardType: string = CreditCardType.Visa;
    public api: any;
    // public month: number;
    // public year: number;
    public months: any[];
    public years: number[];
    private momentMonths: any[];
    private localeDate: moment.MomentLanguageData = moment.localeData();
    public form: any;
    public touchedErrorsWithHint: Function;
    public cardTypes: any[] = [
        { id: CreditCardType.Visa, title: 'CREDIT_CARD_VISA' },
        { id: CreditCardType.Maestro, title: 'CREDIT_CARD_MAESTRO' },
        { id: CreditCardType.Mastercard, title: 'CREDIT_CARD_MASTERCARD' },
        { id: CreditCardType.Discover, title: 'CREDIT_CARD_DISCOVER' },
        { id: CreditCardType.AmericanExpress, title: 'CREDIT_CARD_AMERICAN_EXPRESS' },
    ];

    constructor(
        private $element: JQuery,
        private $document: ng.IDocumentService,
        private $state: ng.ui.IStateService,
        private $scope: ng.IScope,
        private $timeout: ng.ITimeoutService,
        public pipMedia: pip.layouts.IMediaService,
        private pipFormErrors: pip.errors.IFormErrorsService,
        private pipIdentity: pip.services.IIdentityService,
    ) {
        "ngInject";

        $element.addClass('iqs-credit-card-panel');

        this.touchedErrorsWithHint = pipFormErrors.touchedErrorsWithHint;
        this.momentMonths = angular.isArray(this.localeDate['_months']) ? this.localeDate['_months'] : this.localeDate['_months'].format;
        this.months = this.monthList();
        this.years = this.yearList();

        let value = new Date();
        if (!this.item) this.item = new CreditCard();
        this.item.expire_month = value ? value.getMonth() + 1 : null;
        this.item.expire_year = value ? value.getFullYear() : null;

        const ctrl = this;
        this.$onInit = function () {
            ctrl.api = {};
            ctrl.api.save = ctrl.onSaveClick.bind(ctrl);
            ctrl.onInit({$API: ctrl.api});
        }

    }

    private monthList() {
        let months: any[] = [];

        for (let i: number = 1; i <= 12; i++) {
            months.push({
                id: i,
                name: ("0" + i).substr(-2, 2) // this.momentMonths[i - 1]
            });
        }

        return months;
    }

    private yearList(): number[] {
        let currentYear: number = new Date().getFullYear(),
            startYear: number = currentYear,
            endYear: number = currentYear + 10,
            years = [];


        for (let i: number = startYear; i <= endYear; i++) {
            years.push(i);
        }

        return years;
    }

    private prepare() {
        // this.$timeout(() => {
        //     this.form = this.$scope.form;
        // }, 1000);
    }

    public $postLink(): void {
        this.form = this.$scope.form;
    }

    public $onChanges(changes: CreditCardPanelChanges): void {
        this.prepare();
    }

    onCancel() {
        this.$state.go('organizations.home');
    }

    private getCardType(number: string): string {
        if (!number) return null;

        if (number.substring(0, 1) == '4') return CreditCardType.Visa;

        let s = number.substring(0, 2);
        if (['50', '51', '52', '53', '54', '55'].indexOf(s) > -1) return CreditCardType.Mastercard;

        return null;
    }

    public onSaveClick(): void {
        if (this.form.$invalid) {
            this.pipFormErrors.resetFormErrors(this.form, true);

            return;
        }

        if (!this.item.number) return;

        if (this.onSave) {
            let card: CreditCard = {
                type: this.getCardType(this.item.number),
                number: this.item.number.replace(/\D+/g, ""), //this.cardNumber,
                expire_month: Number(this.item.expire_month),
                expire_year: Number(this.item.expire_year),
                ccv: this.item.ccv,
                name: this.item.first_name.trim() + ' ' + this.item.last_name.trim(),
                first_name: this.item.first_name.trim(),
                last_name: this.item.last_name.trim()               // saved: true,
                // default: true,
                // state: "ok"

            };
            this.onSave({ card: card });
            this.pipFormErrors.resetFormErrors(this.form, false);
        }
    }

}

(() => {
    angular
        .module('iqsCreditCardPanel', [])
        .component('iqsCreditCardPanel', {
            bindings: CreditCardPanelBindings,
            // templateUrl: 'states/organizations/organization/panels/CreditCardPanel.html',
            controller: CreditCardPanelController,
            controllerAs: '$ctrl',
            template: `
                <form name="form" novalidate autocomplete="off" ng-submit="$ctrl.onSaveClick()">
                    <input type="password" style="display:none">

                    <div class="layout-row layout-align-start-start flex">
                        <md-input-container class="bm0 md-block flex rm24">
                            <label>{{::'SITES_CREATE_CREDIT_CARD_NUMBER_LABEL' | translate}}</label>
                            <input iqs-test-card-number type="text" value="" autocomplete="off" name="cardNumber" aria-label="CURD_NUMBER"
                                   ng-model="$ctrl.item.number" required ng-pattern="/^[ -]*(?:4[ -]*(?:\d[ -]*){11}(?:(?:\d[ -]*){3})?\d|5[ -]*[1-5](?:[ -]*[0-9]){14}|3[ -]*[47](?:[ -]*[0-9]){13})[ -]*$/" />
                            <div ng-messages="$ctrl.touchedErrorsWithHint($ctrl.form, $ctrl.form.cardNumber, true)" role="alert">
                                <div ng-message="required">{{ 'SITES_CREATE_CREDIT_CARD_NUMBER_REQ_ERR' | translate }}</div>
                                <div ng-message="pattern">{{ 'SITES_CREATE_CREDIT_CARD_NUMBER_PATTERN_ERR' | translate }}</div>
                            </div>
                        </md-input-container>

                        <md-input-container class="bm0 md-block w100">
                            <label>{{::'SITES_CREATE_CREDIT_CARD_CODE_LABEL' | translate}}</label>
                            <input iqs-test-password type="password" value="" autocomplete="off" name="cardCode" aria-label="CURD_CODE"
                                   ng-model="$ctrl.item.ccv" required ng-pattern="/^[0-9]{3,4}$/" />
                            <div ng-messages="$ctrl.touchedErrorsWithHint($ctrl.form, $ctrl.form.cardCode, true)" role="alert">
                                <div ng-message="required">{{ 'SITES_CREATE_CREDIT_CARD_CODE_REQ_ERR' | translate }}</div>
                                <div ng-message="pattern">{{ 'SITES_CREATE_CREDIT_CARD_CODE_PATTERN_ERR' | translate }}</div>
                            </div>
                        </md-input-container>
                    </div>

                    <div class="layout-row layout-align-start-center flex">
                        <md-input-container class="bm0 rm16 md-block flex">
                            <label>{{::'SITES_CREATE_CREDIT_CARD_FIRST_NAME_LABEL' | translate}}</label>
                            <input iqs-test-card-name type="text" value="" autocomplete="off" name="customerFirstName" aria-label="CUSTOMER_NAME"
                                   ng-model="$ctrl.item.first_name" required ng-pattern="/^[a-zA-Z]+(([',. -][a-zA-Z ])?[a-zA-Z]*)*$/" />
                            <div ng-messages="$ctrl.touchedErrorsWithHint($ctrl.form, $ctrl.form.customerFirstName, true)" role="alert">
                                <div ng-message="required">{{ 'SITES_CREATE_CREDIT_CARD_FIRST_NAME_REQ_ERR' | translate }}</div>
                                <div ng-message="pattern">{{ 'SITES_CREATE_CREDIT_CARD_FIRST_NAME_PATTERN_ERR' | translate }}</div>
                            </div>
                        </md-input-container>
                        <md-input-container class="bm0 md-block flex">
                            <label>{{::'SITES_CREATE_CREDIT_CARD_LAST_NAME_LABEL' | translate}}</label>
                            <input iqs-test-card-name type="text" value="" autocomplete="off" name="customerLastName" aria-label="CUSTOMER_NAME"
                                   ng-model="$ctrl.item.last_name" required ng-pattern="/^[a-zA-Z]+(([',. -][a-zA-Z ])?[a-zA-Z]*)*$/" />
                            <div ng-messages="$ctrl.touchedErrorsWithHint($ctrl.form, $ctrl.form.customerLastName, true)" role="alert">
                                <div ng-message="required">{{ 'SITES_CREATE_CREDIT_CARD_LAST_NAME_REQ_ERR' | translate }}</div>
                                <div ng-message="pattern">{{ 'SITES_CREATE_CREDIT_CARD_LAST_NAME_PATTERN_ERR' | translate }}</div>
                            </div>
                        </md-input-container>
                    </div>

                    <div>
                        <div class="text-caption">{{::'SITES_CREATE_CREDIT_CARD_EXPIRED_LABEL' | translate}}</div>
                        <div class="layout-row layout-align-start-center flex">
                            <md-input-container class="bm0 tm0 md-block flex">
                                <md-select class="flex" ng-model="$ctrl.item.expire_month">
                                    <md-option ng-value="opt.id" ng-repeat="opt in $ctrl.months track by opt.id">
                                        {{:: opt.name }}
                                    </md-option>
                                </md-select>
                            </md-input-container>
                            /
                            <md-input-container class="bm0 tm0 md-block flex">
                                <md-select class="flex" ng-model="$ctrl.item.expire_year">
                                    <md-option ng-value="opt" ng-repeat="opt in $ctrl.years track by opt">
                                        {{:: opt }}
                                    </md-option>
                                </md-select>
                            </md-input-container>
                        </div>
                    </div>

                    <div ng-if="!$ctrl.pipMedia('gt-sm')">
                        <md-button iqs-test-back class="md-primary md-raised w-stretch flex lm0 rm0 tm16" ng-click="$ctrl.onCancel()">
                            {{ ::'SITES_CREATE_BACK' | translate }}
                        </md-button>
                        <md-button iqs-test-next class="md-primary md-raised w-stretch flex lm0 rm0 bm0" ng-disabled="$ctrl.isDisabled()"
                                   xxxng-click="$ctrl.onSaveClick()" type="submit">
                            {{ ::'SITES_CREATE_CREATE' | translate }}
                        </md-button>
                    </div>

                    <!--
                    <div class="layout-row layout-align-start-center tm16" ng-if="$ctrl.pipMedia('gt-sm')">
                        <md-button iqs-test-back class="md-primary md-raised w-stretch flex lm0 rm8 bm0" ng-click="$ctrl.onCancel()">
                            {{ ::'SITES_CREATE_BACK' | translate }}
                        </md-button>
                        <md-button iqs-test-next class="md-primary md-raised w-stretch flex lm8 rm0 bm0" ng-disabled="$ctrl.isDisabled()" xxxng-click="$ctrl.onSaveClick()"
                            type="submit">
                            {{ ::'SITES_CREATE_CREATE' | translate }}
                        </md-button>
                    </div>
                    -->
                </form>
            `
        })
})();
