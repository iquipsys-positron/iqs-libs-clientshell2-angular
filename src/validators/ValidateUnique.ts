function UniqueValidator($parse: ng.IParseService): ng.IDirective {
    return {
        require: 'ngModel',
        link: function (scope, elm, attrs, ngModelCtrl) {
            ngModelCtrl['$validators'].uniqueValidate = function (modelValue, viewValue) {
                if (ngModelCtrl['$isEmpty'](modelValue)) {
                    return true;
                }
                let collection: string[] = [];
                let collectionGetter = $parse(attrs.iqsUniqueCollection);
                if (collectionGetter) {
                    collection = collectionGetter(scope);

                    let search: string = viewValue.toLocaleLowerCase();
                    let index: number = _.findIndex(collection, (item: string) => {
                        return item.toLocaleLowerCase() === search;
                    });

                    return index === -1;
                } else {
                    return true;
                }
            }
        }
    };
}
angular.module('ValidateDirectives').directive('iqsUniqueValidator', UniqueValidator);

