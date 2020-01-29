function configEventTemplateResources(pipRestProvider: pip.rest.IRestProvider) {
    pipRestProvider.registerPagedCollection('event_templates', '/api/v1/organizations/:org_id/event_templates/:template_id',
        { template_id: '@template_id', org_id: '@org_id' },
        {
            update: { method: 'PUT' }
        });

}
            // this.registerRoute('get', '/event_templates', eventTemplates.getTemplatesOperation());
            // this.registerRoute('get', '/event_templates/:template_id', eventTemplates.getTemplatesOperation());
            // this.registerRoute('post', '/event_templates', eventTemplates.createTemplateOperation());
            // this.registerRoute('put', '/event_templates/:template_id', eventTemplates.updateTemplateOperation());
            // this.registerRoute('del', '/event_templates/:template_id', eventTemplates.deleteTemplateOperation());

angular
    .module('iqsEventTemplates.Resource', ['pipCommonRest'])
    .config(configEventTemplateResources);
