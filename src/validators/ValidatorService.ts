import { IValidatorsService } from './IValidatorsService';

class ValidatorsService implements IValidatorsService {
    constructor(

    ) {
        "ngInject";

    }

    public validatePhone(value: string): boolean {
        var regex = /^\+(?:[0-9] ?){6,14}[0-9]$/;

        return regex.test(value);
    }

    public setPhoneValidity(value: string, form: any, fieldName: string, fieldValidatorName: string): void {
        if (form && form[fieldName]) {
            form[fieldName].$setValidity(fieldValidatorName, this.validatePhone(value));
        }
    }

    public validateEmail(email): boolean {
        var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

        return re.test(email);
    }

    public setEmailValidity(value: string, form: any, fieldName: string, fieldValidatorName: string): void {
        if (form && form[fieldName]) {
            form[fieldName].$setValidity(fieldValidatorName, this.validateEmail(value));
        }
    }


}

{
    angular.module('iqsValidatorsService', [])
        .service('iqsValidatorsService', ValidatorsService);
}                