import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

import { EmergencyPlan } from '../models/index';
import { IqsSessionConfigService } from '../../session/services/session.config.service';
import { IqsOrganizationsService } from '../../organizations/services/organizations.service';
import { CommonDataService } from '../../../common/models/CommonDataService';
import { DataPage } from '../../../common/models/DataPage';

@Injectable({
    providedIn: 'root'
})
export class IqsEmergencyDataService extends CommonDataService {

    private RESOURCE = '/api/v1/organizations/:organization_id/emergency_plans';
    private RESOURCE_SINGLE = '/api/v1/organizations/:organization_id/emergency_plans/:plan_id';

    constructor(
        private http: HttpClient,
        private sessionConfig: IqsSessionConfigService,
        private organizationsService: IqsOrganizationsService,
    ) { super(); }

    private handleError(response: Response) {
        return throwError(response);
    }

    public readEmergencyPlans(params?: any): Observable<EmergencyPlan[]> {
        params = params || {};
        params.organization_id = params.organization_id ? params.organization_id : (this.organizationsService.current && this.organizationsService.current.id);

        return this.http.get<DataPage<EmergencyPlan>>(this.buildUrl(this.sessionConfig.serverUrl + this.RESOURCE, params))
            .pipe(
                map((res: DataPage<EmergencyPlan>) => res.data),
                catchError(this.handleError)
            );
    }

    public readEmergencyPlan(id: string): Observable<EmergencyPlan> {
        const params = {
            plan_id: id
        };
        if (this.organizationsService.current) {
            params['organization_id'] = this.organizationsService.current.id;
        }

        return this.http.get<EmergencyPlan>(this.buildUrl(this.sessionConfig.serverUrl + this.RESOURCE_SINGLE, params))
            .pipe(catchError(this.handleError));
    }

    public createEmergencyPlan(data: EmergencyPlan): Observable<EmergencyPlan> {
        const params = {};
        if (this.organizationsService.current) {
            params['organization_id'] = this.organizationsService.current.id;
        }
        return this.http.post<EmergencyPlan>(this.buildUrl(this.sessionConfig.serverUrl + this.RESOURCE, params), data)
            .pipe(catchError(this.handleError));
    }

    public updateEmergencyPlan(id: string, data: EmergencyPlan): Observable<EmergencyPlan> {
        const params = {
            plan_id: id
        };
        if (this.organizationsService.current) {
            params['organization_id'] = this.organizationsService.current.id;
        }

        return this.http.put<EmergencyPlan>(this.buildUrl(this.sessionConfig.serverUrl + this.RESOURCE_SINGLE, params), data)
            .pipe(catchError(this.handleError));
    }

    public deleteEmergencyPlan(id: string): Observable<string> {
        const params = {
            plan_id: id
        };
        if (this.organizationsService.current) {
            params['organization_id'] = this.organizationsService.current.id;
        }
        return this.http.delete<EmergencyPlan>(this.buildUrl(this.sessionConfig.serverUrl + this.RESOURCE_SINGLE, params))
            .pipe(
                map((plan: EmergencyPlan) => plan.id),
                catchError(this.handleError)
            );
    }
}
