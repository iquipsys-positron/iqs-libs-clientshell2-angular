function configHelpArticlesResources(pipRestProvider: pip.rest.IRestProvider) {
    pipRestProvider.registerPagedCollection('help_articles', '/api/v1/help/articles/:article_id',
        { article_id: '@article_id' },
        {
            update: { method: 'PUT' }
        });
    pipRestProvider.registerPagedCollection('help_article_random', '/api/v1/help/articles/random');
}

angular
    .module('iqsHelpArticles.Resource', ['pipCommonRest'])
    .config(configHelpArticlesResources);
