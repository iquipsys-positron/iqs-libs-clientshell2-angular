import {
    IOrganizationService, IOrganizationProvider, OrganizationChangedEvent,
    OrganizationRootVar, regestryOrgIdKey
} from './IOrganizationService';
import { Organization } from '../../data/organizations/Organization';

class OrganizationService implements IOrganizationService {
    private _roleLevel: number = 0;
    private _canAddOrganization: boolean;
    private _canRemoveOrganization: boolean;
    private _isDemo: boolean = false;
    private demoOrganizationIps: string[] = [
        '89efee4152f74944932b1aa9ef78dedd', // production eng
        'd2cbf02c941643a38c2d3902a92f14d6', // production ru
        '9cfaf79bc95b4a9e912314eb3db7a4ba' // stage
    ]

    constructor(
        private $rootScope: ng.IRootScopeService,
        private $log: ng.ILogService,
        private localStorageService: any,
        private $cookieStore: any,
        private _organization: Organization,
        private _orgIdKey: string,
        private _setRootVar: boolean,
        private pipSettingsData: pip.system.ISettingsDataService,
        private pipIdentity: pip.services.IIdentityService
    ) {
        "ngInject";

    }

    private setRootVar(): void {
        if (this._setRootVar) {
            this.$rootScope[OrganizationRootVar] = this._organization;
        }
    }

    private remove(): void {
        if (this._orgIdKey) {
            this.$cookieStore.remove(this._orgIdKey);
            this.localStorageService.remove(this._orgIdKey);
        }
    }

    private saveToRegestry(callback: () => void) {
        let userId = this.pipIdentity.identity && this.pipIdentity.identity.user_id ? this.pipIdentity.identity.user_id : null;

        if (!userId || !this._organization || !this._organization.id) return;

        let value = {
            value: this._organization.id
        }
        this.pipSettingsData.saveSettingsKey(
            userId,
            regestryOrgIdKey,
            value,
            (data) => {
                callback();
            });
    }

    private save(callback: () => void): void {
        if (this._orgIdKey && this._organization) {
            this.localStorageService.set(this._orgIdKey, this._organization.id);
            this.$cookieStore.put(this._orgIdKey, this._organization.id);
        }
        this.saveToRegestry(callback);
    }

    public isConnectToDemo(organizations: Organization[]): boolean {
        if (!organizations || organizations.length == 0) return false;

        let index = _.findIndex(organizations, (item: Organization) => {
            return this.demoOrganizationIps.indexOf(item.id) != -1;
        });

        return index != -1;
    }

    public get organization(): Organization {
        return this._organization;
    }

    public get isDemo(): boolean {
        return this._isDemo;
    }

    public set isDemo(value: boolean) {
        this._isDemo = value;
    }

    private setOrganization() {
        this.setRootVar();
        this.$rootScope.$emit(OrganizationChangedEvent, this._organization);
        let organization: Organization = this._organization || <Organization>{};
        this.$log.debug("Changed organization to " + JSON.stringify(organization));
    }

    public set organization(value: Organization) {
        let id: string = this._organization ? this._organization.id : null;
        this._organization = value;
        if (this._organization === null) {
            this.remove();
            this.setOrganization();
        } else {
            if (this._organization.id != id) {
                this.save(() => {
                    this.setOrganization();
                });
            }
        }
    }

    public updateOrganization(value: Organization): void {
        if (this._organization && value && this._organization.id == value.id) {
            this._organization = value;
        }
    }

    public get orgId(): string {
        let orgId: string;
        orgId = this._organization && this._organization.id ? this._organization.id : null; //this.$cookieStore.get(this._orgIdKey) || this.localStorageService.get(this._orgIdKey);

        return orgId;
    }

    public get canAddOrganization(): boolean {
        return this._canAddOrganization;
    }
    
    public get canRemoveOrganization(): boolean {
        return this._canRemoveOrganization;
    }

    public set canAddOrganization(value: boolean) {
        this._canAddOrganization = value;
    }
    
    public set canRemoveOrganization(value: boolean) {
        this._canRemoveOrganization = value;
    }

    public setOrganizationRole(roleLevel: number, AddOrganizationLanding: boolean, RemoveOrganizationNav: boolean): void {
        if (roleLevel >= 0 && roleLevel < 4) {
            this._roleLevel = roleLevel;
        } 
    }
}


class OrganizationProvider implements IOrganizationProvider {
    private _service: IOrganizationService;
    private _setRootVar: boolean = false;
    private _orgIdKey: string = 'org_id';
    private _organization: Organization = null;

    constructor() {
        "ngInject";
    }

    public get setRootVar(): boolean {
        return this._setRootVar;
    }

    public set setRootVar(value: boolean) {
        this._setRootVar = !!value;
    }

    public get orgIdKey(): string {
        return this._orgIdKey;
    }

    public set orgIdKey(value: string) {
        this._orgIdKey = value;
    }

    public $get(
        $rootScope: ng.IRootScopeService,
        $log: ng.ILogService,
        localStorageService: any,
        $cookieStore: any,
        pipSettingsData: pip.system.ISettingsDataService,
        pipIdentity: pip.services.IIdentityService
    ) {
        "ngInject";

        if (this._service == null) {
            this._service = new OrganizationService($rootScope, $log, localStorageService, $cookieStore, this._organization, this._orgIdKey,
                this._setRootVar, pipSettingsData, pipIdentity);
        }

        return this._service;
    }
}


angular
    .module('iqsOrganizations.Service', ['pipSystem'])
    .provider('iqsOrganization', OrganizationProvider);