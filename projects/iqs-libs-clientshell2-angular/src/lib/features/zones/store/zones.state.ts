import { createFeatureSelector, createSelector } from '@ngrx/store';

import { Zone } from '../models/index';
import { EntityState } from '../../../common/index';

export interface ZonesState {
    zones: Zone[];
    state: EntityState;
    error: any;
}

export const getZonesStoreState = createFeatureSelector<ZonesState>('zones');

export const getZonesData = createSelector(getZonesStoreState, (state: ZonesState) => state.zones);
export const getZonesState = createSelector(getZonesStoreState, (state: ZonesState) => state.state);
export const getZonesError = createSelector(getZonesStoreState, (state: ZonesState) => state.error);
