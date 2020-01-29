import '../data/help/HelpArticlesDataSevice';
import '../data/help/HelpTopicsDataService';
import '../rest/HelpArticlesResources';
import '../rest/HelpTopicsResources';

angular.module('iqsHelpArticles', [
    'iqsHelpArticles.Data',
    'iqsHelpArticles.Resource'
]);
angular.module('iqsHelpTopics', [
    'iqsHelpTopics.Data',
    'iqsHelpTopics.Resource'
]);
angular.module('iqsHelp', ['iqsHelpArticles', 'iqsHelpTopics']);