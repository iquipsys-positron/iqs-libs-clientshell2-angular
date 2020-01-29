import '../object_configs/ObjectConfigsService';

import { IEmergencyPlanActionPageManager } from './IEmergencyPlanActionPageManager';
import { ActionPageParams } from './ActionPageParams';
import { EmergencyAction, EmergencyActionParam, SendSignalData } from '../../data';
import { IObjectConfigsService } from '../object_configs';
import { ISendSignalDialogService } from '../../common';
import { ISendSignals } from '../send_signals';

export class EmergencyPlanActionPageManager implements IEmergencyPlanActionPageManager {
    constructor(
        private $state: ng.ui.IStateService,
        private $location: ng.ILocationService,
        private pipTranslate: pip.services.ITranslateService,
        private iqsObjectConfigs: IObjectConfigsService,
        private iqsSendSignalDialog: ISendSignalDialogService,
        private iqsSendSignals: ISendSignals
    ) {
        "ngInject";
    }

    private _actionPagesCollection: ActionPageParams[] = [
        {
            id: 'ep_action_page_map',
            state: 'monitoring.map',
            title: 'EP_ACTION_PAGE_MAP'
        },
        {
            id: 'ep_action_page_map_people',
            state: 'monitoring.map',
            title: 'EP_ACTION_PAGE_PEOPLE'
        },
        {
            id: 'ep_action_page_map_object',
            state: 'monitoring.map',
            title: 'EP_ACTION_PAGE_OBJECT'
        },
        {
            id: 'ep_action_page_events',
            state: 'monitoring.events',
            title: 'EP_ACTION_PAGE_LAST_EVENTS'
        },
        {
            id: 'ep_action_page_signals',
            state: '',
            title: 'EP_ACTION_PAGE_SEND_SIGNALS'
        },
    ];

    public get actionPagesCollection(): ActionPageParams[] {
        return this._actionPagesCollection;
    }

    public getPageTitle(action: EmergencyAction): string {
        if (action && action.params && action.params[EmergencyActionParam.Page]) {
            let index: number = _.findIndex(this.actionPagesCollection, { id: action.params[EmergencyActionParam.Page] });
            return index > -1 ? this.actionPagesCollection[index].title : '';
        }

        return '';
    }

    public onPageClick(page: string): void {
        let index: number = _.findIndex(this.actionPagesCollection, { id: page });
        if (index == -1) { return };

        if (this.actionPagesCollection[index].id == 'ep_action_page_map_object') {
            const localType = this.pipTranslate.translate('OBJECT_CATEGORY_EQUIPMENT');
            this.$location.search('type', localType);
            this.iqsObjectConfigs.type = localType;
            // this.$state.go('monitoring.objects', { type: localType });
            window.location.href = window.location.origin + '/monitoring/index.html#/app/objects?type=' + localType;

            return;
        }
        if (this.actionPagesCollection[index].id == 'ep_action_page_map_people') {
            const localType = this.pipTranslate.translate('OBJECT_CATEGORY_PERSON');
            this.$location.search('type', localType);
            this.iqsObjectConfigs.type = localType;
            // this.$state.go('monitoring.objects', { type: localType });
            window.location.href = window.location.origin + '/monitoring/index.html#/app/objects?type=' + localType;

            return;
        }
        if (this.actionPagesCollection[index].id == 'ep_action_page_map') {
            // this.$state.go('monitoring.map');
            window.location.href = window.location.origin + '/monitoring/index.html#/app/map';

            return;
        }
        if (this.actionPagesCollection[index].id == 'ep_action_page_events') {
            // this.$state.go('monitoring.events');
            window.location.href = window.location.origin + '/monitoring/index.html#/app/events';

            return;
        }
        if (this.actionPagesCollection[index].id == 'ep_action_page_signals') {
            this.iqsSendSignalDialog.show(
                (data: SendSignalData) => {
                    // update data
                    if (!data || !(data.group_ids && data.group_ids.length ||
                        data.object_ids && data.object_ids.length ||
                        data.zone_ids && data.zone_ids.length)) return;

                    this.iqsSendSignals.sendSignals(data);
                },
                () => {

                }
            );
            return;
        }

        // this.$state.go('monitoring.objects');
        window.location.href = window.location.origin + '/monitoring/index.html#/app/objects';
    }
}

{
    angular.module('iqsEmergencyPlanActionPageManager', ['iqsSendSignalDialog', 'iqsObjectConfigs', 'iqsSendSignals'])
        .service('iqsEmergencyPlanActionPageManager', EmergencyPlanActionPageManager);

}