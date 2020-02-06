import { Action } from '@ngrx/store';

import { ObjectGroup } from '../models/index';

export enum ObjectGroupsActionType {
    ObjectGroupsInit = '[ObjectGroups] Init',
    ObjectGroupsAbort = '[ObjectGroups] Abort',
    ObjectGroupsSuccess = '[ObjectGroups] Success',
    ObjectGroupsFailure = '[ObjectGroups] Failure',
}

export class ObjectGroupsInitAction implements Action {
    readonly type = ObjectGroupsActionType.ObjectGroupsInit;

    constructor() { }
}

export class ObjectGroupsAbortAction implements Action {
    readonly type = ObjectGroupsActionType.ObjectGroupsAbort;

    constructor() { }
}

export class ObjectGroupsSuccessAction implements Action {
    readonly type = ObjectGroupsActionType.ObjectGroupsSuccess;

    constructor(public payload: {
        groups: ObjectGroup[]
    }) { }
}

export class ObjectGroupsFailureAction implements Action {
    readonly type = ObjectGroupsActionType.ObjectGroupsFailure;

    constructor(public payload: {
        error: any
    }) { }
}

export type ObjectGroupsAction =
    ObjectGroupsInitAction
    | ObjectGroupsAbortAction
    | ObjectGroupsSuccessAction
    | ObjectGroupsFailureAction;
