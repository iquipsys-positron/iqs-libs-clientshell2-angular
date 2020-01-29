class HttpResponseInterceptor implements ng.IHttpInterceptor {
    private incrementalTimeout = 1000;

    constructor(
        private $q: ng.IQService,
        private $location: ng.ILocationService,
        private $rootScope: ng.IRootScopeService,
        private $injector: ng.auto.IInjectorService
    ) {
        "ngInject";
    }

    private retryRequest(httpConfig) {
        const $timeout = this.$injector.get('$timeout');
        var thisTimeout = this.incrementalTimeout;
        this.incrementalTimeout *= 2;
        return $timeout(() => {
            var $http = this.$injector.get('$http');
            return $http(httpConfig);
        }, thisTimeout);
    }

    public responseError = (rejection: any): ng.IPromise<any> => {
        switch (rejection.status) {
            case 404:
                if (this.incrementalTimeout < 5000) {
                    return this.retryRequest(rejection.config);
                }
                break;
            case 500:
                {
                    if (rejection && rejection.data && rejection.data.code === 'SITE_CLUSTER_NOT_FOUND') {
                        this.$rootScope.$emit('pipClusterError', { error: rejection });
                    }
                    break;
                }
            case 503:
                //available (maintenance)
                this.$rootScope.$emit('pipMaintenanceError', { error: rejection });
                break;
            case -1:
                this.$rootScope.$emit('pipNoConnectionError', { error: rejection });
                break;
            default:
                console.error("errors_unknown", rejection);
                break;
        }
        this.incrementalTimeout = 1000;

        return this.$q.reject(rejection);
    }

}

function configureHttpInterceptor(
    $stateProvider: ng.ui.IStateProvider,
    $httpProvider: ng.IHttpProvider
) {
    // Attach interceptor to react on unauthorized errors
    $httpProvider.interceptors.push('iqsHttpResponseInterceptor');
}

angular
    .module('iqsHttpResponseInterceptor', [])
    .config(configureHttpInterceptor)
    .service('iqsHttpResponseInterceptor', HttpResponseInterceptor);