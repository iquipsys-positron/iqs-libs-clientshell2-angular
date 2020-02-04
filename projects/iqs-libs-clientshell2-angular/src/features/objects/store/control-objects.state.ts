import { createFeatureSelector, createSelector } from '@ngrx/store';

import { ControlObject } from '../models/index';
import { EntityState } from '../../../common/index';

export interface ControlObjectsState {
    objects: ControlObject[];
    state: EntityState;
    error: any;
}

export const getControlObjectsStoreState = createFeatureSelector<ControlObjectsState>('objects');

export const getControlObjectsData = createSelector(getControlObjectsStoreState, (state: ControlObjectsState) => state.objects);
export const getControlObjectById = createSelector(getControlObjectsStoreState, (state: ControlObjectsState, props: { id: string }) => {
    if (!props || !props.id || !state || !state.objects || !state.objects.length) { return null; }
    return state.objects.find(o => o.id === props.id) || null;
});
export const getControlObjectsState = createSelector(getControlObjectsStoreState, (state: ControlObjectsState) => state.state);
export const getControlObjectsError = createSelector(getControlObjectsStoreState, (state: ControlObjectsState) => state.error);
