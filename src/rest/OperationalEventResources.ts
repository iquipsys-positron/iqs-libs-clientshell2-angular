function configOperationalEventResources(pipRestProvider: pip.rest.IRestProvider) {
    pipRestProvider.registerPagedCollection('operational_events', '/api/v1/organizations/:org_id/operational_events/:event_id', { org_id: '@org_id' });
}

            // this.registerRoute('get', '/operational_events', operationalEvents.getEventsOperation());
            // this.registerRoute('post', '/operational_events', operationalEvents.logEventOperation());
            // this.registerRoute('del', '/operational_events/:event_id', operationalEvents.deleteEventOperation());

angular
    .module('iqsOperationalEvents.Resource', ['pipCommonRest'])
    .config(configOperationalEventResources);
