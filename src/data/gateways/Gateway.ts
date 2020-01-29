import { CommStatistics } from './CommStatistics';

export class Gateway {
    public id: string;
    public org_id: string;
    public model?: string;
    public version?: number;
    public udi: string;
    public label?: string;
    public create_time?: Date;
    public active?: boolean;
    public rec_time?: Date;
    public ping_time?: Date;
    public stats_time?: Date;
    public stats?: CommStatistics[];

    // public id: string;
    // public org_id: string;
    // public model?: string;
    // public version?: number;
    // public udi: string;
    // public label?: string;
    // public create_time?: Date;
    // public active?: boolean;
    // public receive_time?: Date;
}