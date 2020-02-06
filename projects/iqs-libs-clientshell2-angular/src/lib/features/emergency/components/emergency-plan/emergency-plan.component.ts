import { Component, Input, Inject } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { cloneDeep, find } from 'lodash';
import { Observable, BehaviorSubject } from 'rxjs';
import { map } from 'rxjs/operators';

import { emergencyPlanTranslations } from './emergency-plan.strings';
import { EmergencyPlan, EmergencyStep, EmergencyPlanAction } from '../../models/index';
import { IqsEmergencyPanelService } from '../../services/emergency-panel.service';
import { IqsShellService } from '../../../shell/services/shell.service';
import { WINDOW, WindowWrapper } from '../../../../common/index';

@Component({
    selector: 'iqs-emergency-plan',
    templateUrl: './emergency-plan.component.html',
    styleUrls: ['./emergency-plan.component.scss']
})
export class EmergencyPlanComponent {

    private _stepActions: ({ id: string, title: string, uri?: string, params?: any })[] = [
        {
            id: 'ep_action_page_map',
            title: 'EP_ACTION_PAGE_MAP',
            uri: '/monitoring/index.html#/app/map'
        },
        {
            id: 'ep_action_page_map_people',
            title: 'EP_ACTION_PAGE_PEOPLE',
            // TODO: local name of this type
            uri: '/monitoring/index.html#/app/objects',
            params: {
                translate: {
                    type: 'OBJECT_CATEGORY_PERSON'
                }
            }
        },
        {
            id: 'ep_action_page_map_object',
            title: 'EP_ACTION_PAGE_OBJECT',
            // TODO: local name of this type
            uri: '/monitoring/index.html#/app/objects',
            params: {
                translate: {
                    type: 'OBJECT_CATEGORY_EQUIPMENT'
                }
            }
        },
        {
            id: 'ep_action_page_events',
            title: 'EP_ACTION_PAGE_LAST_EVENTS',
            uri: '/monitoring/index.html#/app/map/events'
        },
        {
            id: 'ep_action_page_signals',
            title: 'EP_ACTION_PAGE_SEND_SIGNALS'
        }
    ];
    private _plan: EmergencyPlan;
    private _stepComplete$: BehaviorSubject<number>;

    public isComplete$: Observable<boolean>;

    @Input() set plan(val: EmergencyPlan) {
        this._plan = cloneDeep(val);
        this._stepComplete$.next(0);
    }

    constructor(
        private emergencyPanelService: IqsEmergencyPanelService,
        private shell: IqsShellService,
        private translate: TranslateService,
        @Inject(WINDOW) private window: WindowWrapper
    ) {
        this._stepComplete$ = new BehaviorSubject(0);
        this.isComplete$ = this._stepComplete$.pipe(
            map(c => this._plan && this._plan.steps && Array.isArray(this._plan.steps) && c === this._plan.steps.length)
        );

        this.translate.setTranslation('ru', emergencyPlanTranslations.ru, true);
        this.translate.setTranslation('en', emergencyPlanTranslations.en, true);
    }

    public getPlan(): EmergencyPlan {
        return this._plan;
    }

    public onLocalLinkClick(action: EmergencyPlanAction) {
        const stepAction = find(this._stepActions, ['id', action.params['page']]);
        if (stepAction && stepAction.uri) {
            let params = '';
            if (stepAction.params) {
                params += '?';
                if (stepAction.params['asIs']) {
                    params += Object.entries(stepAction.params['asIs']).map(([key, val]) => `${key}=${val}`).join('&');
                }
                if (stepAction.params['translate']) {
                    if (params.length > 1) { params += '&'; }
                    params += Object.entries(stepAction.params['translate']).map(([key, val]: [string, string]) =>
                        `${key}=${this.translate.instant(val)}`).join('&');
                }
            }
            this.window.location.href = this.window.location.origin + stepAction.uri + params;
        } else if (stepAction && stepAction.id === 'ep_action_page_signals') {
            this.shell.showSendSignal();
        }
    }

    public onToggleStep(step: EmergencyStep) {
        step.checked = !step.checked;
        if (step.checked) {
            this._stepComplete$.next(this._stepComplete$.getValue() + 1);
        } else {
            this._stepComplete$.next(this._stepComplete$.getValue() - 1);
        }
    }

    public onFinish() {
        this.emergencyPanelService.currentPlan = null;
    }
}
