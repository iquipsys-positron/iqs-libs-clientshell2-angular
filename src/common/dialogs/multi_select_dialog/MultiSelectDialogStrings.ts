
{
    function declareMultiDialogTranslateResources(pipTranslateProvider: pip.services.ITranslateProvider) {
        pipTranslateProvider.translations('en', {
            ENTITY_DEFAULT_DIALOG_TITLE: 'Select objects and groups',

        });
        pipTranslateProvider.translations('ru', {
            ENTITY_DEFAULT_DIALOG_TITLE: 'Выберите объекты и группы',
        });
    }

    angular
        .module('iqsMultiSelectDialog')
        .config(declareMultiDialogTranslateResources);
}
