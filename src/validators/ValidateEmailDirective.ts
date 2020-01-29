
const EMAIL_REGEXP = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

function EmailValidator(): ng.IDirective {
    return {
        require: 'ngModel',
        link: function (scope, elm, attrs, ngModelCtrl) {
            ngModelCtrl['$validators'].emailValidate = function (modelValue, viewValue) {
                if (ngModelCtrl['$isEmpty'](modelValue)) {
                    return true;
                }
                if (EMAIL_REGEXP.test(viewValue)) {
                    return true;
                }

                return false;


            }
        }
    };
}
angular.module('ValidateDirectives').directive('iqsEmailValidator', EmailValidator);

