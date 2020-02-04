import { fromJS } from 'immutable';

import { ZonesActionType, ZonesAction } from './zones.actions';
import { ZonesState } from './zones.state';
import { EntityState } from '../../../common/index';

export const zonesInitialState: ZonesState = {
    zones: [],
    state: EntityState.Empty,
    error: null,
};

export function zonesReducer(
    state = zonesInitialState,
    action: ZonesAction
): ZonesState {
    switch (action.type) {
        case ZonesActionType.ZonesInit: {
            let map = fromJS(state);
            map = map.set('state', EntityState.Progress);
            map = map.set('error', null);
            return <ZonesState>map.toJS();
        }

        case ZonesActionType.ZonesAbort: {
            let map = fromJS(state);
            map = map.set('state', state.error
                ? EntityState.Error
                : state.zones && state.zones.length
                    ? EntityState.Data
                    : EntityState.Empty);
            return <ZonesState>map.toJS();
        }

        case ZonesActionType.ZonesSuccess: {
            let map = fromJS(state);
            map = map.set('zones', action.payload.zones);
            map = map.set('state', action.payload.zones && action.payload.zones.length
                    ? EntityState.Data
                    : EntityState.Empty);
            map = map.set('error', null);
            return <ZonesState>map.toJS();
        }

        case ZonesActionType.ZonesFailure: {
            let map = fromJS(state);
            map = map.set('state', EntityState.Error);
            map = map.set('error', action.payload);
            return <ZonesState>map.toJS();
        }

        default: {
            return state;
        }
    }
}
