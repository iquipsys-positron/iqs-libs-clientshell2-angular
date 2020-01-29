import { Attendance } from './Attendance';
import { Attendances } from './Attendances';

export interface IAttendancesDataService {
    readAttendances(params: any, successCallback?: (data: Attendances) => void, errorCallback?: (error: any) => void): any;
    readAttendance(id: string, successCallback?: (data: Attendance) => void, errorCallback?: (error: any) => void): any;
    saveAttendance(data: Attendance, successCallback?: (data: Attendance) => void, errorCallback?: (error: any) => void);
    deleteAttendance(id: string, successCallback?: (data: any) => void, errorCallback?: (error: any) => void);
}

export interface IAttendancesDataProvider {

}