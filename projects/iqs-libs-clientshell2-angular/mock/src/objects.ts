import { Injectable } from '@angular/core';
import { HttpRequest, HttpResponse, HttpHandler, HttpEvent, HttpInterceptor, HTTP_INTERCEPTORS } from '@angular/common/http';
import { Observable, of, throwError } from 'rxjs';
import { mergeMap, materialize, delay, dematerialize } from 'rxjs/operators';

import * as utils from './utility';

@Injectable()
export class MockControlObjectsInterceptor implements HttpInterceptor {
    constructor() { }

    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        return of(null).pipe(
            mergeMap(() => {
                const matches = request.url.match(/\/api\/v1\/organizations\/(.{32})\/control_objects[\/]?(.{32})?/);
                if (matches) {
                    switch (request.method) {
                        case 'GET': {
                            if (matches.length > 2 && matches[2]) {
                                const plan = utils.objects.findById(matches[2]);
                                if (plan) {
                                    return of(new HttpResponse({
                                        status: 200,
                                        body: plan
                                    }));
                                } else {
                                    return throwError({
                                        'code': 'OBJECT_NOT_FOUND',
                                        'status': 400,
                                        'name': 'OBJECT_NOT_FOUND',
                                        'message': 'Control object not found',
                                    });
                                }
                            } else {
                                const plans = utils.objects.findByOrganizationId(matches[1]);
                                return of(new HttpResponse({
                                    status: 200,
                                    body: {
                                        total: plans.length,
                                        data: plans
                                    }
                                }));
                            }
                        }
                        case 'POST': {
                            const res = utils.objects.create(request.body);
                            return of(new HttpResponse({
                                status: 200,
                                body: res
                            }));
                        }
                        case 'PUT': {
                            const obNotFoundToThrow = {
                                'code': 'OBJECT_NOT_FOUND',
                                'status': 400,
                                'name': 'OBJECT_NOT_FOUND',
                                'message': 'Control object not found',
                            };
                            if (matches.length < 3 || !matches[2]) { return throwError(obNotFoundToThrow); }
                            const res = utils.objects.update(matches[2], request.body);
                            if (!res) { return throwError(obNotFoundToThrow); }
                            return of(new HttpResponse({
                                status: 200,
                                body: res
                            }));
                        }
                        case 'DELETE': {
                            const obNotFoundToThrow = {
                                'code': 'OBJECT_NOT_FOUND',
                                'status': 400,
                                'name': 'OBJECT_NOT_FOUND',
                                'message': 'Control object not found',
                            };
                            if (matches.length < 3 || !matches[2]) { return throwError(obNotFoundToThrow); }
                            const res = utils.objects.delete(matches[2]);
                            if (!res) { return throwError(obNotFoundToThrow); }
                            return of(new HttpResponse({
                                status: 200,
                                body: res
                            }));
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

export let mockControlObjectsProvider = {
    // use fake backend in place of Http service for backend-less development
    provide: HTTP_INTERCEPTORS,
    useClass: MockControlObjectsInterceptor,
    multi: true
};
