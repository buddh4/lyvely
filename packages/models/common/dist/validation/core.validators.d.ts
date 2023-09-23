import { ValidationArguments, ValidationOptions, ValidatorConstraintInterface } from 'class-validator';
export declare function Match(property: string, validationOptions?: ValidationOptions): (object: any, propertyName: string) => void;
export declare class MatchConstraint implements ValidatorConstraintInterface {
    validate(value: any, args: ValidationArguments): boolean;
    defaultMessage(args: ValidationArguments): string;
}
export declare function NotMatch(property: string, validationOptions?: ValidationOptions): (object: any, propertyName: string) => void;
export declare class NotMatchConstraint implements ValidatorConstraintInterface {
    validate(value: any, args: ValidationArguments): boolean;
    defaultMessage(args: ValidationArguments): string;
}
export declare function Lte(property: string, validationOptions?: ValidationOptions): (object: any, propertyName: string) => void;
export declare class LteConstraint implements ValidatorConstraintInterface {
    validate(value: any, args: ValidationArguments): boolean;
    defaultMessage(args: ValidationArguments): string;
}
export declare function Gte(property: string, validationOptions?: ValidationOptions): (object: any, propertyName: string) => void;
export declare class GteConstraint implements ValidatorConstraintInterface {
    validate(value: any, args: ValidationArguments): boolean;
    defaultMessage(args: ValidationArguments): string;
}
export declare const OBJECT_ID_REGEX: RegExp;
export declare function isValidObjectId(identity: string): boolean;
export declare function ObjectId(validationOptions?: ValidationOptions): (object: any, propertyName: string) => void;
export declare class ObjectIdConstraint implements ValidatorConstraintInterface {
    validate(value: any): boolean;
    defaultMessage(args: ValidationArguments): string;
}
