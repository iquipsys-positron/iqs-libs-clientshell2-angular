import { EmergencyPlanActionParam } from './EmergencyPlanActionParam';
import { EmergencyPlanActionType } from './EmergencyPlanActionType';

export class EmergencyPlanAction {
    public type: EmergencyPlanActionType;
    public params: {
        [name: string]: string;
    };
}
