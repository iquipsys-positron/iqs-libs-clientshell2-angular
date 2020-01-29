import './panels/NewOrganizationPanel';
import './panels/PaymentPanel';

import {
    AccessRole,
    Agreement,
    AgreementCategory,
    CreditCard,
    IAgreementsDataService,
    Organization
} from '../../../data';
import { IAccessConfigService, IAccessConfigProvider, ILoadingService, IOrganizationService } from '../../../services';
import { ICreditCardsViewModel, IOrganizationsViewModel } from '../../../models';

export const OrganizationsCreateStateName: string = 'organizations.create';

class OrganizationsCreateController implements ng.IController {
    public $onInit() { }
    private cleanUpFunc: Function;
    private transaction: pip.services.Transaction;

    public organization: Organization;
    public error: string;
    public step: number = 0;

    // public isQuery: boolean;
    public agreementCategory: string = AgreementCategory.Card;

    constructor(
        private $state: ng.ui.IStateService,
        pipAuxPanel: pip.layouts.IAuxPanelService,
        private pipNavService: pip.nav.INavService,
        private pipIdentity: pip.services.IIdentityService,

        private pipTransaction: pip.services.ITransactionService,
        private iqsOrganization: IOrganizationService,
        private pipTranslate: pip.services.ITranslateService,
        private iqsOrganizationsViewModel: IOrganizationsViewModel,
        private iqsLoading: ILoadingService,
        private iqsAccessConfig: IAccessConfigService,
        private iqsCreditCardsViewModel: ICreditCardsViewModel,
        private iqsAgreementsData: IAgreementsDataService
    ) {
        "ngInject";

        this.transaction = pipTransaction.create('organizations');
        pipAuxPanel.close();
        this.appHeader();

        this.organization = <Organization>{};

    }

    private appHeader(): void {
        this.pipNavService.appbar.parts = { 'icon': true, 'menu': true, 'title': 'breadcrumb' };
        if (this.iqsOrganization.orgId) {
            this.pipNavService.actions.secondaryGlobalActions = [
                {
                    name: 'global.signal', title: 'ACTION_SEND_SIGNAL', event: 'iqsSendSignalEvent',
                    access: () => { return this.iqsAccessConfig.roleLevel >= AccessRole.manager }
                },
                { name: 'global.settings', title: 'User settings', /* state: 'settings.user' */ event: 'iqsUserSettings' },
                { name: 'global.guide', title: 'SHOW_GUIDE', event: 'iqsShowGuide' },
                { name: 'global.signout', title: 'Sign out', state: 'signout' }
            ];
        } else {
            this.pipNavService.actions.secondaryGlobalActions = [
                { name: 'global.signout', title: 'Sign out', state: 'signout' }
            ];
        }
        this.pipNavService.actions.hide();
        this.pipNavService.breadcrumb.text = 'SITES_CREATE_TITLE';
        this.pipNavService.appbar.removeShadow();
        this.pipNavService.icon.showBack(() => {
            this.onBack();
        });
    }

    private getError(error: any): string {
        if (_.isString(error)) {
            return error;
        }

        let code = error && error.code ? error.code : error.data && error.data.code ? error.data.code : null;

        if (code) {
            return 'SITES_CREATE_CREDIT_CARD_' + code;
        }

        return 'UNKNOWN_ERROR';
    }

    public saveOrganization(organization: Organization, card?: CreditCard, agreement?: Agreement): void {
        if (!this.organization.language) {
            this.organization.language = this.pipTranslate.language;
        }
        this.transaction.begin('saveOrganization');
        if (!organization.language) {
            organization.language = this.pipTranslate.language;
        }
        let newOrganization: Organization;
        async.series([
            // verify agreement or card
            (callback) => {
                if (!card && !agreement) {
                    callback(new Error('NOT_CARD_OR_AGREEMENT'));
                    this.step = 1;

                    return;
                }
                callback();
            },
            // verify agreement 
            (callback) => {
                if (!agreement) {
                    callback();

                    return;
                }

                if (agreement && !agreement.number) {
                    callback(new Error('NOT_AGREEMENT_NUMBER'));

                    return;
                }

                this.iqsAgreementsData.verifyAgreement(
                    agreement.number,
                    (data?: any) => {
                        if (data == false) {
                            callback(new Error('NOT_AGREEMENT_VERIFY'));
                        } else {
                            callback();
                        }
                    },
                    (error: any) => {
                        this.step = 1;
                        callback(new Error('NOT_AGREEMENT_VERIFY'));
                    }
                );

            },
            // save organizations
            (callback) => {
                this.organization.active = true;
                this.iqsOrganizationsViewModel.createOrganization(
                    this.organization,
                    (data: Organization) => {
                        newOrganization = data;
                        callback();
                    },
                    (error: any) => {
                        this.step = 0;
                        this.error = this.getError(error);
                        this.transaction.end(error);
                    }
                );

            },
            // save credit card
            (callback) => {
                if (!card || !card.number) {
                    callback();

                    return;
                }

                card.customer_id = newOrganization.id;
                this.iqsCreditCardsViewModel.create(
                    card,
                    (data: any) => {
                        callback();
                    },
                    (error: any) => {
                        this.step = 1;
                        this.agreementCategory = AgreementCategory.Card;
                        this.error = this.getError(error);

                        if (newOrganization && newOrganization.id) {
                            // delete organization
                            this.iqsOrganizationsViewModel.removeOrganization(
                                newOrganization.id,
                                (data: Organization) => {
                                    newOrganization = null;
                                    this.transaction.end(error);
                                    callback(error);
                                },
                                (err: any) => {
                                    this.step = 0;
                                    this.transaction.end(err);
                                    callback(err);
                                }
                            );
                        }

                    });
            },
        ], (err) => {
            // Error
            if (!err) {
                this.transaction.end();
                this.$state.go('organizations.quick_start', { organization: newOrganization, org_id: newOrganization.id });
            }
        });
    }

    public onBack() {
        this.$state.go('organizations.home');
    }

    public onCreatePayment(card: CreditCard, agreement: Agreement): void {
        this.saveOrganization(this.organization, card, agreement);
    }

    public onCreateOrganization(organization: Organization): void {
        this.organization = organization;
        this.step = 1;
    }
}

function configureOrganizationsCreateRoute(
    $injector: angular.auto.IInjectorService,
    $stateProvider: pip.rest.IAuthStateService
) {
    "ngInject";

    $stateProvider
        .state(OrganizationsCreateStateName, {
            url: '/new',
            auth: true,
            params: {
                toState: null,
                toParams: null
            },
            controller: OrganizationsCreateController,
            controllerAs: '$ctrl',
            // templateUrl: 'states/organizations/organization/Organization.html'
            template: `
                <div class="iqs-organizations pip-card-container pip-outer-scroll pip-entry layout-column layout-align-center-center" ng-if="$ctrl.step == 0">
                    <iqs-new-organization-panel iqs-item="$ctrl.organization" iqs-save="$ctrl.onCreateOrganization(organization)">
                    </iqs-new-organization-panel>
                </div>

                <div class="iqs-organizations pip-card-container layout-column layout-align-center-center" ng-if="$ctrl.step == 1">
                    <div class="scroll-y iqs-organization-details" syles="min-height: 500px; max-height: 90%">
                        <iqs-payment-panel iqs-save="$ctrl.onCreatePayment(card, agreement)">

                        </iqs-payment-panel>
                    </div>
                </div>
            `

        });
}

function configureOrganizationsCreateAccess(
    iqsAccessConfigProvider: IAccessConfigProvider
) {
    "ngInject";

    let accessLevel: number = AccessRole.empty;
    let accessConfig: any = {};
    iqsAccessConfigProvider.registerStateAccess(OrganizationsCreateStateName, accessLevel);
    iqsAccessConfigProvider.registerStateConfigure(OrganizationsCreateStateName, accessConfig);
}

(() => {

    angular
        .module('iqsNewOrganization', ['iqsNewOrganizationPanel', 'iqsPaymentPanel'])
        .config(configureOrganizationsCreateRoute)
        .config(configureOrganizationsCreateAccess);

})();

import './OrganizationResource';
