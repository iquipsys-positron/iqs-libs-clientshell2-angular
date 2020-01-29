import { CorrectionChange } from './CorrectionChange';

export class Correction {
    public id: string;
    public org_id: string;

    public object_id?: string;
    public group_id?: string;
    public affected_ids?: string[];
    public reason?: string;
    public status: string;
    public time?: Date;

    public create_time: Date;
    public creator_id?: string;
    public creator_name?: string;

    public close_time?: Date;
    public closer_id?: string;
    public closer_name?: string;

    public changes?: CorrectionChange[];
}