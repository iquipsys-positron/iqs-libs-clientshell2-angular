export class EmailSettings {
    /* Recipient information */
    public id?: string;
    public name?: string;
    public email: string;
    public language?: string;

    /* EmailSettings management */
    public subscriptions?: any;
    public verified?: boolean;
    public ver_code?: string;
    public ver_expire_time?: Date;

    /* Custom fields */
    public custom_hdr?: any;
    public custom_dat?: any;

}