import { Component, OnDestroy } from '@angular/core';
import { Subscription, Observable } from 'rxjs';
import { TranslateService } from '@ngx-translate/core';

import { emergencyPanelTranslations } from './emergency-panel.strings';
import { EmergencyPanelState, EmergencyPlan } from '../../models/index';
import { IqsEmergencyPanelService } from '../../services/emergency-panel.service';
import { IqsEmergencyService } from '../../services/emergency.service';
import { EntityState } from '../../../../common/models/index';

@Component({
    selector: 'iqs-emergency-panel',
    templateUrl: './emergency-panel.component.html',
    styleUrls: ['./emergency-panel.component.scss']
})
export class EmergencyPanelComponent implements OnDestroy {

    private subs = new Subscription();
    public currentPlan$: Observable<EmergencyPlan>;
    public panelState$: Observable<EmergencyPanelState>;
    public plans$: Observable<EmergencyPlan[]>;
    public state$: Observable<EntityState>;

    constructor(
        private translate: TranslateService,
        private emergencyService: IqsEmergencyService,
        public emergencyPanelService: IqsEmergencyPanelService
    ) {
        this.currentPlan$ = this.emergencyPanelService.currentPlan$;
        this.panelState$ = this.emergencyPanelService.state$;
        this.emergencyPanelService.currentPlan = null;
        this.plans$ = this.emergencyService.plans$;
        this.state$ = this.emergencyService.state$;
        this.translate.setTranslation('ru', emergencyPanelTranslations.ru, true);
        this.translate.setTranslation('en', emergencyPanelTranslations.en, true);

        this.emergencyPanelService.state = EmergencyPanelState.List;
    }

    ngOnDestroy() {
        this.subs.unsubscribe();
    }

    public selectPlan(plan: EmergencyPlan) {
        this.emergencyPanelService.currentPlan = plan;
    }
}
