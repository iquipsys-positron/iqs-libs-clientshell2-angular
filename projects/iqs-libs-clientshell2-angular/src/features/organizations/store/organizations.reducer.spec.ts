import cloneDeep from 'lodash/cloneDeep';
import merge from 'lodash/merge';
import sample from 'lodash/sample';

import * as fromOrganizationsActions from './organizations.actions';
import { organizationsReducer, organizationsInitialState } from './organizations.reducer';
import { OrganizationsState } from './organizations.state';
import { EntityState } from '../../../common/models/index';
import { organizations } from '../../../../mock/src/public_api';

describe('[Organizations] store/reducer', () => {

    let state: OrganizationsState;

    beforeEach(() => {
        state = cloneDeep(organizationsInitialState);
    });

    it('should have initial state', () => {
        expect(organizationsReducer(undefined, { type: null })).toEqual(organizationsInitialState);
        expect(organizationsReducer(organizationsInitialState, { type: null })).toEqual(organizationsInitialState);
    });

    it('should reduce organizations states', () => {
        expect(organizationsReducer(state,
            new fromOrganizationsActions.OrganizationsInitAction()))
            .toEqual(merge(cloneDeep(state), { error: null, state: EntityState.Progress }));
        expect(organizationsReducer(merge(cloneDeep(state), { error: 'error' }),
            new fromOrganizationsActions.OrganizationsAbortAction()))
            .toEqual(merge(cloneDeep(state), { error: 'error', state: EntityState.Error }));
        expect(organizationsReducer(merge(cloneDeep(state), { organizations: organizations }),
            new fromOrganizationsActions.OrganizationsAbortAction()))
            .toEqual(merge(cloneDeep(state), { organizations: organizations, state: EntityState.Data }));
        expect(organizationsReducer(merge(cloneDeep(state), { organizations: [] }),
            new fromOrganizationsActions.OrganizationsAbortAction()))
            .toEqual(merge(cloneDeep(state), { organizations: [], state: EntityState.Empty }));
        expect(organizationsReducer(merge(cloneDeep(state), { error: 'error' }),
            new fromOrganizationsActions.OrganizationsSuccessAction(<any>organizations)))
            .toEqual(merge(cloneDeep(state), { error: null }));
        expect(organizationsReducer(merge(cloneDeep(state), { error: 'error' }),
            new fromOrganizationsActions.OrganizationsFailureAction('error')))
            .toEqual(merge(cloneDeep(state), { error: 'error', state: EntityState.Error }));
        expect(organizationsReducer(merge(cloneDeep(state), { error: 'error' }),
            new fromOrganizationsActions.OrganizationsDataAction(<any>organizations)))
            .toEqual(merge(cloneDeep(state), { error: null, state: EntityState.Data, organizations: organizations }));
        expect(organizationsReducer(merge(cloneDeep(state), { organizations: organizations }),
            new fromOrganizationsActions.OrganizationsEmptyAction()))
            .toEqual(merge(cloneDeep(state), { error: null, state: EntityState.Empty, organizations: [] }));
    });

    it('should reduce current organization states', () => {
        expect(organizationsReducer(state,
            new fromOrganizationsActions.OrganizationsCurrentAction(<any>organizations[0])))
            .toEqual(merge(cloneDeep(state), { current: organizations[0] }));
        expect(organizationsReducer(state,
            new fromOrganizationsActions.OrganizationsCurrentChangeInitAction(<any>organizations[0])))
            .toEqual(merge(cloneDeep(state), { state: EntityState.Progress }));
        expect(organizationsReducer(merge(cloneDeep(state), { error: 'error' }),
            new fromOrganizationsActions.OrganizationsCurrentChangeAbortAction()))
            .toEqual(merge(cloneDeep(state), { state: EntityState.Error, error: 'error' }));
        expect(organizationsReducer(state,
            new fromOrganizationsActions.OrganizationsCurrentChangeAbortAction()))
            .toEqual(merge(cloneDeep(state), { state: EntityState.Error }));
        expect(organizationsReducer(merge(cloneDeep(state), { current: organizations[0] }),
            new fromOrganizationsActions.OrganizationsCurrentChangeAbortAction()))
            .toEqual(merge(cloneDeep(state), { current: organizations[0], state: EntityState.Data }));
        expect(organizationsReducer(merge(cloneDeep(state), { current: organizations[1], error: 'error' }),
            new fromOrganizationsActions.OrganizationsCurrentChangeSuccessAction(<any>organizations[0])))
            .toEqual(merge(cloneDeep(state), { current: organizations[0], state: EntityState.Data, error: null }));
        expect(organizationsReducer(state,
            new fromOrganizationsActions.OrganizationsCurrentChangeFailureAction('error')))
            .toEqual(merge(cloneDeep(state), { state: EntityState.Error, error: 'error' }));
    });

    it('should reduce create organization states', () => {
        const joc = jasmine.objectContaining;
        const newOrganization = sample(organizations);
        newOrganization.name = 'Test organization';
        expect(organizationsReducer(state,
            new fromOrganizationsActions.OrganizationsCreateInitAction(newOrganization)))
            .toEqual(joc({ state: EntityState.Progress, error: null }));
        expect(organizationsReducer(merge(cloneDeep(state), { error: 'error' }),
            new fromOrganizationsActions.OrganizationsCreateAbortAction()))
            .toEqual(joc({ state: EntityState.Error }));
        expect(organizationsReducer(merge(cloneDeep(state), { organizations: organizations }),
            new fromOrganizationsActions.OrganizationsCreateAbortAction()))
            .toEqual(joc({ state: EntityState.Data }));
        expect(organizationsReducer(state,
            new fromOrganizationsActions.OrganizationsCreateAbortAction()))
            .toEqual(joc({ state: EntityState.Empty }));
        expect(organizationsReducer(state,
            new fromOrganizationsActions.OrganizationsCreateSuccessAction(newOrganization)))
            .toEqual(joc({ state: EntityState.Data, error: null, organizations: [newOrganization] }));
        expect(organizationsReducer(state,
            new fromOrganizationsActions.OrganizationsCreateFailureAction('error')))
            .toEqual(joc({ state: EntityState.Error, error: 'error' }));
    });

    it('should reduce connect and diconnect organization states', () => {
        const organization = sample(organizations);
        const joc = jasmine.objectContaining;
        const stateWithOrganization = merge(cloneDeep(state), { organizations: [organization] });
        expect(organizationsReducer(
            state,
            new fromOrganizationsActions.OrganizationsConnectInitAction(organization)
        )).toEqual(joc({ state: EntityState.Progress }));
        expect(organizationsReducer(
            state,
            new fromOrganizationsActions.OrganizationsConnectSuccessAction(organization)
        )).toEqual(joc({ organizations: [organization] }));
        expect(organizationsReducer(
            state,
            new fromOrganizationsActions.OrganizationsConnectFailureAction('error')
        )).toEqual(joc({ state: EntityState.Error, error: 'error' }));

        expect(organizationsReducer(
            stateWithOrganization,
            new fromOrganizationsActions.OrganizationsDisconnectInitAction(organization)
        )).toEqual(joc({ state: EntityState.Progress }));
        expect(organizationsReducer(
            stateWithOrganization,
            new fromOrganizationsActions.OrganizationsDisconnectSuccessAction(organization)
        )).toEqual(joc({ organizations: [] }));
        expect(organizationsReducer(
            stateWithOrganization,
            new fromOrganizationsActions.OrganizationsDisconnectFailureAction('error')
        )).toEqual(joc({ state: EntityState.Error, error: 'error' }));
    });

});
