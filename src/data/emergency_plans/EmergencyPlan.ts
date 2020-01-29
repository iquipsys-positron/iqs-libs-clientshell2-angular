import { EmergencyStep } from './EmergencyStep';

export class EmergencyPlan {
    public id: string;
    public org_id: string;
    public name: string;
    public steps?: EmergencyStep[];
}