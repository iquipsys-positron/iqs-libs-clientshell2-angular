export class Agreement {
    public id?: string;
    public number: string;

    public create_time?: Date;
    public active?: boolean;

    public start_time?: Date;
    public end_time?: Date;

    public company?: string;
    public content?: string;

    // ----

    public inn?: string;
}