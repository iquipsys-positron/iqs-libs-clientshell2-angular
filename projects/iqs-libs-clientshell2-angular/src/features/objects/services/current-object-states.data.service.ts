import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

import { ObjectState } from '../models/index';
import { IqsSessionConfigService } from '../../session/services/session.config.service';
import { IqsOrganizationsService } from '../../organizations/services/organizations.service';
import { CommonDataService, DataPage } from '../../../common/models/index';

@Injectable()
export class IqsCurrentObjectStatesDataService extends CommonDataService {

    private RESOURCE = '/api/v1/organizations/:organization_id/curr_object_states';
    private RESOURCE_SINGLE = '/api/v1/organizations/:organization_id/curr_object_states/:object_id';

    public constructor(
        private sessionConfig: IqsSessionConfigService,
        private organizationsService: IqsOrganizationsService,
        private http: HttpClient,
    ) { super(); }

    private handleError(response: Response) {
        return throwError(response);
    }

    public readCurrentObjectStates(params?: any): Observable<ObjectState[]> {
        params = params || {};
        params.organization_id = params.organization_id ? params.organization_id : this.organizationsService.current && this.organizationsService.current.id;
        return this.http.get<DataPage<ObjectState>>(this.buildUrl(this.sessionConfig.serverUrl + this.RESOURCE, params))
            .pipe(
                map(response => response['data']),
                catchError(this.handleError)
            );
    }

    public readCurrentObjectState(object_id: string): Observable<ObjectState[]> {
        const params = {
            side_id: this.organizationsService.current && this.organizationsService.current.id,
            object_id
        };
        return this.http.get<DataPage<ObjectState>>(this.buildUrl(this.sessionConfig.serverUrl + this.RESOURCE_SINGLE, params))
            .pipe(
                map(response => response['data']),
                catchError(this.handleError)
            );
    }
}
