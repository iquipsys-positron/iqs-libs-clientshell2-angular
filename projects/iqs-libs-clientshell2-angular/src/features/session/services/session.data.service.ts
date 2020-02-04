import { Injectable, Inject } from '@angular/core';
import { HttpClient, HttpHeaders, HttpBackend } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

import { Session, SignupUser } from '../models/index';
import { IqsSessionConfigService } from './session.config.service';
import { TEST_ENVIRONMENT } from '../../shell/tokens';

@Injectable()
export class IqsSessionDataService {
    // private RESOURCE_EMAIL_RESEND = '/api/v1/email_settings/resend';
    // private RESOURCE_EMAIL_VERIFY = '/api/v1/email_settings/verify';
    // private RESOURCE_RECOVER = '/api/v1/passwords/recover';
    // private RESOURCE_RESET = '/api/v1/passwords/reset';
    private RESOURCE_RESTORE = '/api/v1/sessions/restore';
    private RESOURCE_SIGNIN = '/api/v1/signin';
    private RESOURCE_SIGNOUT = '/api/v1/signout';
    private RESOURCE_SIGNUP = '/api/v1/signup';
    private RESOURCE_HISTORY = '/api/v1/sessions/history';
    private RESOURCE_CLOSE_ALL = '/api/v1/sessions/close_all';

    private httpBackend: HttpClient;

    public constructor(
        @Inject(TEST_ENVIRONMENT) private isTest: boolean,
        private http: HttpClient,
        private sessionConfig: IqsSessionConfigService,
        handler: HttpBackend,
    ) {
        this.httpBackend = isTest ? http : new HttpClient(handler);
    }

    private handleError(response: Response) {
        return throwError(response);
    }

    public signin(login: string, password: string): Observable<Session> {
        const url = this.sessionConfig.serverUrl + this.RESOURCE_SIGNIN;
        const request: any = {
            login: login,
            email: login,
            password: password
        };
        return this.http.post<Session>(url, request, {})
            .pipe(catchError(this.handleError));
    }

    public signout(): Observable<Session> {
        const url = this.sessionConfig.serverUrl + this.RESOURCE_SIGNOUT;
        const request = {};

        return this.http.post<Session>(url, request)
            .pipe(catchError(this.handleError));
    }

    public signup(user: SignupUser): Observable<Session> {
        const url = this.sessionConfig.serverUrl + this.RESOURCE_SIGNUP;
        const request = {
            name: user.name,
            login: user.login || user.email,
            email: user.email,
            password: user.password,
            time_zone: user.time_zone || null,
            language: user.language || null,
            theme: user.theme || null
        };

        return this.httpBackend.post<Session>(url, request)
            .pipe(catchError(this.handleError));
    }

    public restore(session_id: string): Observable<Session> {
        const url: string = this.sessionConfig.serverUrl + this.RESOURCE_RESTORE;
        const request = {
            session_id: session_id
        };
        const httpOptions = {
            headers: new HttpHeaders({
                'content-type': 'application/json',
                'x-session-id': session_id
            })
        };

        return this.httpBackend.post<Session>(url, request, httpOptions)
            .pipe(catchError(this.handleError));
    }

    public readHistory(): Observable<Session[]> {
        const url: string = this.sessionConfig.serverUrl + this.RESOURCE_HISTORY;
        return this.http.get<Session[]>(url)
            .pipe(catchError(this.handleError));
    }

    public closeAll(): Observable<any> {
        const url: string = this.sessionConfig.serverUrl + this.RESOURCE_CLOSE_ALL;
        return this.http.post(url, null)
            .pipe(catchError(this.handleError));
    }

}
