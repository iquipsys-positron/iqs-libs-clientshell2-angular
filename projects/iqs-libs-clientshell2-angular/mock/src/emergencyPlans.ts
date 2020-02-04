import { Injectable } from '@angular/core';
import { HttpRequest, HttpResponse, HttpHandler, HttpEvent, HttpInterceptor, HTTP_INTERCEPTORS } from '@angular/common/http';
import { Observable, of, throwError } from 'rxjs';
import { mergeMap, materialize, delay, dematerialize } from 'rxjs/operators';

import * as utils from './utility';

@Injectable()
export class MockEmergencyPlansInterceptor implements HttpInterceptor {
    constructor() { }

    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        return of(null).pipe(
            mergeMap(() => {
                const matches = request.url.match(/\/api\/v1\/organizations\/(.{32})\/emergency_plans[\/]?(.{32})?/);
                if (matches) {
                    switch (request.method) {
                        case 'GET': {
                            if (matches.length > 2 && matches[2]) {
                                const plan = utils.emergencyPlans.findById(matches[2]);
                                if (plan) {
                                    return of(new HttpResponse({
                                        status: 200,
                                        body: plan
                                    }));
                                } else {
                                    return throwError({
                                        'code': 'PLAN_NOT_FOUND',
                                        'status': 400,
                                        'name': 'PLAN_NOT_FOUND',
                                        'message': 'Emergency plan not found',
                                    });
                                }
                            } else {
                                const plans = utils.emergencyPlans.findByOrganizationId(matches[1]);
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
                            const res = utils.emergencyPlans.create(request.body);
                            return of(new HttpResponse({
                                status: 200,
                                body: res
                            }));
                        }
                        case 'PUT': {
                            const epNotFoundToThrow = {
                                'code': 'EMERGENCY_PLAN_NOT_FOUND',
                                'status': 400,
                                'name': 'EMERGENCY_PLAN_NOT_FOUND',
                                'message': 'Emergence plan not found',
                            };
                            if (matches.length < 3 || !matches[2]) { return throwError(epNotFoundToThrow); }
                            const res = utils.emergencyPlans.update(matches[2], request.body);
                            if (!res) { return throwError(epNotFoundToThrow); }
                            return of(new HttpResponse({
                                status: 200,
                                body: res
                            }));
                        }
                        case 'DELETE': {
                            const epNotFoundToThrow = {
                                'code': 'EMERGENCY_PLAN_NOT_FOUND',
                                'status': 400,
                                'name': 'EMERGENCY_PLAN_NOT_FOUND',
                                'message': 'Emergence plan not found',
                            };
                            if (matches.length < 3 || !matches[2]) { return throwError(epNotFoundToThrow); }
                            const res = utils.emergencyPlans.delete(matches[2]);
                            if (!res) { return throwError(epNotFoundToThrow); }
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

export let mockEmergencyPlansProvider = {
    // use fake backend in place of Http service for backend-less development
    provide: HTTP_INTERCEPTORS,
    useClass: MockEmergencyPlansInterceptor,
    multi: true
};
