function configHelpTopicsResources(pipRestProvider: pip.rest.IRestProvider) {
    pipRestProvider.registerPagedCollection('help_topics', '/api/v1/help/topics/:topic_id',
        { topic_id: '@topic_id' },
        {
            update: { method: 'PUT' }
        });
}

angular
    .module('iqsHelpTopics.Resource', ['pipCommonRest'])
    .config(configHelpTopicsResources);
