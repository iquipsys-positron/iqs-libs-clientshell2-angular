import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, forkJoin } from 'rxjs';

import { IqsSignalsDataService } from './signals.data.service';
import { Signal, SignalType } from '../models/index';
import { IqsSessionConfigService } from '../../session/services/session.config.service';
import { IqsOrganizationsService } from '../../organizations/services/organizations.service';

@Injectable()
export class IqsSignalsSendService {

    public constructor(
        private sessionConfig: IqsSessionConfigService,
        private signalsData: IqsSignalsDataService,
        private organizationsService: IqsOrganizationsService,
        private http: HttpClient,
    ) { }

    public sendById(deviceId: string, signalType: SignalType): Observable<Signal> {
        return this.signalsData.createSignal({
            organization_id: this.organizationsService.current && this.organizationsService.current.id,
            device_id: deviceId,
            type: signalType
        });
    }

    public sendBatch(deviceIds: string[], signalType: SignalType): Observable<any> {
        const requests = [];
        const organization_id = this.organizationsService.current && this.organizationsService.current.id;
        for (const id of deviceIds) {
            requests.push(this.signalsData.createSignal({
                organization_id,
                device_id: id,
                type: signalType
            }));
        }
        return forkJoin(requests);
    }

    // TODO: objects and other stuff required to be stored to find them later
    // public sendSignals()

}
