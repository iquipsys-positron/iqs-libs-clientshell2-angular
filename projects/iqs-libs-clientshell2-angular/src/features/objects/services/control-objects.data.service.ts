import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

import { ControlObject } from '../models/index';
import { IqsSessionConfigService } from '../../session/services/session.config.service';
import { IqsOrganizationsService } from '../../organizations/services/organizations.service';
import { CommonDataService, DataPage } from '../../../common/models/index';

@Injectable()
export class IqsControlObjectsDataService extends CommonDataService {

    private RESOURCE = '/api/v1/organizations/:organization_id/control_objects';
    private RESOURCE_SINGLE = '/api/v1/organizations/:organization_id/control_objects/:object_id';

    public constructor(
        private sessionConfig: IqsSessionConfigService,
        private organizationsService: IqsOrganizationsService,
        private http: HttpClient,
    ) { super(); }

    private handleError(response: Response) {
        return throwError(response);
    }

    public readObjects(params?: any): Observable<ControlObject[]> {
        params = params || {};
        params.organization_id = params.organization_id ? params.organization_id : this.organizationsService.current && this.organizationsService.current.id;
        return this.http.get<DataPage<ControlObject>>(this.buildUrl(this.sessionConfig.serverUrl + this.RESOURCE, params))
            .pipe(
                map(response => response['data']),
                catchError(this.handleError)
            );
    }

    public updateObject(id: string, data: ControlObject): Observable<ControlObject> {
        const params = {
            organization_id: this.organizationsService.current && this.organizationsService.current.id,
            object_id: id
        };

        return this.http.put<ControlObject>(this.buildUrl(this.sessionConfig.serverUrl + this.RESOURCE_SINGLE, params), data)
            .pipe(catchError(this.handleError));
    }

    public createObject(data: ControlObject): Observable<ControlObject> {
        const params = {
            organization_id: this.organizationsService.current && this.organizationsService.current.id
        };

        return this.http.post<ControlObject>(this.buildUrl(this.sessionConfig.serverUrl + this.RESOURCE, params), data)
            .pipe(catchError(this.handleError));
    }

    public deleteObject(id: string): Observable<ControlObject> {
        const params = {
            organization_id: this.organizationsService.current && this.organizationsService.current.id,
            object_id: id
        };

        return this.http.delete<ControlObject>(this.buildUrl(this.sessionConfig.serverUrl + this.RESOURCE_SINGLE, params))
            .pipe(catchError(this.handleError));
    }

}
