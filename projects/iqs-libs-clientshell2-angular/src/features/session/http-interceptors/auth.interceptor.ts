import { Injectable } from '@angular/core';
import {
    HttpRequest,
    HttpHandler,
    HttpEvent,
    HttpInterceptor,
    HTTP_INTERCEPTORS,
    HttpErrorResponse
} from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

import { IqsSessionConfigService } from '../services/session.config.service';
import { IqsSessionService } from '../services/session.service';

@Injectable()
export class IqsSessionAuthInterceptor implements HttpInterceptor {

    constructor(
        private router: Router,
        private sessionConfig: IqsSessionConfigService,
        private sessionService: IqsSessionService
    ) { }

    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        // Get the session id
        const sesionId = this.sessionService.session ? this.sessionService.session.id : null;

        // Clone the request and replace the original headers with
        // cloned headers, updated with the authorization.
        let newHeader;
        if (!(req.body && req.body.constructor && req.body.constructor.name === 'FormData')) {
            newHeader = req.headers.set('content-type', 'application/json');
        }
        if (sesionId && !req.headers.get('x-session-id')) { newHeader = req.headers.set('x-session-id', sesionId); }

        const authReq = req.clone({
            headers: newHeader // req.headers.set('x-session-id', sesionId)
        });

        // send cloned request with header to the next handler.
        return next.handle(authReq).pipe(
            catchError((error: any) => {
                if (error instanceof HttpErrorResponse) {
                    if (error.status === 401) {
                        this.router.navigate([this.sessionConfig.unautorizedUrl]);
                    }
                }
                return throwError(error);
            })
        );
    }
}

export const SessionAuthInterceptorProvider = {
    provide: HTTP_INTERCEPTORS,
    useClass: IqsSessionAuthInterceptor,
    multi: true
};
