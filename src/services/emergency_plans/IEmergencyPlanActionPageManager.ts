import { ActionPageParams } from './ActionPageParams';
import { EmergencyAction } from '../../data';

export interface IEmergencyPlanActionPageManager {
    actionPagesCollection: ActionPageParams[];

    getPageTitle(action: EmergencyAction): string;
    onPageClick(page: string): void;
}
