import { fromJS } from 'immutable';

import { ObjectGroupsActionType, ObjectGroupsAction } from './object-groups.actions';
import { ObjectGroupsState } from './object-groups.state';
import { EntityState } from '../../../common/index';

export const objectGroupsInitialState: ObjectGroupsState = {
    groups: [],
    state: EntityState.Empty,
    error: null,
};

export function objectGroupsReducer(
    state = objectGroupsInitialState,
    action: ObjectGroupsAction
): ObjectGroupsState {
    switch (action.type) {
        case ObjectGroupsActionType.ObjectGroupsInit: {
            let map = fromJS(state);
            map = map.set('state', EntityState.Progress);
            map = map.set('error', null);
            return <ObjectGroupsState>map.toJS();
        }

        case ObjectGroupsActionType.ObjectGroupsAbort: {
            let map = fromJS(state);
            map = map.set('state', state.error
                ? EntityState.Error
                : state.groups && state.groups.length
                    ? EntityState.Data
                    : EntityState.Empty);
            return <ObjectGroupsState>map.toJS();
        }

        case ObjectGroupsActionType.ObjectGroupsSuccess: {
            let map = fromJS(state);
            map = map.set('groups', action.payload.groups);
            map = map.set('state', action.payload.groups && action.payload.groups.length
                    ? EntityState.Data
                    : EntityState.Empty);
            map = map.set('error', null);
            return <ObjectGroupsState>map.toJS();
        }

        case ObjectGroupsActionType.ObjectGroupsFailure: {
            let map = fromJS(state);
            map = map.set('state', EntityState.Error);
            map = map.set('error', action.payload);
            return <ObjectGroupsState>map.toJS();
        }

        default: {
            return state;
        }
    }
}
