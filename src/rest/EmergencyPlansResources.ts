
function configEmergencyPlansResources(pipRestProvider: pip.rest.IRestProvider) {
    pipRestProvider.registerPagedCollection('emergency_plans', '/api/v1/organizations/:org_id/emergency_plans/:plan_id',
        { template_id: '@plan_id', org_id: '@org_id' },
        {
            update: { method: 'PUT' }
        });
}
//             this.registerRoute('get', '/emergency_plans', emergencyPlans.getPlansOperation());
//             this.registerRoute('get', '/emergency_plans/:plan_id', emergencyPlans.getPlanOperation());
//             this.registerRoute('post', '/emergency_plans', emergencyPlans.createPlanOperation());
//             this.registerRoute('put', '/emergency_plans/:plan_id', emergencyPlans.updatePlanOperation());
//             this.registerRoute('del', '/emergency_plans/:plan_id', emergencyPlans.deletePlanOperation());

angular
    .module('iqsEmergencyPlans.Resource', ['pipCommonRest'])
    .config(configEmergencyPlansResources);






