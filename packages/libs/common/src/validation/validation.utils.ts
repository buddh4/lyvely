import { getMetadataStorage } from 'class-validator';

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
