import { Action } from '@ngrx/store';

import { EmergencyPlan } from '../models/index';

export enum EmergencyActionType {
    EmergencyInit = '[Emergency] Init',
    EmergencySuccess = '[Emergency] Success',
    EmergencyFailure = '[Emergency] Failure',
    EmergencyCreateInit = '[Emergency] CreateInit',
    EmergencyCreateSuccess = '[Emergency] CreateSuccess',
    EmergencyCreateFailure = '[Emergency] CreateFailure',
    EmergencyUpdateInit = '[Emergency] UpdateInit',
    EmergencyUpdateSuccess = '[Emergency] UpdateSuccess',
    EmergencyUpdateFailure = '[Emergency] UpdateFailure',
    EmergencyDeleteInit = '[Emergency] DeleteInit',
    EmergencyDeleteSuccess = '[Emergency] DeleteSuccess',
    EmergencyDeleteFailure = '[Emergency] DeleteFailure',
}

export class EmergencyInitAction implements Action {
    readonly type = EmergencyActionType.EmergencyInit;

    constructor() { }
}

export class EmergencySuccessAction implements Action {
    readonly type = EmergencyActionType.EmergencySuccess;

    constructor(public payload: {
        plans: EmergencyPlan[]
    }) { }
}

export class EmergencyFailureAction implements Action {
    readonly type = EmergencyActionType.EmergencyFailure;

    constructor(public payload: {
        error: any
    }) { }
}

export class EmergencyCreateInitAction implements Action {
    readonly type = EmergencyActionType.EmergencyCreateInit;

    constructor(public payload: {
        plan: EmergencyPlan
    }) { }
}

export class EmergencyCreateSuccessAction implements Action {
    readonly type = EmergencyActionType.EmergencyCreateSuccess;

    constructor(public payload: {
        plan: EmergencyPlan
    }) { }
}

export class EmergencyCreateFailureAction implements Action {
    readonly type = EmergencyActionType.EmergencyCreateFailure;

    constructor(public payload: {
        error: any
    }) { }
}

export class EmergencyUpdateInitAction implements Action {
    readonly type = EmergencyActionType.EmergencyUpdateInit;

    constructor(public payload: {
        plan: EmergencyPlan
    }) { }
}

export class EmergencyUpdateSuccessAction implements Action {
    readonly type = EmergencyActionType.EmergencyUpdateSuccess;

    constructor(public payload: {
        plan: EmergencyPlan
    }) { }
}

export class EmergencyUpdateFailureAction implements Action {
    readonly type = EmergencyActionType.EmergencyUpdateFailure;

    constructor(public payload: {
        error: any
    }) { }
}

export class EmergencyDeleteInitAction implements Action {
    readonly type = EmergencyActionType.EmergencyDeleteInit;

    constructor(public payload: {
        planId: string
    }) { }
}

export class EmergencyDeleteSuccessAction implements Action {
    readonly type = EmergencyActionType.EmergencyDeleteSuccess;

    constructor(public payload: {
        planId: string
    }) { }
}

export class EmergencyDeleteFailureAction implements Action {
    readonly type = EmergencyActionType.EmergencyDeleteFailure;

    constructor(public payload: {
        error: any
    }) { }
}


export type EmergencyAction = EmergencyInitAction
    | EmergencySuccessAction
    | EmergencyFailureAction
    | EmergencyCreateInitAction
    | EmergencyCreateSuccessAction
    | EmergencyCreateFailureAction
    | EmergencyUpdateInitAction
    | EmergencyUpdateSuccessAction
    | EmergencyUpdateFailureAction
    | EmergencyDeleteInitAction
    | EmergencyDeleteSuccessAction
    | EmergencyDeleteFailureAction;
