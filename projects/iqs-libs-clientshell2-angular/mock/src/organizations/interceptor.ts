import { Injectable } from '@angular/core';
import { HttpRequest, HttpResponse, HttpHandler, HttpEvent, HttpInterceptor, HTTP_INTERCEPTORS } from '@angular/common/http';
import { Organization } from 'iqs-libs-clientshell2-angular';
import { Observable, of, throwError } from 'rxjs';
import { mergeMap, materialize, delay, dematerialize } from 'rxjs/operators';

import * as utils from '../utility';

@Injectable()
export class MockOrganizationsInterceptor implements HttpInterceptor {
    constructor() { }

    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        return of(null).pipe(
            mergeMap(() => {
                const session = utils.sessions.find(request.headers.get('x-session-id'));
                if (!session) {
                    return throwError({
                        'code': 'SESSION_NOT_FOUND_ERROR',
                        'status': 400,
                        'name': 'SESSION_NOT_FOUND_ERROR',
                        'message': 'Session not found',
                    });
                }
                if (!session.active) {
                    return throwError({
                        'code': 'SESSION_CLOSED_ERROR',
                        'status': 400,
                        'name': 'SESSION_CLOSED_ERROR',
                        'message': 'Session closed',
                    });
                }
                let matches = request.url.match(/\/api\/v1\/organizations\/(.{32})/);
                if (matches) {
                    matches = request.url.match(/\/api\/v1\/organizations\/(.{32})\/connect/);
                    if (matches && request.method === 'POST') {
                        const res = utils.userOrganizations.connect(session.user_id, matches[1]);
                        if (res === 0) {
                            return throwError({
                                'code': 'ORGANIZATION_ALREADY_CONNECTED_ERROR',
                                'status': 400,
                                'name': 'ORGANIZATION_ALREADY_CONNECTED_ERROR',
                                'message': 'Organization already connected to user',
                            });
                        } else if (res === 1) {
                            return throwError({
                                'code': 'ORGANIZATION_NOT_FOUND_ERROR',
                                'status': 400,
                                'name': 'ORGANIZATION_NOT_FOUND_ERROR',
                                'message': 'Organization not found',
                            });
                        } else {
                            return of(new HttpResponse({
                                status: 200,
                                body: res
                            }));
                        }
                    }
                    matches = request.url.match(/\/api\/v1\/organizations\/(.{32})\/disconnect/);
                    if (matches && request.method === 'POST') {
                        const res = utils.userOrganizations.disconnect(session.user_id, matches[1]);
                        if (res === 0) {
                            return throwError({
                                'code': 'ORGANIZATION_ALREADY_DISCONNECTED_ERROR',
                                'status': 400,
                                'name': 'ORGANIZATION_ALREADY_DISCONNECTED_ERROR',
                                'message': 'Organization didn\'t connect to user',
                            });
                        } else if (res === 1) {
                            return throwError({
                                'code': 'ORGANIZATION_NOT_FOUND_ERROR',
                                'status': 400,
                                'name': 'ORGANIZATION_NOT_FOUND_ERROR',
                                'message': 'Organization not found',
                            });
                        } else if (res === 2) {
                            return throwError({
                                'code': 'ORGANIZATION_DISCONNECT_CURRENT_ERROR',
                                'status': 400,
                                'name': 'ORGANIZATION_DISCONNECT_CURRENT_ERROR',
                                'message': 'Cannot disconnect user from current organization',
                            });
                        } else {
                            return of(new HttpResponse({
                                status: 200,
                                body: res
                            }));
                        }
                    }
                }
                if (request.url.match(/\/api\/v1\/organizations$/)) {
                    if (request.method === 'GET') {
                        let organizations: Organization[];
                        if (request.params.get('filter')) {
                            organizations = utils.organizations.find(request.params.get('filter'));
                        } else {
                            organizations = utils.userOrganizations.find(session.user_id);
                        }
                        return of(new HttpResponse({
                            status: 200,
                            body: {
                                total: organizations.length,
                                data: organizations
                            }
                        }));
                    }
                    if (request.method === 'POST') {
                        const organization = utils.organizations.create(request.body, session.user);
                        utils.userOrganizations.connect(session.user_id, organization.id);
                        return of(new HttpResponse({
                            status: 200,
                            body: organization
                        }));
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

export let mockOrganizationsProvider = {
    // use fake backend in place of Http service for backend-less development
    provide: HTTP_INTERCEPTORS,
    useClass: MockOrganizationsInterceptor,
    multi: true
};
