import { Transform } from 'class-transformer';
import { IPropertyDefinitionOptions, PropertyType } from './property-type.decorator';

/**
 * Decorator used to transform ObjectId values to string.
 * This is usually used for model classes which mirror a schema type.
 * This decorator works for class-transformer transformations as well as automatic constructor based transformation
 * of BaseModels.
 *
 * Note, unlike @PropertyType the default value for the optional option is false, since in most cases we prefer a null ObjectId
 * instead of an empty string.
 *
 * @param options IPropertyDefinitionOption passed to PropertyType decorator.
 * @constructor
 */
export function TransformObjectId(
  options: IPropertyDefinitionOptions<string> = {},
): PropertyDecorator {
  return function (target: any, propertyKey: string | symbol) {
    Transform(({ value }) => transformObjectId(value))(target, propertyKey);
    options = { optional: true, ...options };
    PropertyType(String, options)(target, propertyKey);
  };
}

/**
 * Decorator used to transform ObjectId arrays values to string arrays.
 * This is usually used for model classes which mirror a schema type.
 * This decorator works for class-transformer transformations as well as automatic constructor based transformation
 * of BaseModels.
 * @param options IPropertyDefinitionOption passed to PropertyType decorator.
 * @constructor
 */
export function TransformObjectIds(
  options?: IPropertyDefinitionOptions<String>,
): PropertyDecorator {
  return function (target: any, propertyKey: string | symbol) {
    Transform(({ value }) => (Array.isArray(value) ? value.map(transformObjectId) : value))(
      target,
      propertyKey,
    );
    PropertyType([String], options)(target, propertyKey);
  };
}

const transformObjectId = (value: any) =>
  typeof value === 'object' && 'toString' in value ? value.toString() : value;
