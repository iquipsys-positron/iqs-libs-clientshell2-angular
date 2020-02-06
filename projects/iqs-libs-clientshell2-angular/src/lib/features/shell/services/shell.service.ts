import { Injectable, Inject, EventEmitter } from '@angular/core';
import { merge } from 'lodash';
import { BehaviorSubject, Observable } from 'rxjs';

import { RightnavState, ShellConfig } from '../models/index';
import { IqsConfigService } from './config.service';

@Injectable()
export class IqsShellService {

    private _config$: BehaviorSubject<ShellConfig>;
    private _rightnavState$: BehaviorSubject<RightnavState>;
    private _rightnavTitle$: BehaviorSubject<string> = new BehaviorSubject<string>(null);
    private _rightnavShowBack$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
    private _showSendSignal: EventEmitter<any>;

    constructor(private iqsConfig: IqsConfigService) {
        this._config$ = new BehaviorSubject<ShellConfig>(this.iqsConfig.config.shell);
        this._rightnavState$ = new BehaviorSubject<RightnavState>(RightnavState.Help);
        this._showSendSignal = new EventEmitter();
    }

    public get config$(): Observable<ShellConfig> {
        return this._config$.asObservable();
    }

    public getConfig(): ShellConfig {
        return this._config$.getValue();
    }

    public setConfig(config: ShellConfig) {
        const cfg = merge(this.getConfig(), config);
        this._config$.next(cfg);
    }

    public setShadows(shadows: {
        top?: boolean,
        left?: boolean,
        right?: boolean
    }) {
        const cfg = merge(this.getConfig(), { shadows: shadows });
        this._config$.next(cfg);
    }

    public get rightnavState$(): Observable<RightnavState> {
        return this._rightnavState$.asObservable();
    }

    public get rightnavState(): RightnavState {
        return this._rightnavState$.getValue();
    }

    public set rightnavState(state: RightnavState) {
        this._rightnavState$.next(state);
    }

    public get rightnavTitle$(): Observable<string> {
        return this._rightnavTitle$.asObservable();
    }

    public get rightnavTitle(): string {
        return this._rightnavTitle$.getValue();
    }

    public set rightnavTitle(title: string) {
        this._rightnavTitle$.next(title);
    }

    public get rightnavShowBack$(): Observable<boolean> {
        return this._rightnavShowBack$.asObservable();
    }

    public get rightnavShowBack(): boolean {
        return this._rightnavShowBack$.getValue();
    }

    public set rightnavShowBack(showBack: boolean) {
        this._rightnavShowBack$.next(showBack);
    }

    public showSendSignal() {
        this._showSendSignal.emit();
    }

    public get onSendSignal(): EventEmitter<any> {
        return this._showSendSignal;
    }
}
