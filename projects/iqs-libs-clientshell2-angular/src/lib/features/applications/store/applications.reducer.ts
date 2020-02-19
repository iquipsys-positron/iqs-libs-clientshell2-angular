import { fromJS } from 'immutable';
import { findIndex } from 'lodash';

import { ApplicationsActionType, ApplicationsAction } from './applications.actions';
import { ApplicationsState } from './applications.state';
import { EntityState } from '../../../common/index';

export const applicationsInitialState: ApplicationsState = {
    applications: [],
    state: EntityState.Empty,
    toggling: false,
    error: null,
};

export function applicationsReducer(
    state = applicationsInitialState,
    action: ApplicationsAction
): ApplicationsState {
    switch (action.type) {
        case ApplicationsActionType.ApplicationsInit: {
            let map = fromJS(state);
            map = map.set('state', EntityState.Progress);
            map = map.set('error', null);
            return <ApplicationsState>map.toJS();
        }

        case ApplicationsActionType.ApplicationsAbort: {
            let map = fromJS(state);
            map = map.set('state', state.error
                ? EntityState.Error
                : state.applications && state.applications.length
                    ? EntityState.Data
                    : EntityState.Empty);
            return <ApplicationsState>map.toJS();
        }

        case ApplicationsActionType.ApplicationsSuccess: {
            let map = fromJS(state);
            map = map.set('error', null);
            return <ApplicationsState>map.toJS();
        }

        case ApplicationsActionType.ApplicationsFailure: {
            let map = fromJS(state);
            map = map.set('state', EntityState.Error);
            map = map.set('error', action.payload);
            return <ApplicationsState>map.toJS();
        }

        case ApplicationsActionType.ApplicationsData: {
            let map = fromJS(state);
            map = map.set('applications', action.payload);
            map = map.set('state', EntityState.Data);
            return <ApplicationsState>map.toJS();
        }

        case ApplicationsActionType.ApplicationsEmpty: {
            let map = fromJS(state);
            map = map.set('applications', []);
            map = map.set('state', EntityState.Empty);
            return <ApplicationsState>map.toJS();
        }

        case ApplicationsActionType.ApplicationsToggleFavorite: {
            const idx = findIndex(state.applications, ['id', action.payload.application_id]);
            let map = fromJS(state);
            const applications = map.get('applications').toJS();
            if (idx >= 0) {
                applications[idx].isFavorite = action.payload.state;
            }
            map = map.set('applications', applications);
            map = map.set('state', EntityState.Data);
            map = map.set('toggling', true);
            map = map.set('error', null);
            return <ApplicationsState>map.toJS();
        }

        case ApplicationsActionType.ApplicationsToggleFavoriteSuccess: {
            let map = fromJS(state);
            map = map.set('state', EntityState.Data);
            map = map.set('toggling', false);
            map = map.set('error', null);
            return <ApplicationsState>map.toJS();
        }

        case ApplicationsActionType.ApplicationsToggleFavoriteFailure: {
            let map = fromJS(state);
            map = map.set('state', EntityState.Data);
            map = map.set('toggling', false);
            map = map.set('error', action.payload.error);
            return <ApplicationsState>map.toJS();
        }

        default: {
            return state;
        }
    }
}
