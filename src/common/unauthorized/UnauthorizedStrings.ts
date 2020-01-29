function setUnauthorizedErrorPageResources($injector: angular.auto.IInjectorService) {
    let pipTranslate: any = $injector.has('pipTranslate') ? $injector.get('pipTranslate') : null;
    if (pipTranslate == null) return;

    // Set translation strings for the module
    pipTranslate.translations('en', {
        'ERROR_UNAUTHORIZED_TITLE': 'You do not have access',
        'ERROR_UNAUTHORIZED_SUBTITLE': 'You do not have enough access rights to execute the operation. Choose another action or sign in with properly account.',
        'ERROR_UNAUTHORIZED_SIGNOUT': 'Signout',
        'ERROR_UNAUTHORIZED_PAGE_TITLE': 'Access error'
    });

    pipTranslate.translations('ru', {
        'ERROR_UNAUTHORIZED_TITLE': 'У Вас нет доступа',
        'ERROR_UNAUTHORIZED_SUBTITLE': 'У Вас не хватает прав доступа для выполенния операции. Выбeрите другое действие или войдите под другим именем.',
        'ERROR_UNAUTHORIZED_SIGNOUT': 'Выйти',
        'ERROR_UNAUTHORIZED_PAGE_TITLE': 'Ошибка доступа'
    });
}


angular
    .module('pipErrors.Unauthorized')
    .run(setUnauthorizedErrorPageResources);
