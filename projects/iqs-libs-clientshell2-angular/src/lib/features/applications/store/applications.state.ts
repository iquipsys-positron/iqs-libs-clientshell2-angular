import { createFeatureSelector, createSelector } from '@ngrx/store';

import { ApplicationTile, ApplicationGroup } from '../models/index';
import { EntityState } from '../../../common/index';

export interface ApplicationsState {
    applications: ApplicationTile[];
    state: EntityState;
    toggling: boolean;
    error: any;
}

export const getApplicationsStoreState = createFeatureSelector<ApplicationsState>('applications');

export const getApplicationsData = createSelector(getApplicationsStoreState, (state: ApplicationsState) => state.applications);
export const getApplicationsState = createSelector(getApplicationsStoreState, (state: ApplicationsState) => state.state);
export const getApplicationsToggling = createSelector(getApplicationsStoreState, (state: ApplicationsState) => state.toggling);
export const getApplicationsError = createSelector(getApplicationsStoreState, (state: ApplicationsState) => state.error);
