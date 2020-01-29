
const PHONE_REGEXP = /^\+[0-9]{10,15}$/; // /^\+(?:[0-9] ?){6,14}[0-9]$/;

function PhoneValidator(): ng.IDirective {
    return {
        require: 'ngModel',
        link: function (scope, elm, attrs, ngModelCtrl) {
            ngModelCtrl['$validators'].phoneValidate = function (modelValue, viewValue) {
                if (ngModelCtrl['$isEmpty'](modelValue)) {
                    return true;
                }
                if (PHONE_REGEXP.test(viewValue)) {
                    return true;
                }

                return false;


            }
        }
    };
}
angular.module('ValidateDirectives').directive('iqsPhoneValidator', PhoneValidator);

