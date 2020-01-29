import { ObjectAttendance } from './ObjectAttendance';

export class Attendances {
    public id: string;
    public org_id: string;

    public start_time: string;
    public end_time: string;

    public objects?: ObjectAttendance[];
}