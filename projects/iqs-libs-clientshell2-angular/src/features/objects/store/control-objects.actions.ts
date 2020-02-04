import { Action } from '@ngrx/store';

import { ControlObject } from '../models/index';

export enum ControlObjectsActionType {
    ControlObjectsInit = '[ControlObject] Init',
    ControlObjectsAbort = '[ControlObject] Abort',
    ControlObjectsSuccess = '[ControlObject] Success',
    ControlObjectsFailure = '[ControlObject] Failure',
}

export class ControlObjectsInitAction implements Action {
    readonly type = ControlObjectsActionType.ControlObjectsInit;

    constructor() { }
}

export class ControlObjectsAbortAction implements Action {
    readonly type = ControlObjectsActionType.ControlObjectsAbort;

    constructor() { }
}

export class ControlObjectsSuccessAction implements Action {
    readonly type = ControlObjectsActionType.ControlObjectsSuccess;

    constructor(public payload: {
        objects: ControlObject[]
    }) { }
}

export class ControlObjectsFailureAction implements Action {
    readonly type = ControlObjectsActionType.ControlObjectsFailure;

    constructor(public payload: {
        error: any
    }) { }
}

export type ControlObjectsAction =
    ControlObjectsInitAction
    | ControlObjectsAbortAction
    | ControlObjectsSuccessAction
    | ControlObjectsFailureAction;
