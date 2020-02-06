import { EmergencyPlanAction } from './EmergencyPlanAction';

export class EmergencyStep {
    public index: number;
    public name: string;
    public actions: EmergencyPlanAction[];
    public checked?: boolean;
}
