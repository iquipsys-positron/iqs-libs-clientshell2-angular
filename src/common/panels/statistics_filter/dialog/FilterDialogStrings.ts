
{
    function declareFilterDialogTranslateResources(pipTranslateProvider: pip.services.ITranslateProvider) {
        pipTranslateProvider.translations('en', {
            FILTER_DIALOG_TITLE: 'Filter of values',

        });
        pipTranslateProvider.translations('ru', {
            FILTER_DIALOG_TITLE: 'Фильтрация значений',
        });
    }

    angular
        .module('iqsFilterDialog')
        .config(declareFilterDialogTranslateResources);
}
