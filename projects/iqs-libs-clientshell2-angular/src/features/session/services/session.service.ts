import { Injectable, Inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { LocalStorageService } from 'angular-2-local-storage';
import { CookieService } from 'ngx-cookie-service';
import { Observable } from 'rxjs';
import { first, map } from 'rxjs/operators';

import { IqsSessionConfigService } from './session.config.service';
import {
    SessionState,
    SessionCloseAllInitAction,
    SessionSigninInitAction,
    SessionSigninAbortAction,
    SessionSignoutInitAction,
    SessionRestoreInitAction,
    getSessionSession,
    getSessionState,
    getSessionError,
} from '../store/index';
import { Session } from '../models/index';
import { EntityState } from '../../../common/index';
import { WINDOW, WindowWrapper } from '../../../common/services/window.service';

@Injectable()
export class IqsSessionService {

    constructor(
        // @Inject(SESSION_CONFIG) private config: SessionConfig,
        @Inject(WINDOW) private window: WindowWrapper,
        private cookies: CookieService,
        private localStorageService: LocalStorageService,
        private router: Router,
        private sessionConfig: IqsSessionConfigService,
        private store: Store<SessionState>
    ) { }

    public get session$(): Observable<Session> {
        return this.store.select(getSessionSession);
    }

    public get state$(): Observable<EntityState> {
        return this.store.select(getSessionState);
    }

    public get error$(): Observable<any> {
        return this.store.select(getSessionError);
    }

    public get session(): Session {
        let session;
        this.session$.pipe(first()).subscribe(s => session = s);
        return session;
    }

    public get isAuthorized$(): Observable<boolean> {
        return this.state$.pipe(map(state => state === EntityState.Data));
    }

    public signin(login: string, password: string) {
        this.store.dispatch(new SessionSigninInitAction(login, password));
    }

    public abortSignin() {
        this.store.dispatch(new SessionSigninAbortAction());
    }

    public signout() {
        this.store.dispatch(new SessionSignoutInitAction());
    }

    public restore() {
        const lsSession = <Session>this.localStorageService.get(this.sessionConfig.lsKeys.session);
        const session_id = lsSession ? lsSession.id : this.cookies.get('sessionId');
        const user_id = lsSession ? lsSession.user_id : this.cookies.get('userId');
        if (session_id && user_id && this.sessionConfig.lsKeys.serverUrl) {
            this.store.dispatch(new SessionRestoreInitAction({ session_id, user_id }));
        } else {
            this.window.location.href = this.window.location.origin + this.sessionConfig.unautorizedUrl + '?from=' + this.router.url;
        }
    }

    public closeAll() {
        this.store.dispatch(new SessionCloseAllInitAction());
    }
}
