import { createFeatureSelector, createSelector } from '@ngrx/store';

import { Organization } from '../models/index';
import { EntityState } from '../../../common/index';

export interface OrganizationsState {
    organizations: Organization[];
    current: Organization;
    state: EntityState;
    error: any;
}

export const getOrganizationsStoreState = createFeatureSelector<OrganizationsState>('organizations');

export const getOrganizationsOrganizations = createSelector(getOrganizationsStoreState, (state: OrganizationsState) => state.organizations);
export const getOrganizationsCurrent = createSelector(getOrganizationsStoreState, (state: OrganizationsState) => state.current);
export const getOrganizationsState = createSelector(getOrganizationsStoreState, (state: OrganizationsState) => state.state);
export const getOrganizationsError = createSelector(getOrganizationsStoreState, (state: OrganizationsState) => state.error);
