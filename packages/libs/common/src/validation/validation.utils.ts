import { getMetadataStorage, ValidationError } from 'class-validator';

export function getPropertyConstraints<T extends object, P extends keyof T>(
  model: T,
  property: P,
): Array<any> {
  return (
    getMetadataStorage()
      .getTargetValidationMetadatas(model.constructor, model.constructor.name, true, false)
      .find((meta) => meta.propertyName === property)?.constraints || []
  );
}

export function getFirstValidationError(error: ValidationError): { message: string; rule: string } {
  const constraints = error.constraints as Record<string, string>;
  const rules = Object.keys(constraints);

  if (!rules.length) return { message: '', rule: '' };

  const firstRule = constraints?.isNotEmpty
    ? 'isNotEmpty'
    : constraints?.isDefined
    ? 'isDefined'
    : rules[0];

  return { message: constraints[firstRule], rule: firstRule };
}
