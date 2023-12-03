import {
  registerDecorator,
  ValidationArguments,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';

type ArrayOrGetter = Array<any> | (() => Array<any>);

export function IsIn(arrayOrGetter: ArrayOrGetter, validationOptions?: ValidationOptions) {
  return (object: any, propertyName: string) => {
    registerDecorator({
      target: object.constructor,
      propertyName,
      options: validationOptions,
      constraints: [arrayOrGetter],
      validator: IsInConstraint,
    });
  };
}

@ValidatorConstraint({ name: 'isInWithGetter' })
export class IsInConstraint implements ValidatorConstraintInterface {
  validate(value: any, args: ValidationArguments) {
    const [arrayOrGetter] = args.constraints;
    const array: Array<any> = Array.isArray(arrayOrGetter) ? arrayOrGetter : arrayOrGetter() || [];
    return array.includes(value);
  }

  defaultMessage(args: ValidationArguments) {
    return `${args.property} is not a valid option`;
  }
}
