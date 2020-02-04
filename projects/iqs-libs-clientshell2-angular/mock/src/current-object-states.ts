import { Injectable } from '@angular/core';
import { HttpRequest, HttpResponse, HttpHandler, HttpEvent, HttpInterceptor, HTTP_INTERCEPTORS } from '@angular/common/http';
import { Observable, of, throwError } from 'rxjs';
import { mergeMap, materialize, delay, dematerialize } from 'rxjs/operators';

import * as utils from './utility';

@Injectable()
export class MockCurrentObjectStatesInterceptor implements HttpInterceptor {
    constructor() { }

    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        return of(null).pipe(
            mergeMap(() => {
                const matches = request.url.match(/\/api\/v1\/organizations\/(.{32})\/curr_object_states[\/]?(.{32})?/);
                if (matches) {
                    switch (request.method) {
                        case 'GET': {
                            if (matches.length > 2 && matches[2]) {
                                const plan = utils.currentObjectStates.findById(matches[2]);
                                if (plan) {
                                    return of(new HttpResponse({
                                        status: 200,
                                        body: plan
                                    }));
                                } else {
                                    return throwError({
                                        'code': 'OBJECT_STATE_NOT_FOUND',
                                        'status': 400,
                                        'name': 'OBJECT_STATE_NOT_FOUND',
                                        'message': 'Current object state not found',
                                    });
                                }
                            } else {
                                const plans = utils.currentObjectStates.findByOrganizationId(matches[1]);
                                return of(new HttpResponse({
                                    status: 200,
                                    body: {
                                        total: plans.length,
                                        data: plans
                                    }
                                }));
                            }
                        }
                    }
                }

                return next.handle(request);
            }),
            materialize(),
            delay(500),
            dematerialize()
        );
    }
}

export let mockCurrentObjectStatesProvider = {
    // use fake backend in place of Http service for backend-less development
    provide: HTTP_INTERCEPTORS,
    useClass: MockCurrentObjectStatesInterceptor,
    multi: true
};
