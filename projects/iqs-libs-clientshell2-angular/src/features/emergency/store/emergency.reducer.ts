import { fromJS } from 'immutable';
import findIndex from 'lodash/findIndex';

import { EmergencyActionType, EmergencyAction } from './emergency.actions';
import { EmergencyState } from './emergency.state';
import { EmergencyPlan } from '../models/index';
import { EntityState } from '../../../common/index';

export const emergencyInitialState: EmergencyState = {
    plans: [],
    state: EntityState.Empty,
    error: null,
};

export function emergencyReducer(
    state = emergencyInitialState,
    action: EmergencyAction
): EmergencyState {
    switch (action.type) {

        case EmergencyActionType.EmergencyInit: {
            let map = fromJS(state);
            map = map.set('state', EntityState.Progress);
            map = map.set('error', null);
            return <EmergencyState>map.toJS();
        }

        case EmergencyActionType.EmergencySuccess: {
            let map = fromJS(state);
            map = map.set('plans', action.payload.plans);
            map = map.set('state', action.payload.plans && action.payload.plans.length ? EntityState.Data : EntityState.Empty);
            map = map.set('error', null);
            return <EmergencyState>map.toJS();
        }

        case EmergencyActionType.EmergencyFailure: {
            let map = fromJS(state);
            map = map.set('state', EntityState.Error);
            map = map.set('error', action.payload.error);
            return <EmergencyState>map.toJS();
        }

        case EmergencyActionType.EmergencyCreateInit: {
            let map = fromJS(state);
            map = map.set('state', EntityState.Progress);
            map = map.set('error', null);
            return <EmergencyState>map.toJS();
        }

        case EmergencyActionType.EmergencyCreateSuccess: {
            let map = fromJS(state);
            const plans: EmergencyPlan[] = map.get('plans').toJS();
            plans.push(action.payload.plan);
            map = map.set('plans', plans);
            map = map.set('state', EntityState.Data);
            map = map.set('error', null);
            return <EmergencyState>map.toJS();
        }

        case EmergencyActionType.EmergencyCreateFailure: {
            let map = fromJS(state);
            map = map.set('state', EntityState.Error);
            map = map.set('error', action.payload.error);
            return <EmergencyState>map.toJS();
        }

        case EmergencyActionType.EmergencyUpdateInit: {
            let map = fromJS(state);
            map = map.set('state', EntityState.Progress);
            map = map.set('error', null);
            return <EmergencyState>map.toJS();
        }

        case EmergencyActionType.EmergencyUpdateSuccess: {
            let map = fromJS(state);
            const plans: EmergencyPlan[] = map.get('plans').toJS();
            const idx = findIndex(plans, ['id', action.payload.plan.id]);
            if (idx >= 0) {
                plans[idx] = action.payload.plan;
            }
            map = map.set('plans', plans);
            map = map.set('state', EntityState.Data);
            map = map.set('error', null);
            return <EmergencyState>map.toJS();
        }

        case EmergencyActionType.EmergencyUpdateFailure: {
            let map = fromJS(state);
            map = map.set('state', EntityState.Error);
            map = map.set('error', action.payload.error);
            return <EmergencyState>map.toJS();
        }

        case EmergencyActionType.EmergencyDeleteInit: {
            let map = fromJS(state);
            map = map.set('state', EntityState.Progress);
            map = map.set('error', null);
            return <EmergencyState>map.toJS();
        }

        case EmergencyActionType.EmergencyDeleteSuccess: {
            let map = fromJS(state);
            const plans: EmergencyPlan[] = map.get('plans').toJS();
            const idx = findIndex(plans, ['id', action.payload.planId]);
            if (idx >= 0) {
                plans.splice(idx, 1);
            }
            map = map.set('plans', plans);
            map = map.set('state', plans.length ? EntityState.Data : EntityState.Empty);
            map = map.set('error', null);
            return <EmergencyState>map.toJS();
        }

        case EmergencyActionType.EmergencyDeleteFailure: {
            let map = fromJS(state);
            map = map.set('state', EntityState.Error);
            map = map.set('error', action.payload.error);
            return <EmergencyState>map.toJS();
        }

        default: {
            return state;
        }
    }
}
