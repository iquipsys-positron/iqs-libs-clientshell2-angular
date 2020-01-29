export class Invitation {
    public id: string;

    public action: string;
    public org_id: string;
    public organization_name?: string;
    public role?: string;
    public language?: string;

    public create_time?: Date;
    public creator_name?: string;
    public creator_id: string;

    public invitee_name?: string;
    public invitee_email?: string;
    public invitee_id?: string;

    public sent_time?: Date;
    public expire_time?: Date;
}

