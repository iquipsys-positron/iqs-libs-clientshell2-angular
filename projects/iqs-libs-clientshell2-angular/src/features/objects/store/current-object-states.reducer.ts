import { fromJS } from 'immutable';

import { CurrentObjectStatesActionType, CurrentObjectStatesAction } from './current-object-states.actions';
import { CurrentObjectStatesState } from './current-object-states.state';
import { EntityState } from '../../../common/index';

export const currentObjectStatesInitialState: CurrentObjectStatesState = {
    states: [],
    state: EntityState.Empty,
    error: null,
};

export function currentObjectStatesReducer(
    state = currentObjectStatesInitialState,
    action: CurrentObjectStatesAction
): CurrentObjectStatesState {
    switch (action.type) {
        case CurrentObjectStatesActionType.CurrentObjectStatesInit: {
            let map = fromJS(state);
            map = map.set('state', EntityState.Progress);
            map = map.set('error', null);
            return <CurrentObjectStatesState>map.toJS();
        }

        case CurrentObjectStatesActionType.CurrentObjectStatesAbort: {
            let map = fromJS(state);
            map = map.set('state', state.error
                ? EntityState.Error
                : state.states && state.states.length
                    ? EntityState.Data
                    : EntityState.Empty);
            return <CurrentObjectStatesState>map.toJS();
        }

        case CurrentObjectStatesActionType.CurrentObjectStatesSuccess: {
            let map = fromJS(state);
            map = map.set('states', action.payload.states);
            map = map.set('state', action.payload.states && action.payload.states.length
                    ? EntityState.Data
                    : EntityState.Empty);
            map = map.set('error', null);
            return <CurrentObjectStatesState>map.toJS();
        }

        case CurrentObjectStatesActionType.CurrentObjectStatesFailure: {
            let map = fromJS(state);
            map = map.set('state', EntityState.Error);
            map = map.set('error', action.payload);
            return <CurrentObjectStatesState>map.toJS();
        }

        default: {
            return state;
        }
    }
}
