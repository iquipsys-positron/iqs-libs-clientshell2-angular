import { IAttendancesDataService, IAttendancesDataProvider } from './IAttendancesDataService';
import { Attendance } from './Attendance';
import { Attendances } from './Attendances';
import { IOrganizationService } from '../../services';

class AttendancesDataService implements IAttendancesDataService {
    private RESOURCE: string = 'attendance';
    private RESOURCE_WITHIN_TIME: string = 'attendance_within_time';

    constructor( 
        private pipRest: pip.rest.IRestService, 
        private pipFormat: pip.services.IFormat,
        private iqsOrganization: IOrganizationService
    ) {
        "ngInject";
    }

    public readAttendances(params: any, successCallback?: (data: Attendances) => void, errorCallback?: (error: any) => void): any {
        params = params ? params : {};
        params.org_id = params.org_id ? params.org_id : this.iqsOrganization.orgId;

        this.pipRest.getResource(this.RESOURCE_WITHIN_TIME).get(
            params, 
            (items: Attendances) => {

            if (successCallback) {
                successCallback(items);
            }
        }, errorCallback);
    }

    public readAttendance(id: string, successCallback?: (data: Attendance) => void, errorCallback?: (error: any) => void): any {
        let params: any = {};
        params.org_id = params.org_id ? params.org_id : this.iqsOrganization.orgId;

        this.pipRest.getResource(this.RESOURCE).get(params, (Attendance: Attendance) => {
            if (successCallback) {
                successCallback(Attendance);
            }
        }, errorCallback);
    }

     public saveAttendance(data: Attendance, successCallback?: (data: Attendance) => void, errorCallback?: (error: any) => void ) {
        this.pipRest.getResource(this.RESOURCE).save(data, (item: Attendance) => {
            if (successCallback) {
                successCallback(item);
            }
        }, errorCallback);
    }

    public deleteAttendance(id: string, successCallback?: (data: any) => void, errorCallback?: (error: any) => void) {
        let params: any = {};
        params.org_id = params.org_id ? params.org_id : this.iqsOrganization.orgId;

        this.pipRest.getResource(this.RESOURCE).delete(params, null , (item) => {
            if (successCallback) {
                successCallback(item);
            }
        }, errorCallback)
    }
}

class AttendancesDataProvider implements IAttendancesDataProvider {
    private _service: IAttendancesDataService;

    constructor() {
        "ngInject";
    }

    public $get(
        pipRest: pip.rest.IRestService,
        pipFormat: pip.services.IFormat,
        iqsOrganization: IOrganizationService
    ) {
        "ngInject";

        if (this._service == null) {
            this._service = new AttendancesDataService(pipRest, pipFormat, iqsOrganization);
        }

        return this._service;
    }

}


angular
    .module('iqsAttendances.Data', ['pipRest', 'pipServices', 'iqsAttendances.Resource'])
    .provider('iqsAttendancesData', AttendancesDataProvider);