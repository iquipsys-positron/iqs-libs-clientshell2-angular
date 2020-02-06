import { fromJS } from 'immutable';

import { ControlObjectsActionType, ControlObjectsAction } from './control-objects.actions';
import { ControlObjectsState } from './control-objects.state';
import { EntityState } from '../../../common/index';

export const controlObjectsInitialState: ControlObjectsState = {
    objects: [],
    state: EntityState.Empty,
    error: null,
};

export function controlObjectsReducer(
    state = controlObjectsInitialState,
    action: ControlObjectsAction
): ControlObjectsState {
    switch (action.type) {
        case ControlObjectsActionType.ControlObjectsInit: {
            let map = fromJS(state);
            map = map.set('state', EntityState.Progress);
            map = map.set('error', null);
            return <ControlObjectsState>map.toJS();
        }

        case ControlObjectsActionType.ControlObjectsAbort: {
            let map = fromJS(state);
            map = map.set('state', state.error
                ? EntityState.Error
                : state.objects && state.objects.length
                    ? EntityState.Data
                    : EntityState.Empty);
            return <ControlObjectsState>map.toJS();
        }

        case ControlObjectsActionType.ControlObjectsSuccess: {
            let map = fromJS(state);
            map = map.set('objects', action.payload.objects);
            map = map.set('state', action.payload.objects && action.payload.objects.length
                    ? EntityState.Data
                    : EntityState.Empty);
            map = map.set('error', null);
            return <ControlObjectsState>map.toJS();
        }

        case ControlObjectsActionType.ControlObjectsFailure: {
            let map = fromJS(state);
            map = map.set('state', EntityState.Error);
            map = map.set('error', action.payload);
            return <ControlObjectsState>map.toJS();
        }

        default: {
            return state;
        }
    }
}
