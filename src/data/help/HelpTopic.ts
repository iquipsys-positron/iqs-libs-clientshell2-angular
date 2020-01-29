export class HelpTopic {
    public id: string;
    public parent_id?: string;
    public app: string;
    public index?: number;
    public title: any;
    public popular?: boolean;

    /* Custom fields */
    public custom_hdr?: any;
    public custom_dat?: any;

    // aded fields
    public translateTitle: string;
}