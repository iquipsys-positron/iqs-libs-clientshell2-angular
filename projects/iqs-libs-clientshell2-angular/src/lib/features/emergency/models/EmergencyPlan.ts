import { EmergencyStep } from './EmergencyStep';

export class EmergencyPlan {
    public id: string;
    public organization_id: string;
    public name: string;
    public steps?: EmergencyStep[];
}
