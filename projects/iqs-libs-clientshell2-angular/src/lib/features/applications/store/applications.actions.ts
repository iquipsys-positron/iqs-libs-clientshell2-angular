import { Action } from '@ngrx/store';

import { ApplicationTile, ApplicationConfig } from '../models/index';

export enum ApplicationsActionType {
    ApplicationsInit = '[Applications] Init',
    ApplicationsAbort = '[Applications] Abort',
    ApplicationsSuccess = '[Applications] Success',
    ApplicationsFailure = '[Applications] Failure',
    ApplicationsEmpty = '[Applications] Empty',
    ApplicationsData = '[Applications] Data',
    ApplicationsToggleFavorite = '[Applications] ToggleFavorite',
    ApplicationsToggleFavoriteSuccess = '[Applications] ToggleFavoriteSuccess',
    ApplicationsToggleFavoriteFailure = '[Applications] ToggleFavoriteFailure',
}

export class ApplicationsInitAction implements Action {
    readonly type = ApplicationsActionType.ApplicationsInit;

    constructor(public favorites: string[]) { }
}

export class ApplicationsAbortAction implements Action {
    readonly type = ApplicationsActionType.ApplicationsAbort;

    constructor() { }
}

export class ApplicationsSuccessAction implements Action {
    readonly type = ApplicationsActionType.ApplicationsSuccess;

    constructor(public payload: ApplicationTile[]) { }
}

export class ApplicationsFailureAction implements Action {
    readonly type = ApplicationsActionType.ApplicationsFailure;

    constructor(public payload: any) { }
}

export class ApplicationsEmptyAction implements Action {
    readonly type = ApplicationsActionType.ApplicationsEmpty;

    constructor() { }
}

export class ApplicationsDataAction implements Action {
    readonly type = ApplicationsActionType.ApplicationsData;

    constructor(public payload: ApplicationTile[]) { }
}

export class ApplicationsToggleFavoriteAction implements Action {
    readonly type = ApplicationsActionType.ApplicationsToggleFavorite;

    constructor(public payload: {
        rid?: string,
        application_id: string,
        state: boolean
    }) { }
}

export class ApplicationsToggleFavoriteSuccessAction implements Action {
    readonly type = ApplicationsActionType.ApplicationsToggleFavoriteSuccess;

    constructor() { }
}

export class ApplicationsToggleFavoriteFailureAction implements Action {
    readonly type = ApplicationsActionType.ApplicationsToggleFavoriteFailure;

    constructor(public payload: {
        rid?: string,
        application_id: string,
        error: any,
        state: boolean
    }) { }
}

export type ApplicationsAction = ApplicationsInitAction
    | ApplicationsAbortAction
    | ApplicationsSuccessAction
    | ApplicationsFailureAction
    | ApplicationsEmptyAction
    | ApplicationsDataAction
    | ApplicationsToggleFavoriteAction
    | ApplicationsToggleFavoriteSuccessAction
    | ApplicationsToggleFavoriteFailureAction;
