import { createFeatureSelector, createSelector } from '@ngrx/store';

import { ObjectState } from '../models/index';
import { EntityState } from '../../../common/index';

export interface CurrentObjectStatesState {
    states: ObjectState[];
    state: EntityState;
    error: any;
}

export const getCurrentObjectStatesStoreState = createFeatureSelector<CurrentObjectStatesState>('current_object_states');

export const getCurrentObjectStatesData =
    createSelector(getCurrentObjectStatesStoreState, (state: CurrentObjectStatesState) => state.states);
export const getCurrentObjectStatesDataByObjectId =
    createSelector(getCurrentObjectStatesStoreState, (state: CurrentObjectStatesState, props: any) => {
        if (!props || !props.hasOwnProperty('id') || !state || !state.states || !state.states.length) { return null; }
        return state.states.find(s => s.object_id === props.id) || null;
    });
export const getCurrentObjectStatesState =
    createSelector(getCurrentObjectStatesStoreState, (state: CurrentObjectStatesState) => state.state);
export const getCurrentObjectStatesError =
    createSelector(getCurrentObjectStatesStoreState, (state: CurrentObjectStatesState) => state.error);
