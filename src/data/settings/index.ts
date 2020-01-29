angular.module('iqsSettings.Data', ['iqsEmailSettings.Data', 'iqsSmsSettings.Data', 'iqsSettings.Resource']);

export * from './IEmailSettingsDataService';
export * from './ISmsSettingsDataService';
export * from './EmailSettings';
export * from './SmsRecipient';
export * from './SmsSettings';