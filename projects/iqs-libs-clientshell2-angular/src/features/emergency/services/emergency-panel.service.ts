import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

import { EmergencyPanelState, EmergencyPlan } from '../models/index';
import { IqsShellService } from '../../shell/services/shell.service';

@Injectable({
    providedIn: 'root'
})
export class IqsEmergencyPanelService {

    private _defaultTitle = 'EMERGENCY_PANEL_TITLE';

    private _state$ = new BehaviorSubject<EmergencyPanelState>(EmergencyPanelState.List);
    private _currentPlan$ = new BehaviorSubject<EmergencyPlan>(null);

    constructor(
        private shell: IqsShellService
    ) { }

    public setDefaultTitle(): void {
        this.shell.rightnavTitle = this._defaultTitle;
    }

    public goBack() {
        switch (this.state) {
            case EmergencyPanelState.Details:
                this.state = EmergencyPanelState.List;
                break;
        }
    }

    public get state$(): Observable<EmergencyPanelState> {
        return this._state$.asObservable();
    }

    public get state(): EmergencyPanelState {
        return this._state$.getValue();
    }

    public set state(val: EmergencyPanelState) {
        this._state$.next(val);
        switch (val) {
            case EmergencyPanelState.List:
                this.setDefaultTitle();
                this.shell.rightnavShowBack = false;
                break;
            case EmergencyPanelState.Details:
                this.shell.rightnavTitle = this.currentPlan && this.currentPlan.name ? this.currentPlan.name : this._defaultTitle;
                this.shell.rightnavShowBack = true;
                break;
        }
    }

    public get currentPlan$(): Observable<EmergencyPlan> {
        return this._currentPlan$.asObservable();
    }

    public get currentPlan(): EmergencyPlan {
        return this._currentPlan$.getValue();
    }

    public set currentPlan(emergency_plan: EmergencyPlan) {
        this._currentPlan$.next(emergency_plan);
        this.state = emergency_plan ? EmergencyPanelState.Details : EmergencyPanelState.List;
    }
}
