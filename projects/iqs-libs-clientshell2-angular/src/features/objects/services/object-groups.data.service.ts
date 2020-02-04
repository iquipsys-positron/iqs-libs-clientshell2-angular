import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

import { ObjectGroup } from '../models/index';
import { IqsSessionConfigService } from '../../session/services/session.config.service';
import { IqsOrganizationsService } from '../../organizations/services/organizations.service';
import { CommonDataService, DataPage } from '../../../common/models/index';

@Injectable()
export class IqsObjectGroupsDataService extends CommonDataService {

    private RESOURCE = '/api/v1/organizations/:organization_id/object_groups';
    private RESOURCE_SINGLE = '/api/v1/organizations/:organization_id/object_groups/:group_id';

    public constructor(
        private sessionConfig: IqsSessionConfigService,
        private organizationsService: IqsOrganizationsService,
        private http: HttpClient,
    ) { super(); }

    private handleError(response: Response) {
        return throwError(response);
    }

    public readObjectGroups(params?: any): Observable<ObjectGroup[]> {
        params = params || {};
        params.organization_id = params.organization_id ? params.organization_id : this.organizationsService.current && this.organizationsService.current.id;
        return this.http.get<DataPage<ObjectGroup>>(this.buildUrl(this.sessionConfig.serverUrl + this.RESOURCE, params))
            .pipe(
                map(response => response['data']),
                catchError(this.handleError)
            );
    }

    public updateObjectGroup(id: string, data: ObjectGroup): Observable<ObjectGroup> {
        const params = {
            organization_id: this.organizationsService.current && this.organizationsService.current.id,
            group_id: id
        };

        return this.http.put<ObjectGroup>(this.buildUrl(this.sessionConfig.serverUrl + this.RESOURCE_SINGLE, params), data)
            .pipe(catchError(this.handleError));
    }

    public createObjectGroup(data: ObjectGroup): Observable<ObjectGroup> {
        const params = {
            organization_id: this.organizationsService.current && this.organizationsService.current.id
        };

        return this.http.post<ObjectGroup>(this.buildUrl(this.sessionConfig.serverUrl + this.RESOURCE, params), data)
            .pipe(catchError(this.handleError));
    }

    public deleteObjectGroup(id: string): Observable<ObjectGroup> {
        const params = {
            organization_id: this.organizationsService.current && this.organizationsService.current.id,
            group_id: id
        };

        return this.http.delete<ObjectGroup>(this.buildUrl(this.sessionConfig.serverUrl + this.RESOURCE_SINGLE, params))
            .pipe(catchError(this.handleError));
    }

}
