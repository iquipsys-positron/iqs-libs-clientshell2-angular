import { Agreement, IAgreementsDataService } from '../../../../data';

class AgreementParams {
    public agreement: Agreement;
}

interface IAgreementPanelBindings {
    [key: string]: any;

    onSave: any;
    onInit: any;
    ngDisabled: any;
}

const AgreementPanelBindings: IAgreementPanelBindings = {
    onSave: '&iqsSave',
    onInit: '&iqsInit',
    ngDisabled: '&?'
}

class AgreementPanelChanges implements ng.IOnChangesObject, IAgreementPanelBindings {
    [key: string]: ng.IChangesObject<any>;

    onSave: ng.IChangesObject<() => ng.IPromise<void>>;
    onInit: ng.IChangesObject<() => ng.IPromise<void>>;
    ngDisabled: ng.IChangesObject<() => ng.IPromise<void>>;
}

class AgreementPanelController implements ng.IController {
    public $onInit() { }
    public onSave: (param: AgreementParams) => void;
    public onInit: (api: any) => void;
    public ngDisabled: () => boolean;
    public form: any;
    public api: any;
    public touchedErrorsWithHint: Function;
    public agreementInn: string;
    public agreementNumber: string;
    private transaction: pip.services.Transaction;

    constructor(
        private $element: JQuery,
        private $state: ng.ui.IStateService,
        private $timeout: ng.ITimeoutService,
        private $scope: ng.IScope,
        public pipMedia: pip.layouts.IMediaService,
        private pipFormErrors: pip.errors.IFormErrorsService,
        private pipTransaction: pip.services.ITransactionService,
        private iqsAgreementsData: IAgreementsDataService
    ) {
        "ngInject";

        this.transaction = pipTransaction.create('verify_agreement');

        $element.addClass('iqs-agreement-panel');
        this.touchedErrorsWithHint = pipFormErrors.touchedErrorsWithHint;

        const ctrl = this;
        this.$onInit = function () {
            ctrl.api = {};
            ctrl.api.save = ctrl.onSaveClick.bind(ctrl);
            ctrl.onInit({$API: ctrl.api});
        }
    }

    public $postLink(): void {
        this.form = this.$scope.form;

    }

    public onCancel() {
        this.$state.go('organizations.home');
    }

    public onChange() {
        this.form.agreementNumber.$setValidity('agreementValidate', true);
    }

    public onSaveClick(): void {
        if (this.form && (this.form.$invalid || !this.agreementNumber)) {
            this.pipFormErrors.resetFormErrors(this.form, true);

            return;
        }
        if (this.onSave) {
            this.transaction.begin('verify');
            let agreement: Agreement = {
                inn: this.agreementInn,
                number: this.agreementNumber
            };

            // verify agreement 
            this.iqsAgreementsData.verifyAgreement(
                agreement.number,
                (data?: any) => {
                    if (data == false) {
                        // set verify
                        if (this.form && this.form.agreementNumber) {
                            this.form.agreementNumber.$setValidity('agreementValidate', false);
                        }
                    } else {
                        if (this.form && this.form.agreementNumber) {
                            this.form.agreementNumber.$setValidity('agreementValidate', true);
                        }
                        this.onSave({ agreement: agreement });
                        this.pipFormErrors.resetFormErrors(this.form, false);
                    }
                    this.transaction.end();
                },
                (error: any) => {
                    this.transaction.end(error);
                    // set verify
                    if (this.form && this.form.agreementNumber) {
                        this.form.agreementNumber.$setValidity('agreementValidate', false);
                    }
                }
            );

        }
    }


}

(() => {
    angular
        .module('iqsAgreementPanel', [])
        .component('iqsAgreementPanel', {
            bindings: AgreementPanelBindings,
            // templateUrl: 'states/organizations/organization/panels/AgreementPanel.html',
            controller: AgreementPanelController,
            controllerAs: '$ctrl',
            template: `
                <form name="form" novalidate autocomplete="off" ng-submit="$ctrl.onSaveClick()">
                    <input type="password" style="display:none">

                    <md-input-container class="bm0 md-block flex">
                        <label>{{::'SITES_CREATE_AGREEMENT_NUMBER_LABEL' | translate}}</label>
                        <input iqs-test-card-number type="text" value="" autocomplete="off" name="agreementNumber" aria-label="AGREEMENT_NUMBER"
                               ng-model="$ctrl.agreementNumber" required ng-disabled="$ctrl.isDisabled()" ng-change="$ctrl.onChange()" />

                        <div ng-messages="$ctrl.touchedErrorsWithHint($ctrl.form, $ctrl.form.agreementNumber)" role="alert">
                            <div ng-message="required">{{ 'SITES_CREATE_AGREEMENT_NUMBER_REQ_ERR' | translate }}</div>
                            <div ng-message="agreementValidate">{{ 'SITES_CREATE_AGREEMENT_VALIDATE_ERROR' | translate }}</div>
                        </div>
                    </md-input-container>

                    <md-input-container class="bm0 md-block flex">
                        <label>{{::'SITES_CREATE_AGREEMENT_INN_LABEL' | translate}}</label>
                        <input iqs-test-card-name type="text" value="" autocomplete="off" name="agreementInn" aria-label="AGREEMENT_INN"
                               ng-model="$ctrl.agreementInn" required ng-disabled="$ctrl.isDisabled()" />

                        <div ng-messages="$ctrl.touchedErrorsWithHint($ctrl.form, $ctrl.form.agreementInn)" role="alert">
                            <div ng-message="required">{{ 'SITES_CREATE_AGREEMENT_INN_REQ_ERR' | translate }}</div>
                        </div>
                    </md-input-container>

                    <div ng-if="!$ctrl.pipMedia('gt-sm')">
                        <md-button iqs-test-back class="md-primary md-raised w-stretch flex lm0 rm0 tm16" ng-click="$ctrl.onCancel()">
                            {{ ::'SITES_CREATE_BACK' | translate }}
                        </md-button>
                        <md-button iqs-test-next class="md-primary md-raised w-stretch flex lm0 rm0 bm0" ng-disabled="$ctrl.isDisabled()"
                                   type="submit" xxng-click="$ctrl.onSaveClick()">
                            {{ ::'SITES_CREATE_CREATE' | translate }}
                        </md-button>
                    </div>

                    <!--
                    <div class="layout-row layout-align-start-center tm16" ng-if="$ctrl.pipMedia('gt-sm')">
                        <md-button iqs-test-back class="md-primary md-raised w-stretch flex lm0 rm8 bm0" ng-click="$ctrl.onCancel()" >
                            {{ ::'SITES_CREATE_BACK' | translate }}
                        </md-button>
                        <md-button iqs-test-next class="md-primary md-raised w-stretch flex lm8 rm0 bm0" ng-disabled="$ctrl.isDisabled()" type="submit" xxxng-click="$ctrl.onSaveClick()">
                            {{ ::'SITES_CREATE_CREATE' | translate }}
                        </md-button>
                    </div>
                    -->
                </form>
            `
        })
})();
