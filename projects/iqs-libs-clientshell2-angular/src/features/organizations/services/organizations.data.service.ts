import { Injectable, Inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

import { Organization } from '../models/index';
// import { SessionConfig, SESSION_CONFIG } from '../../session/models/SessionConfig';
import { IqsSessionConfigService } from '../../session/services/session.config.service';
import { DataPage } from '../../../common/index';

@Injectable()
export class IqsOrganizationsDataService {
    private RESOURCE = '/api/v1/organizations';

    public constructor(
        private http: HttpClient,
        // @Inject(SESSION_CONFIG) private config: SessionConfig,
        private sessionConfig: IqsSessionConfigService
    ) { }

    private handleError(response: Response) {
        return throwError(response);
    }

    public readOrganizations(filter?: string): Observable<DataPage<Organization>> {
        const url = this.sessionConfig.serverUrl + this.RESOURCE;
        let params = new HttpParams();
        if (filter) { params = params.set('filter', filter); }
        return this.http.get<DataPage<Organization>>(url, { params })
            .pipe(catchError(this.handleError));
    }

    // TODO: mocking not implemented for this
    public readOrganization(organizationId: string): Observable<Organization> {
        const url = this.sessionConfig.serverUrl + this.RESOURCE + '/' + organizationId;
        return this.http.get<Organization>(url)
            .pipe(catchError(this.handleError));
    }

    public createOrganization(data: Organization): Observable<Organization> {
        const url = this.sessionConfig.serverUrl + this.RESOURCE;
        return this.http.post<Organization>(url, data)
            .pipe(catchError(this.handleError));
    }

    public connectToOrganization(organizationId: string): Observable<Organization> {
        const url = this.sessionConfig.serverUrl + this.RESOURCE + '/' + organizationId + '/connect';
        return this.http.post<Organization>(url, {})
            .pipe(catchError(this.handleError));
    }

    public disconnectFromOrganization(organizationId: string): Observable<Organization> {
        const url = this.sessionConfig.serverUrl + this.RESOURCE + '/' + organizationId + '/disconnect';
        return this.http.post<Organization>(url, {})
            .pipe(catchError(this.handleError));
    }
}
