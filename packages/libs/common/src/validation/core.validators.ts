import {
  registerDecorator,
  ValidationArguments,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';

export function Match(property: string, validationOptions?: ValidationOptions) {
  return (object: any, propertyName: string) => {
    registerDecorator({
      target: object.constructor,
      propertyName,
      options: validationOptions,
      constraints: [property],
      validator: MatchConstraint,
    });
  };
}

@ValidatorConstraint({ name: 'match' })
export class MatchConstraint implements ValidatorConstraintInterface {
  validate(value: any, args: ValidationArguments) {
    const [relatedPropertyName] = args.constraints;
    const relatedValue = (args.object as any)[relatedPropertyName];
    return value === relatedValue;
  }

  defaultMessage(args: ValidationArguments) {
    const [relatedPropertyName] = args.constraints;
    return `${args.property} and ${relatedPropertyName} do not match`;
  }
}

export function NotMatch(property: string, validationOptions?: ValidationOptions) {
  return (object: any, propertyName: string) => {
    registerDecorator({
      target: object.constructor,
      propertyName,
      options: validationOptions,
      constraints: [property],
      validator: NotMatchConstraint,
    });
  };
}

@ValidatorConstraint({ name: 'notMatch' })
export class NotMatchConstraint implements ValidatorConstraintInterface {
  validate(value: any, args: ValidationArguments) {
    const [relatedPropertyName] = args.constraints;
    const relatedValue = (args.object as any)[relatedPropertyName];
    return value !== relatedValue;
  }

  defaultMessage(args: ValidationArguments) {
    const [relatedPropertyName] = args.constraints;
    return `${args.property} can not match with ${relatedPropertyName}`;
  }
}

export function Lte(property: string, validationOptions?: ValidationOptions) {
  return (object: any, propertyName: string) => {
    registerDecorator({
      target: object.constructor,
      propertyName,
      options: validationOptions,
      constraints: [property],
      validator: LteConstraint,
    });
  };
}

@ValidatorConstraint({ name: 'lte' })
export class LteConstraint implements ValidatorConstraintInterface {
  validate(value: any, args: ValidationArguments) {
    const [relatedPropertyName] = args.constraints;
    const relatedValue = (args.object as any)[relatedPropertyName];

    if (relatedValue === null || relatedValue === undefined) {
      return true;
    } else if (typeof relatedValue !== 'number') {
      return false;
    }

    return value <= relatedValue;
  }

  defaultMessage(args: ValidationArguments) {
    const [relatedPropertyName] = args.constraints;
    return `${args.property} must be lower or equal ${relatedPropertyName}`;
  }
}

export function Gte(property: string, validationOptions?: ValidationOptions) {
  return (object: any, propertyName: string) => {
    registerDecorator({
      target: object.constructor,
      propertyName,
      options: validationOptions,
      constraints: [property],
      validator: GteConstraint,
    });
  };
}

@ValidatorConstraint({ name: 'gte' })
export class GteConstraint implements ValidatorConstraintInterface {
  validate(value: any, args: ValidationArguments) {
    const [relatedPropertyName] = args.constraints;
    const relatedValue = (args.object as any)[relatedPropertyName];

    if (relatedValue === null || relatedValue === undefined) {
      return true;
    } else if (typeof relatedValue !== 'number') {
      return false;
    }

    return value >= relatedValue;
  }

  defaultMessage(args: ValidationArguments) {
    const [relatedPropertyName] = args.constraints;
    return `${args.property} must be lower or equal ${relatedPropertyName}`;
  }
}

export const OBJECT_ID_REGEX = /^[a-f\d]{24}$/i;

export function isValidObjectId(identity?: string | null): identity is string {
  return !!identity && OBJECT_ID_REGEX.test(identity);
}

/**
 * @param validationOptions
 * @constructor
 * @deprecated use class-validator IsMongoId
 */
export function ObjectId(validationOptions?: ValidationOptions) {
  return (object: any, propertyName: string) => {
    registerDecorator({
      target: object.constructor,
      propertyName,
      options: validationOptions,
      validator: ObjectIdConstraint,
    });
  };
}

@ValidatorConstraint({ name: 'ObjectId' })
export class ObjectIdConstraint implements ValidatorConstraintInterface {
  validate(value: any) {
    return isValidObjectId(value);
  }

  defaultMessage(args: ValidationArguments) {
    return `${args.property} must be a valid object id`;
  }
}
