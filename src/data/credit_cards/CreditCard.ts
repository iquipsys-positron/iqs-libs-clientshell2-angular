import { Address } from './Address';

export class CreditCard {
    public id?: string;
    public customer_id?: string;

    public create_time?: Date;
    public update_time?: Date;
    
    public type?: string;
    public number?: string;
    public expire_month?: number;
    public expire_year?: number;
    public first_name?: string;
    public last_name?: string;
    public billing_address?: Address;
    public state?: string;
    public ccv?: string;

    public name?: string;
    public saved?: boolean;
    public default?: boolean;
}