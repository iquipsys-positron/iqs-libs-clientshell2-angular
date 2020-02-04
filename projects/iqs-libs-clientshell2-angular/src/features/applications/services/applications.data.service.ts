import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

import { IqsApplicationsConfigService } from './applications.config.service';
import { Application, ApplicationTile } from '../models/index';
import { IqsSessionConfigService } from '../../session/services/session.config.service';

@Injectable()
export class IqsApplicationsDataService {

    private RESOURCE = '/api/v1/applications';

    public constructor(
        private applicationsConfig: IqsApplicationsConfigService,
        private sessionConfig: IqsSessionConfigService,
        private http: HttpClient,
    ) { }

    private handleError(response: Response) {
        return throwError(response);
    }

    public readApplications(): Observable<ApplicationTile[]> {
        const url = this.sessionConfig.serverUrl + this.RESOURCE;
        let params = new HttpParams();
        params = params.set('product', this.applicationsConfig.config.productName);

        return this.http.get(url, { params })
            .pipe(
                map(response => response['data']),
                // TODO [A1]: compability
                map((apps: ApplicationTile[]) => {
                    for (const app of apps) {
                        if (app.icon.indexOf(':') >= 0) {
                            const parts = app.icon.split(':');
                            if (parts[1] === 'clock-back') { parts[0] = 'webui'; }
                            if (parts[0] === 'iqs') { parts[0] = 'iqt'; }
                            if (parts[0] === 'icons' || parts[0] === 'webui-icons') { parts[0] = 'webui'; }
                            app.icon = parts.join('-');
                        }
                    }
                    return apps;
                }),
                catchError(this.handleError)
            );
    }

    public updateApplication(app: Application): Observable<any> {
        const url = this.sessionConfig.serverUrl + this.RESOURCE + '/' + app.id;
        let params = new HttpParams();
        params = params.set('product', this.applicationsConfig.config.productName);

        return this.http.put(url, app, { params })
            .pipe(catchError(this.handleError));
    }

    public createApplication(app: Application): Observable<any> {
        const url = this.sessionConfig.serverUrl + this.RESOURCE;
        let params = new HttpParams();
        params = params.set('product', this.applicationsConfig.config.productName);

        return this.http.post(url, app, { params })
            .pipe(catchError(this.handleError));
    }

    public deleteApplication(id: Application | string): Observable<any> {
        const aid = typeof id === 'string' ? id : id.id;
        const url = this.sessionConfig.serverUrl + this.RESOURCE + '/' + aid;
        let params = new HttpParams();
        params = params.set('product', this.applicationsConfig.config.productName);

        return this.http.delete(url, { params })
            .pipe(
                map(() => aid),
                catchError(this.handleError)
            );
    }

}
