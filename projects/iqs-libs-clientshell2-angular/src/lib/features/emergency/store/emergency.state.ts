import { createFeatureSelector, createSelector } from '@ngrx/store';

import { EmergencyPlan } from '../models/index';
import { EntityState } from '../../../common/index';

export interface EmergencyState {
    plans: EmergencyPlan[];
    state: EntityState;
    error: any;
}

export const getEmergencyStoreState = createFeatureSelector<EmergencyState>('emergency_plans');

export const getEmergencyData = createSelector(getEmergencyStoreState, (state: EmergencyState) => state.plans);
export const getEmergencyState = createSelector(getEmergencyStoreState, (state: EmergencyState) => state.state);
export const getEmergencyError = createSelector(getEmergencyStoreState, (state: EmergencyState) => state.error);
