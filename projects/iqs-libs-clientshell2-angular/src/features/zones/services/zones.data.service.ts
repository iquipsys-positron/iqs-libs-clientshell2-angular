import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

import { Zone } from '../models/index';
import { IqsSessionConfigService } from '../../session/services/session.config.service';
import { IqsOrganizationsService } from '../../organizations/services/organizations.service';
import { CommonDataService, DataPage } from '../../../common/models/index';

@Injectable()
export class IqsZonesDataService extends CommonDataService {

    private RESOURCE = '/api/v1/organizations/:organization_id/zones';
    private RESOURCE_SINGLE = '/api/v1/organizations/:organization_id/zones/:zone_id';

    public constructor(
        private sessionConfig: IqsSessionConfigService,
        private organizationsService: IqsOrganizationsService,
        private http: HttpClient,
    ) { super(); }

    private handleError(response: Response) {
        return throwError(response);
    }

    public readZones(params?: any): Observable<Zone[]> {
        params = params || {};
        params.organization_id = params.organization_id ? params.organization_id : this.organizationsService.current && this.organizationsService.current.id;
        return this.http.get<DataPage<Zone>>(this.buildUrl(this.sessionConfig.serverUrl + this.RESOURCE, params))
            .pipe(
                map(response => response['data']),
                catchError(this.handleError)
            );
    }

    public updateZone(id: string, data: Zone): Observable<Zone> {
        const params = {
            organization_id: this.organizationsService.current && this.organizationsService.current.id,
            zone_id: id
        };
        return this.http.put<Zone>(this.buildUrl(this.sessionConfig.serverUrl + this.RESOURCE_SINGLE, params), data)
            .pipe(catchError(this.handleError));
    }

    public createZone(data: Zone): Observable<Zone> {
        const params = {
            organization_id: this.organizationsService.current && this.organizationsService.current.id
        };

        return this.http.post<Zone>(this.buildUrl(this.sessionConfig.serverUrl + this.RESOURCE, params), data)
            .pipe(catchError(this.handleError));
    }

    public deleteObject(id: string): Observable<Zone> {
        const params = {
            organization_id: this.organizationsService.current && this.organizationsService.current.id,
            zone_id: id
        };

        return this.http.delete<Zone>(this.buildUrl(this.sessionConfig.serverUrl + this.RESOURCE_SINGLE, params))
            .pipe(catchError(this.handleError));
    }

}
