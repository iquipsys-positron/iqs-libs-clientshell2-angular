import '../organizations/OrganizationService';

import { IAccessConfigProvider, IAccessConfigService, StateAccessAllow, AccessConfigure, StateAccessConfigure } from './IAccessConfig';
import {
    AccessRole,
    Session,
    Organization
} from '../../data';
import { UnauthorizedStateName } from '../../common/unauthorized/UnauthorizedErrorPage';
import { ClientConfiguration } from '../../config';
import { IOrganizationService } from '../';

class AccessConfigService implements IAccessConfigService {
    private _noAccessState: string = UnauthorizedStateName;
    private _role: string;
    private _roleLevel: number = 0;

    constructor(
        private pipIdentity: pip.services.IIdentityService,
        private iqsOrganization: IOrganizationService,
        private $state: ng.ui.IStateService,
        private _statesAccess: StateAccessAllow,
        private _statesConfigure: StateAccessConfigure,
        noAccessState: string
    ) {
        "ngInject";

        this._noAccessState = noAccessState;
    }

    public get statesAccess(): StateAccessAllow {
        return this._statesAccess;
    }

    public get statesConfigure(): StateAccessConfigure {
        return this._statesConfigure;
    }

    public get noAccessState(): string {
        return this._noAccessState;
    }

    public get role(): string {
        return this._role;
    }

    public get roleLevel(): number {
        return this._roleLevel;
    }

    public setRole(): void {
        let session: Session = this.pipIdentity.identity;
        let organization: Organization = this.iqsOrganization.organization;
        let role: string;

        if (session && session.user && session.user.organizations && session.user.organizations.length) {
            let roles: string[] = session.user.roles
            let roleIndex: number = _.findIndex(roles, (r: string) => {
                return r.indexOf(organization.id) == 0;
            });


            if (roleIndex > -1) {
                role = roles[roleIndex].substring(organization.id.length + 1);
            } else {
                role = 'empty';
            }
        } else {
            role = 'admin';
        }

        this._roleLevel = Object.keys(AccessRole).includes(role) ? AccessRole[role] : AccessRole.empty;
        this.iqsOrganization.canAddOrganization = ClientConfiguration.AddOrganizationNav;
        this.iqsOrganization.canRemoveOrganization = ClientConfiguration.RemoveOrganizationNav;
        this._role = _.findKey(AccessRole, o => { return o === this._roleLevel; });
        this.calculateAccess(this._roleLevel);
    }

    public getStateConfigure(stateName?: string): AccessConfigure {
        stateName = stateName ? stateName : this.$state.current.name;
        let s: AccessConfigure = this._statesConfigure[stateName] || <AccessConfigure>{ config: {}, access: {} };

        return _.cloneDeep(s);
    }

    public getStateAccess(stateName: string): number {
        let level = this.statesAccess[stateName];

        return level ? level : AccessRole.user;
    }

    public getStateAccessAllow(stateName: string): boolean {
        let level = this.statesAccess[stateName];
        level = level !== undefined && level !== null ? level : AccessRole.empty;

        return this._roleLevel >= level;
    }

    public getStateConfigureParamAccess(stateName: string, paramName): AccessConfigure {
        let p: AccessConfigure = this.statesConfigure[stateName];

        return p.access && p.access[paramName] ? p.access[paramName] : false;
    }

    private calculateAccess(role: number): void {
        if (typeof _.findKey(AccessRole, o => { return o === role; }) === 'undefined') {
            throw new Error('User role is undefined');
        }

        _.each(this._statesConfigure, (c: AccessConfigure) => {
            _.each(c.config, (value: number, key: string) => {
                c.access[key] = value <= role;
            });
        });
    }
}

class AccessConfigProvider implements IAccessConfigProvider {
    private _service: IAccessConfigService;
    private _statesAccess: StateAccessAllow;
    private _statesConfigure: StateAccessConfigure;
    private _noAccessState: string = UnauthorizedStateName;

    constructor() {
        "ngInject";

        this._statesAccess = {};
        this._statesConfigure = {};
    }

    public $get(
        pipIdentity: pip.services.IIdentityService,
        iqsOrganization: IOrganizationService,
        $state: ng.ui.IStateService
    ) {
        "ngInject";

        if (this._service == null) {
            this._service = new AccessConfigService(pipIdentity, iqsOrganization, $state, this._statesAccess, this._statesConfigure, this._noAccessState);
        }

        return this._service;
    }

    public get noAccessState(): string {
        return this._noAccessState;
    }

    public set noAccessState(value: string) {
        this._noAccessState = value;
    }

    public registerStateAccess(stateName: string, accessLevel: number): void {
        this._statesAccess[stateName] = accessLevel;
    }

    public registerStateConfigure(stateName: string, config: any): void {
        let c: AccessConfigure = {
            config: config,
            access: {}
        }
        this._statesConfigure[stateName] = c;
    }
}


angular
    .module('iqsAccessConfig.Service', ['iqsOrganizations.Service'])
    .provider('iqsAccessConfig', AccessConfigProvider);
