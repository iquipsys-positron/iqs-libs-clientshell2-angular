function configSettingsResources(pipRestProvider: pip.rest.IRestProvider) {
    // resource, url, path, defaultParams, actions
    pipRestProvider.registerPagedCollection('settings', '/api/v1/settings/:section/:key',
        { section: '@section' },
        {
            page: { method: 'GET', isArray: false },
            update: { method: 'PUT' }
        }
    );
    pipRestProvider.registerOperation('settings_section', '/api/v1/settings/ids');


    
    pipRestProvider.registerOperation('requestEmailVerification', '/api/v1/email_settings/resend');
    pipRestProvider.registerOperation('verifyEmail', '/api/v1/email_settings/verify');
    pipRestProvider.registerResource('email_settings', '/api/v1/email_settings/:user_id', 
        { user_id: '@user_id' },
        {
            get: { method: 'GET', isArray: false },
            update: { method: 'PUT' }
        }
    );
    
    pipRestProvider.registerOperation('requestPhoneVerification', '/api/v1/sms_settings/resend');
    pipRestProvider.registerOperation('verifyPhone', '/api/v1/sms_settings/verify');
    pipRestProvider.registerResource('sms_settings', '/api/v1/sms_settings/:user_id', 
        { user_id: '@user_id' },
        {
            get: { method: 'GET', isArray: false },
            update: { method: 'PUT' }
        }
    );


}

angular
    .module('iqsSettings.Resource', ['pipSettingsResources'])
    .config(configSettingsResources);