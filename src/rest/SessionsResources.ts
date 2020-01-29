function configSessionsResources(pipRestProvider: pip.rest.IRestProvider) {
    pipRestProvider.registerPagedCollection('sessions', '/api/v1/sessions/:user_id/:session_id',
        { user_id: '@user_id', session_id: '@session_id' });

    // pipRestProvider.registerOperation('close_session', '/api/v1/sessions/close_session/:session_id',
    //     { session_id: '@session_id' },
    //     {
    //         update: { method: 'PUT' },
    //         remove: {  method: 'POST' }
    //     });
}

angular
    .module('iqsSessions.Resource', ['pipCommonRest'])
    .config(configSessionsResources);




