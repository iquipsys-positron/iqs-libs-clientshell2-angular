import { EmergencyAction } from './EmergencyAction';

export class EmergencyStep {
    public index: number;
    public name: string;
    public actions: EmergencyAction[];
    public checked?: boolean;
}