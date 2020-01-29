import { Organization } from '../../data';

export let OrganizationRootVar = "$organization";
export let OrganizationChangedEvent = "iqsOrganizationEventChanged";
export let regestryOrgIdKey = "org_id";

export interface IOrganizationService {
    organization: Organization;
    orgId: string;
    canAddOrganization: boolean;
    canRemoveOrganization: boolean;
    isDemo: boolean;
    updateOrganization(value: Organization): void;
    isConnectToDemo(organizations: Organization[]): boolean;
}

export interface IOrganizationProvider {
    setRootVar: boolean;
    orgIdKey: string;
}
