import { fromJS } from 'immutable';

import { OrganizationsActionType, OrganizationsAction } from './organizations.actions';
import { OrganizationsState } from './organizations.state';
import { Organization } from '../models/index';
import { EntityState } from '../../../common/index';

export const organizationsInitialState: OrganizationsState = {
    organizations: [],
    current: null,
    state: EntityState.Empty,
    error: null,
};

export function organizationsReducer(
    state: OrganizationsState = organizationsInitialState,
    action: OrganizationsAction
): OrganizationsState {
    switch (action.type) {
        case OrganizationsActionType.OrganizationsInit: {
            let map = fromJS(state);
            map = map.set('state', EntityState.Progress);
            map = map.set('error', null);
            return <OrganizationsState>map.toJS();
        }

        case OrganizationsActionType.OrganizationsAbort: {
            let map = fromJS(state);
            map = map.set('state', state.error
                ? EntityState.Error
                : state.organizations && state.organizations.length ? EntityState.Data : EntityState.Empty);
            return <OrganizationsState>map.toJS();
        }

        case OrganizationsActionType.OrganizationsSuccess: {
            let map = fromJS(state);
            map = map.set('error', null);
            return <OrganizationsState>map.toJS();
        }

        case OrganizationsActionType.OrganizationsFailure: {
            let map = fromJS(state);
            map = map.set('state', EntityState.Error);
            map = map.set('error', action.payload);
            return <OrganizationsState>map.toJS();
        }

        case OrganizationsActionType.OrganizationsData: {
            let map = fromJS(state);
            map = map.set('organizations', action.payload);
            map = map.set('state', EntityState.Data);
            map = map.set('error', null);
            return <OrganizationsState>map.toJS();
        }

        case OrganizationsActionType.OrganizationsEmpty: {
            let map = fromJS(state);
            map = map.set('organizations', []);
            map = map.set('state', EntityState.Empty);
            map = map.set('error', null);
            return <OrganizationsState>map.toJS();
        }

        case OrganizationsActionType.OrganizationsCurrent: {
            let map = fromJS(state);
            map = map.set('current', action.payload);
            return <OrganizationsState>map.toJS();
        }

        case OrganizationsActionType.OrganizationsCurrentChangeInit: {
            let map = fromJS(state);
            map = map.set('state', EntityState.Progress);
            return <OrganizationsState>map.toJS();
        }

        case OrganizationsActionType.OrganizationsCurrentChangeAbort: {
            let map = fromJS(state);
            map = map.set('state', state.error || !state.current ? EntityState.Error : EntityState.Data);
            return <OrganizationsState>map.toJS();
        }

        case OrganizationsActionType.OrganizationsCurrentChangeSuccess: {
            let map = fromJS(state);
            map = map.set('current', action.payload);
            map = map.set('state', EntityState.Data);
            map = map.set('error', null);
            return <OrganizationsState>map.toJS();
        }

        case OrganizationsActionType.OrganizationsCurrentChangeFailure: {
            let map = fromJS(state);
            map = map.set('state', EntityState.Error);
            map = map.set('error', action.payload);
            return <OrganizationsState>map.toJS();
        }

        case OrganizationsActionType.OrganizationsCreateInit: {
            let map = fromJS(state);
            map = map.set('state', EntityState.Progress);
            map = map.set('error', null);
            return <OrganizationsState>map.toJS();
        }

        case OrganizationsActionType.OrganizationsCreateAbort: {
            let map = fromJS(state);
            map = map.set('state', state.error
                ? EntityState.Error
                : state.organizations && state.organizations.length ? EntityState.Data : EntityState.Empty);
            return <OrganizationsState>map.toJS();
        }

        case OrganizationsActionType.OrganizationsCreateSuccess: {
            let map = fromJS(state);
            const organizations = map.get('organizations').toJS();
            organizations.push(action.payload);
            map = map.set('organizations', organizations);
            map = map.set('state', EntityState.Data);
            map = map.set('error', null);
            return <OrganizationsState>map.toJS();
        }

        case OrganizationsActionType.OrganizationsCreateFailure: {
            let map = fromJS(state);
            map = map.set('state', EntityState.Error);
            map = map.set('error', action.payload);
            return <OrganizationsState>map.toJS();
        }

        case OrganizationsActionType.OrganizationsConnectInit: {
            let map = fromJS(state);
            map = map.set('state', EntityState.Progress);
            return <OrganizationsState>map.toJS();
        }

        case OrganizationsActionType.OrganizationsConnectSuccess: {
            let map = fromJS(state);
            const organizations = map.get('organizations').toJS();
            organizations.push(action.payload);
            map = map.set('organizations', organizations);
            map = map.set('state', EntityState.Data);
            map = map.set('error', null);
            return <OrganizationsState>map.toJS();
        }

        case OrganizationsActionType.OrganizationsConnectFailure: {
            let map = fromJS(state);
            map = map.set('state', EntityState.Error);
            map = map.set('error', action.payload);
            return <OrganizationsState>map.toJS();
        }

        case OrganizationsActionType.OrganizationsDisconnectInit: {
            let map = fromJS(state);
            map = map.set('state', EntityState.Progress);
            return <OrganizationsState>map.toJS();
        }

        case OrganizationsActionType.OrganizationsDisconnectSuccess: {
            let map = fromJS(state);
            const organizations = map.get('organizations').toJS().filter((organization: Organization) => organization.id !== action.payload.id);
            map = map.set('organizations', organizations);
            map = map.set('state', EntityState.Data);
            map = map.set('error', null);
            return <OrganizationsState>map.toJS();
        }

        case OrganizationsActionType.OrganizationsDisconnectFailure: {
            let map = fromJS(state);
            map = map.set('state', EntityState.Error);
            map = map.set('error', action.payload);
            return <OrganizationsState>map.toJS();
        }

        default: {
            return state;
        }
    }
}
