import { Organization } from '../organizations';

export class Account {
    public roles?: any[]; // todo Role[] or string
    public theme?: string;
    public language?: string;
    public time_zone?: string;
    public create_time?: string; // JSON date
    public change_pwd_time?: string; // JSON date
    public login: string;
    public name?: string;
    public id?: string;
    public organizations?: Organization[];
}