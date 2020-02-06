import { createFeatureSelector, createSelector } from '@ngrx/store';

import { ObjectGroup } from '../models/index';
import { EntityState } from '../../../common/index';

export interface ObjectGroupsState {
    groups: ObjectGroup[];
    state: EntityState;
    error: any;
}

export const getObjectGroupsStoreState = createFeatureSelector<ObjectGroupsState>('object_groups');

export const getObjectGroupsData = createSelector(getObjectGroupsStoreState, (state: ObjectGroupsState) => state.groups);
export const getObjectGroupsState = createSelector(getObjectGroupsStoreState, (state: ObjectGroupsState) => state.state);
export const getObjectGroupsError = createSelector(getObjectGroupsStoreState, (state: ObjectGroupsState) => state.error);
