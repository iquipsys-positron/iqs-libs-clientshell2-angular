function configShiftsResources(pipRestProvider: pip.rest.IRestProvider) {
    pipRestProvider.registerPagedCollection('shifts', '/api/v1/organizations/:org_id/shifts/:shift_id',
        { shift_id: '@shift_id', org_id: '@org_id' },
        {
            update: { method: 'PUT' }
        });
}

angular
    .module('iqsShifts.Resource', ['pipCommonRest'])
    .config(configShiftsResources);




