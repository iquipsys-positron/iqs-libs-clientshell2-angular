import { Injectable, Inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

import { Notification } from '../models/index';
import { IqsSessionConfigService } from '../../session/services/session.config.service';
import { DataPage } from '../../../common/index';

@Injectable()
export class IqsNotificationsDataService {
    private RESOURCE = '/api/v1/notifications';
    private RESOURCE_COUNT = '/api/v1/notifications/count';

    public constructor(
        private http: HttpClient,
        private sessionConfig: IqsSessionConfigService
    ) {
    }

    private handleError(response: Response) {
        return throwError(response);
    }

    public readNotificationsCount(): Observable<number> {
        const url = this.sessionConfig.serverUrl + this.RESOURCE_COUNT;

        return this.http.get<number>(url)
            .pipe(catchError(this.handleError));
    }

    public readNotifications(): Observable<DataPage<Notification>> {
        const url = this.sessionConfig.serverUrl + this.RESOURCE;

        return this.http.get<DataPage<Notification>>(url)
            .pipe(catchError(this.handleError));
    }

}
