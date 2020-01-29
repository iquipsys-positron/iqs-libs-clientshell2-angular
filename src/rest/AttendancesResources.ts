function configAttendancesResources(pipRestProvider: pip.rest.IRestProvider) {
    // resource, url, path, defaultParams, actions
    pipRestProvider.registerPagedCollection('attendance', '/api/v1/organizations/:org_id/attendance',
        { org_id: '@org_id' },
        {
            page: { method: 'GET', isArray: false },
            update: { method: 'PUT' }
        });

    pipRestProvider.registerPagedCollection('attendance_within_time', '/api/v1/organizations/:org_id/attendance/within_time',
        { org_id: '@org_id' });

    // pipRestProvider.registerPagedCollection('attendance_batch', '/api/v1/organizations/:org_id/attendance/batch',
    //     { user_id: '@user_id', org_id: '@org_id' });
}

// if (attendance) {
//     this.registerRouteWithAuth('get', '/organizations/:org_id/attendance', auth.organizationUser(), attendance.getAttendancesOperation());
//     this.registerRouteWithAuth('get', '/organizations/:org_id/attendance/within_time', auth.organizationUser(), attendance.getAttendancesWithinTimeOperation());
//     this.registerRouteWithAuth('post', '/organizations/:org_id/attendance', auth.organizationAdmin(), attendance.addAttendanceOperation());
//     this.registerRouteWithAuth('post', '/organizations/:org_id/attendance/batch', auth.organizationAdmin(), attendance.addAttendancesOperation());
//     this.registerRouteWithAuth('del', '/organizations/:org_id/attendance', auth.organizationAdmin(), attendance.deleteAttendancesOperation());
// }

angular
    .module('iqsAttendances.Resource', ['pipCommonRest'])
    .config(configAttendancesResources);