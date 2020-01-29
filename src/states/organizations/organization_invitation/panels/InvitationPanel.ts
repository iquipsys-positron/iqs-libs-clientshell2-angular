import { Account, AccessRole, Invitation, Organization, InvitationAction, IRolesDataService } from '../../../../data';
import { IValidatorsService } from '../../../../validators';
import { IAccountsViewModel, IInvitationsViewModel } from '../../../../models';

interface IInvitationPanelBindings {
    [key: string]: any;

    onNext: any;
    organization: any;
    ngDisabled: any;
}

const InvitationPanelBindings: IInvitationPanelBindings = {
    onNext: '&?iqsNext',
    organization: '<?iqsOrganization',
    ngDisabled: '&?'
}

class InvitationPanelChanges implements ng.IOnChangesObject, IInvitationPanelBindings {
    [key: string]: ng.IChangesObject<any>;

    onNext: ng.IChangesObject<() => ng.IPromise<void>>;
    ngDisabled: ng.IChangesObject<() => ng.IPromise<void>>;
    organization: ng.IChangesObject<Organization>;
}

class InvitationPanelController implements ng.IController {
    public $onInit() { }
    public ngDisabled: () => boolean;
    public onNext: () => void;
    public organization: Organization;

    public form: any;
    public touchedErrorsWithHint: Function;
    private accounts: Account[] = [];
    public people: Account;
    public peoples: Account[] = [];
    public searchText: string = '';
    public transaction: pip.services.Transaction;
    private blur: boolean;
    private creatorLogin: string;

    constructor(
        private $element: JQuery,
        private $state: ng.ui.IStateService,
        private $timeout: ng.ITimeoutService,
        private $q: ng.IQService,
        private $scope: ng.IScope,
        public pipMedia: pip.layouts.IMediaService,
        private pipIdentity: pip.services.IIdentityService,
        private pipTransaction: pip.services.ITransactionService,
        private pipFormErrors: pip.errors.IFormErrorsService,
        private iqsAccountsViewModel: IAccountsViewModel,
        private iqsInvitationsViewModel: IInvitationsViewModel,
        private iqsRolesData: IRolesDataService,
        private iqsValidatorsService: IValidatorsService,
    ) {
        "ngInject";

        $element.addClass('iqs-invitation-panel');

        this.transaction = pipTransaction.create('create_invitation');
        this.touchedErrorsWithHint = pipFormErrors.touchedErrorsWithHint;

        this.creatorLogin = pipIdentity.identity && pipIdentity.identity.user ? pipIdentity.identity.user.login : null;
    }

    public $postLink() {
        this.form = this.$scope.form;
    }

    public querySearch(query: string) {
        var deferred = this.$q.defer();
        if (!query || query.length < 3) {

            return [];
        }
        query = query.toLocaleLowerCase();

        this.iqsAccountsViewModel.getAccountsAll(
            { search: query },
            (data: Account[]) => {

                // save last accounts result
                if (data && data.length) {
                    this.accounts = _.filter(data, (account: Account) => {
                        return account.login != this.creatorLogin;
                    });
                }

                deferred.resolve(data)
            },
            (error: any) => { }
        );

        return deferred.promise;
    }

    public getPeopleValidate(): boolean {
        return this.getPeopleEmailValidate() && this.getPeopleUniqueValidate();
    }

    public getPeopleEmailValidate(): boolean {
        let validate: string = this.people && this.people.login ? this.people.login : this.searchText;
        if (!validate) return true;

        return this.iqsValidatorsService.validateEmail(validate);
    }

    public getPeopleUniqueValidate(): boolean {
        let validate: string = this.people && this.people.login ? this.people.login : this.searchText;
        if (!validate) return true;

        validate = validate.toLocaleLowerCase();

        let index = _.findIndex(this.peoples, (item: Account) => {
            return item.login && validate == item.login.toLocaleLowerCase();
        });

        return index == -1;
    }

    public onItemChange(a): void {
        if (this.blur) return;

        this.blur = true;

        if (this.people && this.people.id) {
            this.addPeople();

            return;
        }

        if (!this.searchText) {
            return;
        }

        let query: string = this.searchText.toLocaleLowerCase();
        let i: number = _.findIndex(this.accounts, (item: Account) => {
            let isLogin: boolean = item.login && item.login.toLocaleLowerCase() == this.searchText;
            let isName: boolean = item.name && item.name.toLocaleLowerCase() == this.searchText;

            return isLogin || isName;
        });

        if (i != -1) {
            this.people = _.cloneDeep(this.accounts[i]);
            this.addPeople();
        }
    }

    public onItemBlur(a): void {
        this.$timeout(() => {
            if (this.blur) return;

            if (this.people && this.people.id) {
                this.addPeople();

                return;
            }

            if (!this.searchText) {
                return;
            }

            let query: string = this.searchText.toLocaleLowerCase();
            let i: number = _.findIndex(this.accounts, (item: Account) => {
                let isLogin: boolean = item.login && item.login.toLocaleLowerCase() == this.searchText;
                let isName: boolean = item.name && item.name.toLocaleLowerCase() == this.searchText;

                return isLogin || isName;
            });

            if (i != -1) {
                this.people = _.cloneDeep(this.accounts[i]);
                this.addPeople();
            }
        }, 100);

    }

    public onKeyDown($event) {
        this.blur = false;
        // if press Enter
        if ($event && $event.keyCode == 13) {
            this.addPeople();
        }
    }

    public getItemText(item: Account): string {
        if (item.login && item.name) {
            return item.name + ' (' + item.login + ')';
        } else {
            return item.name || item.login;
        }
    }

    public peopleIsEmpty(): boolean {
        let validate: string = this.people && this.people.login ? this.people.login : this.searchText;

        return !validate;
    }

    public addPeople() {
        let people: Account;
        if (this.peoples.length < 3 && this.getPeopleValidate()) {
            if (this.people && this.people.id) {
                people = _.cloneDeep(this.people);
                this.peoples.push(people);
                this.people = null;
                this.searchText = null;
            } else if (this.searchText) {
                people = new Account();
                people.login = this.searchText;
                this.peoples.push(people);
                this.people = null;
                this.searchText = null;
            }

        }
    }

    public delPeople(index: number): void {
        if (!this.peoples || this.peoples.length < index) return;

        this.peoples.splice(index, 1);
    }

    public onSkip() {
        if (this.onNext) {
            this.onNext();
        }
    }

    public onSaveInvitation() {
        if (this.form.$invalid || !this.getPeopleValidate()) {
            this.pipFormErrors.resetFormErrors(this.form, true);

            return;
        }

        this.transaction.begin('save invitation');

        let people: Account;
        let peoples: Account[] = _.cloneDeep(this.peoples);
        if (this.people && this.people.id) {
            people = _.cloneDeep(this.people);
            peoples.push(people);
        } else if (this.searchText) {
            people = new Account();
            people.login = this.searchText;
            peoples.push(people);
        }
        peoples = _.uniqBy(peoples, 'login');
        async.parallel([
            (callback) => {
                let invitation: Invitation = new Invitation();

                async.each(peoples,
                    (element: Account, callbackPeople) => {
                        if (!element || element.id) {
                            callbackPeople();

                            return;
                        }
                        if (element.login) {
                            invitation = new Invitation();
                            invitation.creator_id = this.pipIdentity.identity.user.id;
                            invitation.creator_name = this.pipIdentity.identity.user.name;
                            invitation.invitee_email = element.login;
                            invitation.org_id = this.organization.id;
                            invitation.language = this.pipIdentity.identity.user.language;
                            invitation.action = InvitationAction.Activate;
                            this.iqsInvitationsViewModel.saveInvitation(
                                invitation,
                                (data: Invitation) => {
                                    callbackPeople();
                                },
                                (error: any) => {
                                    callbackPeople(error)
                                });
                        } else {
                            callbackPeople();
                        }
                    },
                    (error: any) => {
                        if (error) {
                            callback(error);
                        } else {
                            callback();
                        }
                    });
            },
            (callback) => {
                let role: string;
                if (peoples.length == 0) {
                    callback();

                    return
                }

                async.each(peoples,
                    (element: Account, callbackAccount) => {
                        if (!element || !element.id) {
                            callbackAccount();

                            return;
                        }
                        // graunt role
                        if (element.login) {
                            role = AccessRole.roles[AccessRole.user];
                            this.iqsRolesData.createRole(
                                {
                                    user_id: element.id,
                                    org_id: this.organization.id
                                },
                                role,
                                (data: string[]) => {
                                    callbackAccount()
                                },
                                (error: any) => {
                                    callbackAccount(error)
                                });

                        } else {
                            callbackAccount();
                        }
                    },
                    (error: any) => {
                        if (error) {
                            callback(error);
                        } else {
                            callback();
                        }
                    });
            },
        ],
            // optional callback
            (error, results) => {
                if (error) {
                    //todo error
                    this.transaction.end(error);
                } else {
                    if (this.onNext) {
                        this.onNext();
                    }
                    this.transaction.end();
                }
            });

    }
}

(() => {
    angular
        .module('iqsInvitationPanel', ['iqsValidatorsService'])
        .component('iqsInvitationPanel', {
            bindings: InvitationPanelBindings,
            // templateUrl: 'states/organizations/organization_invitation/panels/InvitationPanel.html',
            controller: InvitationPanelController,
            controllerAs: '$ctrl',
            template: `
                <form name="form" novalidate autocomplete="off">
                    <md-progress-linear md-mode="indeterminate" class="dialog-progress-linear" ng-show="$ctrl.transaction.busy()">
                    </md-progress-linear>
                    <div class="pip-body {{$ctrl.pipMedia('gt-sm') ? 'p24' : 'p16' }}">


                        <h2 class="text-center bm24 lm24 rm24">
                            {{:: 'SITES_QUICK_START_INVITATION_TITLE' | translate}}
                        </h2>

                        <p class="text-body1 bm16 iqs-info">
                            {{:: 'SITES_QUICK_START_INVITATION_SUBTITLE' | translate}}
                        </p>


                        <div style="height:156px;" class="bm16">
                            <div class="layout-row layout-align-start-center h48" ng-repeat="people in $ctrl.peoples">

                                <md-icon md-svg-icon="icons:person" class="flex-fixed rm16 m0" ng-if="people.id">
                                </md-icon>
                                <md-icon md-svg-icon="icons:message" class="flex-fixed rm16 m0" ng-if="!people.id">
                                </md-icon>
                                <div class="flex text-body1 text-overflow rm16">
                                    {{ $ctrl.getItemText(people) }}
                                </div>
                                <md-button class="md-icon-button flex-fixed m0" ng-click="$ctrl.delPeople($index)">
                                    <md-icon md-svg-icon="icons:cross" class="flex-fixed">
                                    </md-icon>
                                </md-button>
                            </div>

                            <div class="layout-row tm8" ng-if="$ctrl.peoples.length < 3">
                                <md-icon md-svg-icon="icons:person-message" class="flex-fixed rm16 lm0 bm0 tm8">
                                </md-icon>
                                <md-autocomplete iqs-test-people-name class="flex iqs-without-label" md-input-name="people"
                                                 md-selected-item="$ctrl.people" md-search-text="$ctrl.searchText" md-items="item in $ctrl.querySearch($ctrl.searchText)"
                                                 md-selected-item-change="$ctrl.onItemChange()" pip-input-blur="$ctrl.onItemBlur()"
                                                 md-item-text="$ctrl.getItemText(item)" ng-keydown="$ctrl.onKeyDown($event)"
                                                 md-no-cache="true" md-delay="400" md-floating-label="{{::'SITES_CREATE_INVITE_PEOPLE_PLACEHOLDER' | translate}}">
                                    <md-item-template>
                                        <span ng-if="item.name && item.login">
                                            {{ item.name + ' (' + item.login + ')' }}
                                        </span>
                                        <span ng-if="!(item.name && item.login)">
                                            {{ item.name || item.login }}
                                        </span>
                                    </md-item-template>

                                    <div ng-messages="!$ctrl.getPeopleValidate()" role="alert">
                                        <div ng-if="!$ctrl.getPeopleEmailValidate()">{{ 'ACCOUNTT_EMAIL_VALIDATE_ERROR' | translate }}</div>
                                        <div ng-if="!$ctrl.getPeopleUniqueValidate()">{{ 'ACCOUNTT_EMAIL_UNIQUE_ERROR' | translate }}</div>
                                    </div>
                                </md-autocomplete>
                                <md-button iqs-test-people-add class="md-icon-button flex-fixed m0" ng-if="$ctrl.peoples.length < 3"
                                           ng-click="$ctrl.addPeople($index)" ng-disabled="!$ctrl.getPeopleValidate() || $ctrl.peopleIsEmpty()">

                                    <md-icon md-svg-icon="icons:plus" class="flex-fixed">
                                    </md-icon>
                                </md-button>
                            </div>
                        </div>

                        <p class="color-secondary-text m0" style="height:52px;">
                            <span ng-if="$ctrl.peoples.length > 0">{{:: 'SITES_CREATE_INVITE_PEOPLE1' | translate}}</span>
                        </p>
                    </div>

                    <div class="pip-footer {{$ctrl.pipMedia('gt-sm') ? 'p24' : 'p16' }} tp0">
                        <div ng-if="!$ctrl.pipMedia('gt-sm')">
                            <md-button iqs-test-cancel class="md-primary md-raised w-stretch flex lm0 rm0 bm16" ng-disabled="$ctrl.transaction.busy()"
                                       ng-click="$ctrl.onSkip()">
                                {{ ::'SITES_INVITATION_SKIP_BUTTON' | translate }}
                            </md-button>
                            <md-button iqs-test-next class="md-primary md-raised w-stretch flex lm0 rm0 bm0" ng-disabled="$ctrl.transaction.busy() || !$ctrl.getPeopleValidate()"
                                       ng-click="$ctrl.onSaveInvitation()">
                                {{ ::'SITES_INVITATION_CREATE_BUTTON' | translate }}
                            </md-button>
                        </div>
                        <div class="layout-row layout-align-start-center" ng-if="$ctrl.pipMedia('gt-sm')">
                            <md-button iqs-test-cancel class="md-primary md-raised w-stretch flex lm0 rm8 bm0" ng-disabled="$ctrl.transaction.busy()"
                                       ng-click="$ctrl.onSkip()">
                                {{ ::'SITES_INVITATION_SKIP_BUTTON' | translate }}
                            </md-button>
                            <md-button iqs-test-next class="md-primary md-raised w-stretch flex lm8 rm0 bm0" ng-disabled="$ctrl.transaction.busy() || !$ctrl.getPeopleValidate()"
                                       ng-click="$ctrl.onSaveInvitation()">
                                {{ ::'SITES_INVITATION_CREATE_BUTTON' | translate }}
                            </md-button>
                        </div>
                    </div>
                </form>
            `
        })
})();
