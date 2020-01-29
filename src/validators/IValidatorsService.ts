export interface IValidatorsService {
    validatePhone(value: string): boolean;
    setPhoneValidity(value: string, form: any, fieldName: string, fieldValidatorName: string): void;
    validateEmail(email): boolean;
    setEmailValidity(value: string, form: any, fieldName: string, fieldValidatorName: string): void;
}
