import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

import { IqsSessionConfigService } from '../../session/services/session.config.service';
import { IqsSessionService } from '../../session/services/session.service';

@Injectable()
export class IqsSettingsDataService {
    private RESOURCE = '/api/v1/settings';

    public constructor(
        private http: HttpClient,
        private sessionConfig: IqsSessionConfigService,
        private sessionService: IqsSessionService
    ) { }

    private handleError(response: Response) {
        return throwError(response);
    }

    public readSettings(): Observable<Object> {
        const uid = this.sessionService.session && this.sessionService.session.user_id || null;
        const url = this.sessionConfig.serverUrl + this.RESOURCE + '/' + (uid ? uid : '');
        const request: any = {};

        return this.http.get(url, request)
            .pipe(catchError(this.handleError));
    }

    public createSettings(settings: Object): Observable<any> {
        const uid = this.sessionService.session && this.sessionService.session.user_id || null;
        const url = this.sessionConfig.serverUrl + this.RESOURCE + '/' + (uid ? uid : '');
        const request: any = {};

        return this.http.post(url, settings, request)
            .pipe(catchError(this.handleError));
    }
}
