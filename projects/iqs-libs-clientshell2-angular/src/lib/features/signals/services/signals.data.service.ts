import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

import { Signal } from '../models/index';
import { IqsSessionConfigService } from '../../session/services/session.config.service';
import { IqsOrganizationsService } from '../../organizations/services/organizations.service';
import { CommonDataService, DataPage } from '../../../common/models/index';

@Injectable()
export class IqsSignalsDataService extends CommonDataService {

    private RESOURCE = '/api/v1/organizations/:organization_id/signals';
    private RESOURCE_SINGLE = '/api/v1/organizations/:organization_id/signals/:signal_id';
    private RESOURCE_SINGLE_LOCK = '/api/v1/organizations/:organization_id/signals/:signal_id/lock';
    private RESOURCE_SINGLE_CLOSE = '/api/v1/organizations/:organization_id/signals/:signal_id/close';

    public constructor(
        private sessionConfig: IqsSessionConfigService,
        private organizationsService: IqsOrganizationsService,
        private http: HttpClient,
    ) { super(); }

    private handleError(response: Response) {
        return throwError(response);
    }

    public readSignals(params?: any): Observable<Signal[]> {
        params = params || {};
        params.organization_id = params.organization_id ? params.organization_id : this.organizationsService.current && this.organizationsService.current.id;
        return this.http.get<DataPage<Signal>>(this.buildUrl(this.sessionConfig.serverUrl + this.RESOURCE, params))
            .pipe(
                map(response => response['data']),
                catchError(this.handleError)
            );
    }

    public createSignal(data: Signal): Observable<Signal> {
        const params = {
            organization_id: this.organizationsService.current && this.organizationsService.current.id
        };

        return this.http.post<Signal>(this.buildUrl(this.sessionConfig.serverUrl + this.RESOURCE, params), data)
            .pipe(catchError(this.handleError));
    }

    public deleteSignal(id: string): Observable<Signal> {
        const params = {
            organization_id: this.organizationsService.current && this.organizationsService.current.id,
            signal_id: id
        };

        return this.http.delete<Signal>(this.buildUrl(this.sessionConfig.serverUrl + this.RESOURCE_SINGLE, params))
            .pipe(catchError(this.handleError));
    }

    public lockSignal(id: string): Observable<Signal> {
        const params = {
            organization_id: this.organizationsService.current && this.organizationsService.current.id,
            signal_id: id
        };

        return this.http.post<Signal>(this.buildUrl(this.sessionConfig.serverUrl + this.RESOURCE_SINGLE_LOCK, params), params)
            .pipe(catchError(this.handleError));
    }

    public closeSignal(id: string): Observable<Signal> {
        const params = {
            organization_id: this.organizationsService.current && this.organizationsService.current.id,
            signal_id: id
        };

        return this.http.post<Signal>(this.buildUrl(this.sessionConfig.serverUrl + this.RESOURCE_SINGLE_CLOSE, params), params)
            .pipe(catchError(this.handleError));
    }

}
