
{
    function declareGlobalHelpResources(pipTranslateProvider: pip.services.ITranslateProvider) {
        pipTranslateProvider.translations('en', {
            GLOBAL_HELP: 'Help',
            GLOBAL_HELP_AUX_TITLE: 'Help',
            GLOBAL_HELP_AUX_DATA_EMPTY_TITLE: 'GLOBAL_HELP_AUX_DATA_EMPTY_TITLE',
            GLOBAL_HELP_AUX_DATA_EMPTY_SUBTITLE: 'GLOBAL_HELP_AUX_DATA_EMPTY_SUBTITLE',
            GLOBAL_HELP_VIDEOS: 'Video',
            GLOBAL_HELP_GUIDES: 'Guide'
        });
        pipTranslateProvider.translations('ru', {
            GLOBAL_HELP: 'Помощь',
            GLOBAL_HELP_AUX_TITLE: 'Помощь',
            GLOBAL_HELP_AUX_DATA_EMPTY_TITLE: 'GLOBAL_HELP_AUX_DATA_EMPTY_TITLE',
            GLOBAL_HELP_AUX_DATA_EMPTY_SUBTITLE: 'GLOBAL_HELP_AUX_DATA_EMPTY_SUBTITLE',
            GLOBAL_HELP_VIDEOS: 'Видео',
            GLOBAL_HELP_GUIDES: 'Руководство'
        });
    }

    angular
        .module('iqsGlobalHelp')
        .config(declareGlobalHelpResources);
}
