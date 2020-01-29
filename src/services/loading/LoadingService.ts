import '../../shell/ShellService';
import '../../services/send_signals/SendSignals';

import { ILoadingService, ILoadingProvider, LoadingCompleteEvent, LoadingStatus } from './';
import { IAccessConfigService, IOrganizationService } from '../';
import { UnauthorizedStateName } from '../../common';
import { AccessRole, Session, Organization } from '../../data';
import {
    IOrganizationsViewModel, ISettingsViewModel, IMapViewModel
} from '../../models';
import { IMapService } from '../../services';

class LoadingQueueItem {
    public name?: string;

    public asyncFn: Function;
    public asyncQueue: Function[];
    public asyncAlways?: (cb: any, error?: any, results?: any) => void;
    public isCompleted: boolean = false;
}

enum LoadingBreak {
    OrganizationsEmpty
}

class LoadingService implements ILoadingService {
    private state: string;
    private params: any;
    private _isLoading: boolean = false;
    private _completed: number = 0;
    private _accountRead: boolean = false;
    private _total: number = 0;
    private _loadingFns: LoadingQueueItem[];
    private _cleanFns: Function[];
    private cf: Function[] = [];
    public status: LoadingStatus;

    constructor(
        private $rootScope: ng.IRootScopeService,
        private $state: ng.ui.IStateService,
        private pipAuthState: pip.rest.IAuthStateService,
        private pipIdentity: pip.services.IIdentityService,
        private iqsAccessConfig: IAccessConfigService,
        private iqsDemo: IDemoService,
        private iqsOrganization: IOrganizationService,
        private iqsSettingsViewModel: ISettingsViewModel,
        private iqsOrganizationsViewModel: IOrganizationsViewModel,
        private iqsMapViewModel: IMapViewModel,
        private iqsMapConfig: IMapService

    ) {
        "ngInject";

        this._loadingFns = [];
        this._cleanFns = [];
        this.status = LoadingStatus.Empty;

        this.cf.push(this.$rootScope.$on(pip.services.IdentityChangedEvent, () => {
            if (!this.state) {
                this.start();
            }
        }));
    }

    public $onDestroy(): void {
        for (const f of this.cf) { f(); }
    }

    public get isLoading(): boolean {
        return this._isLoading;
    }

    public get isDone(): boolean {
        return this._completed === this._total;
    }

    public get completed(): number {
        return this._completed;
    }

    public get total(): number {
        return this._total;
    }

    public get progress(): number {
        return 100 * _.clamp(this._completed / (this._total || 1), 0, 1);
    }

    public start(callback?: Function): void {
        if (this.isDone) {
            if (callback) {
                callback();
            }
        } else if (!this._isLoading) {
            this._isLoading = true;
            this.loading(callback);
        }
    }

    public restart(callback?: Function): void {
        this.reset();
        this.start(callback);
    }

    public reset(): void {
        this.cleanModel();
    }

    private cleanModel(): void {
        this._completed = 0;
        for (const item of this._loadingFns) {
            item.isCompleted = false;
        }
        for (const fn of this._cleanFns) {
            fn();
        }
    }

    public clean(): void {
        this.pipIdentity.identity = null;
        this.iqsOrganization.organization = null;
        this._isLoading = false;
        this.cleanModel();
    }

    public push(name: string, cleanFn: Function[], asyncFn: Function, asyncQueue: Function[], asyncAlways?: (cb: any, error?: any, results?: any) => void): void {
        const progressQueue: Function[] = [];
        for (const fn of asyncQueue) {
            progressQueue.push((callback, ...params) => {
                fn((...fnParams) => {
                    this._completed++;
                    if (!fnParams.length) {
                        callback();
                    } else {
                        callback(...fnParams);
                    }
                }, ...params);
            });
        }
        const item = <LoadingQueueItem>{
            name,
            asyncFn,
            asyncQueue: progressQueue,
            asyncAlways,
            isCompleted: false
        };

        this._loadingFns.push(item);
        this._total += progressQueue.length;
        this._cleanFns.push(...cleanFn);
    }

    private readOrganization(callback: (reason?: LoadingBreak) => void): void {
        let orgId: string = null;
        let session: Session = this.pipIdentity.identity;
        let organization: Organization = null;
        let index: number = -1;
        let regestryOrgIdKey: string = 'org_id';

        if (session && session.user) {
            let organizations: Organization[];
            let settings: any;

            async.series([
                // Read organizations
                (callback) => {
                    this.iqsOrganizationsViewModel.initOrganizations(
                        (data: any) => {
                            organizations = this.iqsOrganizationsViewModel.organizations;
                            callback();
                        },
                        (error: any) => {
                            callback(error);
                        });
                },
                // Read settings
                (callback) => {
                    this.iqsSettingsViewModel.read(
                        (data: any) => {
                            settings = data;
                            callback();
                        },
                        (error: any) => {
                            callback(error);
                        });
                }
            ], (err) => {
                // Error
                if (err) {
                    this.$state.go(this.pipAuthState.signinState());
                    return;
                }

                this._accountRead = true;
                // user do not have any organization
                if (!organizations || organizations.length == 0) {
                    this.iqsAccessConfig.setRole();
                    const emailVerified = settings && settings.verified_email;
                    if ((emailVerified === 'true' || emailVerified === true) && !['organizations', 'organizations.home', 'organizations.create', 'organizations.connection', 'organizations.quick_start', 'organizations.welcome', 'organizations.invitation'].includes(this.$state.current.name)) {
                        this.state = 'organizations.home';
                        this.redirectTo();
                    }
                    callback(LoadingBreak.OrganizationsEmpty);
                    return;
                }

                if (settings && settings[regestryOrgIdKey]) {
                    orgId = settings[regestryOrgIdKey];
                } else {
                    orgId = this.iqsOrganization.orgId;
                }

                if (orgId) {
                    index = _.findIndex(organizations, (item) => {
                        return item.id == orgId;
                    });
                }

                organization = index != -1 ? organizations[index] : organizations[0]
                this.iqsOrganization.organization = _.cloneDeep(organization);
                this.iqsAccessConfig.setRole();

                if (this.iqsAccessConfig.roleLevel < AccessRole.user) {
                    this.$state.go(UnauthorizedStateName);

                    return;
                }

                callback();
            });
        } else {
            this._isLoading = false;
            this.$state.go(this.pipAuthState.signinState());
        }
    }

    private redirectTo() {
        if (!this.state) {
            if (this.$state.params && this.$state.params['toState']) {
                this.state = _.cloneDeep(this.$state.params['toState'].name);
            }
            if (this.$state.params && this.$state.params['toParams']) {
                this.params = _.cloneDeep(this.$state.params['toParams']);
            }
        }
        if (this.state) {
            this.$state.go(this.state, this.params);
        } else {
            this.$state.go(this.pipAuthState.authorizedState(), null);
        }
        this.state = null;
    }

    private loading(callback?: Function) {
        this.iqsOrganization.isDemo = this.iqsDemo.isDemoUser(this.pipIdentity.identity);
        this.status = LoadingStatus.Progress;
        this.readOrganization((reason?: LoadingBreak) => {
            if (typeof reason !== 'undefined') {
                this.status = LoadingStatus.Breaked;
                this._isLoading = false;
                switch (reason) {
                    case LoadingBreak.OrganizationsEmpty:
                        this._isLoading = false;
                        this.$rootScope.$emit(LoadingCompleteEvent);
                        if (callback) callback();
                        break;
                }
            } else {
                this.loadingData((error: any) => {
                    if (error) {
                        this._isLoading = true;
                        this._completed = this._total < 2 ? 1 : this._total - 1;
                        this.status = LoadingStatus.Error;
                        return;
                    }
                    if (!this.iqsOrganization.orgId) {
                        this.$state.go(this.pipAuthState.signinState())
                        return;
                    }

                    let organization: Organization = this.iqsOrganizationsViewModel.getOrganizationById(this.iqsOrganization.orgId);
                    if (!organization || !organization.id) {
                        this.$state.go(this.pipAuthState.signinState())
                        return;
                    }
                    this.$rootScope.$emit(LoadingCompleteEvent);
                    if (callback) callback();
                });
            }
        });
    }

    private loadingData(callback: Function) {
        this._isLoading = true;
        const items = _.filter(this._loadingFns, ['isCompleted', false]);
        const fns: ((cb: Function) => void)[] = [];
        const r = _.random(0, 1000);
        for (const item of items) {
            fns.push((cb: Function) => {
                item.asyncFn(item.asyncQueue,
                    (error: any, results: any) => {
                        item.isCompleted = true;
                        const localCb = (error: any) => {
                            if (error) {
                                cb(error)
                            } else {
                                item.isCompleted = true;
                                cb();
                            }
                        };
                        if (angular.isFunction(item.asyncAlways)) {
                            item.asyncAlways(localCb, error, results);
                        } else {
                            localCb(error);
                        }
                    });
            })
        }

        async.series(fns,
            (error: any, results: any) => {
                this._isLoading = false;
                if (error) {
                    callback(error);
                } else if (!this.isDone) {
                    // Elements was pushed when loading in progress
                    this.loadingData(callback);
                } else {
                    // if (angular.isFunction(callback)) {
                    //     callback();
                    // }
                    // this.$rootScope.$emit(LoadingCompleteEvent);
                    this.status = LoadingStatus.Completed;
                    callback();
                }
            });
    }
}

class LoadingProvider implements ILoadingProvider {
    private _service: ILoadingService;

    constructor() {
        "ngInject";
    }

    public $get(
        $rootScope: ng.IRootScopeService,
        $state: ng.ui.IStateService,
        pipAuthState: pip.rest.IAuthStateService,
        pipIdentity: pip.services.IIdentityService,
        iqsAccessConfig: IAccessConfigService,
        iqsDemo: IDemoService,
        iqsOrganization: IOrganizationService,
        iqsSettingsViewModel: ISettingsViewModel,
        iqsOrganizationsViewModel: IOrganizationsViewModel,
        iqsMapViewModel: IMapViewModel,
        iqsMapConfig: IMapService
    ) {
        "ngInject";

        if (this._service == null) {
            this._service = new LoadingService($rootScope, $state, pipAuthState, pipIdentity, iqsAccessConfig, iqsDemo, iqsOrganization, iqsSettingsViewModel, iqsOrganizationsViewModel, iqsMapViewModel, iqsMapConfig);
        }

        return this._service;
    }
}

angular.module('iqsLoading', [
    'iqsOrganizations.Service',
    'iqsSettings.ViewModel',
    'iqsOrganizations.ViewModel',
    'iqsAccessConfig',
    'iqsDemo',
    'iqsSendSignals',
    'iqsSendSignalDialog',
    'iqsGlobalSearch',
])
    .provider('iqsLoading', LoadingProvider);

import './LoadingStrings'; import { IDemoService } from '../../states';

