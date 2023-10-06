import { ValidatorOptions } from 'class-validator';
import { IFieldValidationResult } from './interfaces/validation-result.interface';
interface ITranslationError<T> {
    model: T;
    value: any;
    property: keyof T & string;
    rule: string;
    message: string;
    context: any;
}
export interface IValidatorOptions<T extends object = object> {
    isFieldValidator?: boolean;
    rules?: Record<keyof T, [
        (value: any, result: IFieldValidationResult) => Promise<IFieldValidationResult>
    ]> | any;
    translate?: (error: ITranslationError<T>) => string | undefined;
}
export interface IValidationOptions<T extends object = object> extends ValidatorOptions {
    validationField?: keyof T;
}
export declare class ModelValidator<T extends object = object> {
    protected errors: {
        [k in keyof T]?: string;
    };
    protected model?: T;
    protected readonly fieldValidator: any;
    protected options: IValidatorOptions<T>;
    constructor(model?: T, options?: IValidatorOptions<T>);
    addRule(property: keyof T, validator: (value: any, result: IFieldValidationResult) => Promise<IFieldValidationResult>): void;
    setModel(model: T): void;
    hasErrors(): boolean;
    reset(): void;
    getErrorSummary(): string[];
    getValidationResult(): IFieldValidationResult[];
    setErrors(errors: IFieldValidationResult[]): void;
    getError(field: keyof T): { [k in keyof T]?: string; }[keyof T];
    validate(options?: IValidationOptions<T>): Promise<boolean>;
    private validateRules;
    private setValidationErrors;
    private setFirstError;
    validateField(field: keyof T, options?: IValidationOptions<T>): Promise<boolean>;
}
export {};
