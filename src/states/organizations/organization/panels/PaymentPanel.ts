import './AgreementPanel';
import './CreditCardPanel';

import { AgreementCategory, CreditCard, Agreement } from '../../../../data';

class PaymentParams {
    public card: CreditCard;
    public agreement: Agreement;
}

interface IPaymentPanelBindings {
    [key: string]: any;

    onSave: any;
    card: any,
    argeement: any,
    ngDisabled: any;
}

const PaymentPanelBindings: IPaymentPanelBindings = {
    onSave: '&iqsSave',
    card: '<?card',
    argeement: '<?agreement',
    ngDisabled: '&?'
}

class PaymentPanelController implements ng.IController {
    $onInit() { }
    private transaction: pip.services.Transaction;
    private creditCardPanelApi: any;
    private agreementPanelApi: any;

    public error: string;
    public api: any;

    public onSave: (params: PaymentParams) => void;
    public card: CreditCard;
    public agreementCategory: string = AgreementCategory.Card;

    public section: number;
    public sections: any[] = [
        { title: 'SITES_CREATE_CREDIT_CARD_OPTION_TITLE', id: 0 },
        { title: 'SITES_CREATE_DOGOVOR_OPTION_TITLE', id: 1 },
    ];

    constructor(
        private $state: ng.ui.IStateService,
        public pipMedia: pip.layouts.IMediaService,
        private pipPopoverService: pip.controls.IPopoverService,
        private pipTranslate: pip.services.ITranslateService,
    ) {
        "ngInject";

        this.card = {
            type: null,
            number: '',
            name: '',
        }

        this.section = 0;
    }

    public onBack() {
        this.$state.go('organizations.home');
    }

    public creditCardPanelInit(api) {
        this.creditCardPanelApi = api;
    }

    public agreementPanelInit(api) {
        this.agreementPanelApi = api;
    }

    public onCreateCreditCard(card: CreditCard): void {
        this.onSave({ card: card, agreement: null });
    }

    public onCreateAgreement(agreement: Agreement): void {
        this.onSave({ card: null, agreement: agreement });
    }

    public save(): void {
        switch (this.section) {
            case 0:
                if (this.creditCardPanelApi && typeof this.creditCardPanelApi.save === 'function') this.creditCardPanelApi.save();
                break;
            case 1:
                if (this.agreementPanelApi && typeof this.agreementPanelApi.save === 'function') this.agreementPanelApi.save();
                break;
        }
    }

    public showTip($event): void {
        this.pipPopoverService.show({
            class: 'pip-tip',
            element: $event.currentTarget,
            locals: {
                title: this.pipTranslate.translate('SITES_CREATE_CREDIT_CARD_HELP_TITLE'),
                content: this.pipTranslate.translate('SITES_CREATE_CREDIT_CARD_HELP_SUBTITLE'),
            },
            cancelCallback: function () {

            },
            controller: function ($scope, $timeout, pipPopoverService) {
                $scope.title = $scope.locals.title;
                $scope.content = $scope.locals.content;
                $scope.image = null;

                $scope.onNextClick = function () {
                    pipPopoverService.hide();
                };

                $timeout(function () {
                    $('.pip-popover').find('.pip-pic').css('background-image', 'url(' + $scope.image + ')');
                }, 200);
            },
            templateUrl: 'organizations/include/TipTemplate.html'
        });
    }
}

(() => {
    angular
        .module('iqsPaymentPanel', ['iqsCreditCardPanel', 'iqsAgreementPanel'])
        .component('iqsPaymentPanel', {
            bindings: PaymentPanelBindings,
            // templateUrl: 'states/organizations/organization/panels/PaymentPanel.html',
            controller: PaymentPanelController,
            controllerAs: '$ctrl',
            template: `
                <md-progress-linear md-mode="indeterminate" style="position: absolute;" ng-show="$ctrl.transaction && $ctrl.transaction.busy()"></md-progress-linear>
                    <div class="pip-body">

                        <div ng-show="$ctrl.error" class="pip-page-errors bm16">
                            <span class="pip-error-text color-error flex"> {{ $ctrl.error | translate }}</span>
                            <md-icon md-svg-icon="icons:warn-circle" class="color-error"></md-icon>
                        </div>

                        <div class="aux-btn-close pointer" ng-click="$ctrl.onBack()">
                            <md-icon md-svg-icon="icons:cross"></md-icon>
                        </div>

                        <h2 class="text-center bm24 lm24 rm24">
                            {{:: 'SITES_CREATE_CREDIT_CARD_TITLE' | translate}}
                        </h2>

                        <md-tabs md-dynamic-height md-stretch-tabs="auto" md-selected="$ctrl.section">
                            <md-tab label="{{ section.title | translate }}" id="{{ section.id }}" ng-repeat="section in $ctrl.sections track by $index"
                                    xxxng-click="$ctrl.selectSection(section.id)">
                            </md-tab>
                        </md-tabs>

                        <p class="text-body1 h72 bm16 iqs-info" ng-show="$ctrl.section == 0">
                            {{ ::'SITES_CREATE_CREDIT_CARD_SUBTITLE1' | translate }}
                            <span class="text-body2 text-overflow color-primary pointer" ng-click="$ctrl.showTip($event)">
                                {{ ::'SITES_CREATE_CREDIT_CARD_SUBTITLE_LINK' | translate }}
                            </span>
                            {{ ::'SITES_CREATE_CREDIT_CARD_SUBTITLE2' | translate }}
                        </p>

                        <p class="text-body1 h72 bm16 iqs-info" ng-show="$ctrl.section == 1">
                            <pip-translate-html key="SITES_CREATE_AGREEMENT_SUBTITLE" />
                            </pip-translate-html>
                        </p>


                        <iqs-credit-card-panel iqs-save="$ctrl.onCreateCreditCard(card)" iqs-init="$ctrl.creditCardPanelInit($API)"
                                               ng-disabled="$ctrl.transaction.busy()" ng-show="$ctrl.section == 0"></iqs-credit-card-panel>

                        <iqs-agreement-panel iqs-save="$ctrl.onCreateAgreement(agreement)" iqs-init="$ctrl.agreementPanelInit($API)"
                                             ng-disabled="$ctrl.transaction.busy()" ng-show="$ctrl.section == 1"></iqs-agreement-panel>

                        <div class="layout-row layout-align-start-center tm16" ng-if="$ctrl.pipMedia('gt-sm')">
                            <md-button iqs-test-back class="md-primary md-raised w-stretch flex lm0 rm8 bm0" ng-click="$ctrl.onBack()">
                                {{ ::'SITES_CREATE_BACK' | translate }}
                            </md-button>
                            <md-button iqs-test-next class="md-primary md-raised w-stretch flex lm8 rm0 bm0" ng-disabled="$ctrl.isDisabled()"
                                       type="submit" ng-click="$ctrl.save()">
                                {{ ::'SITES_CREATE_CREATE' | translate }}
                            </md-button>
                        </div>

                    </div>
            `
        })
})();