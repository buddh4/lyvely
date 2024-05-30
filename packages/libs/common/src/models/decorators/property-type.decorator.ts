import { Type, getPrototypeTree } from '../../utils';
import { Type as TransformType } from 'class-transformer';

const modelPropertyTypes: Map<Type, Record<string, IPropertyDefinition>> = new Map();

export type DefaultValue<TValue> = TValue | (() => TValue);

/**
 * This interface defines the type of a property type definition options.
 */
export interface IPropertyDefinitionOptions<TValue> {
  default?: DefaultValue<TValue>;
  noTransform?: boolean;
  optional?: boolean;
}

/**
 * This interface defines the type of a property type definition.
 */
export interface IPropertyDefinition<TTarget = any, TValue = any>
  extends IPropertyDefinitionOptions<TValue> {
  type: TTarget;
}

/**
 * Returns all registered property type definitions of a type.
 * @param type
 */
export function getPropertyTypeDefinitions(type: Type): Record<string, IPropertyDefinition> {
  // TODO: (performance) maybe cache the result
  return getPrototypeTree(type)
    .reverse()
    .reduce(
      (result, prototype: Type) => {
        const definition = modelPropertyTypes.get(prototype);
        return definition ? Object.assign(result, definition) : result;
      },
      {} as Record<string, IPropertyDefinition>
    );
}

/**
 * Returns the property type of a specific property of the given type.
 * @param type
 */
export function getPropertyTypeDefinition(type: Type, propertyKey: string) {
  const typeDefinition = getPropertyTypeDefinitions(type);
  return typeDefinition ? typeDefinition[propertyKey] : undefined;
}

/**
 * Decorator used to transform or instantiate values of a class property.
 * This decorator works for class-transformer transformations as well as automatic constructor based transformation
 * of BaseModels.
 *
 * A value defined by the `default` option will be set in case no value was provided e.g. in a constructor .
 * Note, this does not work with class-validator plainToInstance.
 *
 * Unless a property is explicitly marked as `optional`, it will either automatically create an instance of the
 * specified type or use a type specific default value:
 *
 * - `string`: `''`
 * - `number`: `0`
 * - `symbol`: `null`
 * - `boolean`: `false`
 * - `Array`: `[]`
 *
 * Note, this does not work with class-validator plainToInstance.
 *
 * @param options IPropertyDefinitionOption passed to PropertyType decorator.
 * @see initBaseModelData for the actual implementation.
 * @constructor
 */
export function PropertyType<
  TTarget extends Object,
  TProperty extends Extract<keyof TTarget, string>,
  TValue = TTarget[TProperty],
>(
  type: Type<TValue> | Array<Type<TValue>> | null | undefined,
  options: IPropertyDefinitionOptions<TValue> = {}
): PropertyDecorator {
  return function (target: Object, propertyKey: string | symbol) {
    const targetConstructor = target.constructor as Type;
    if (!modelPropertyTypes.has(targetConstructor)) modelPropertyTypes.set(targetConstructor, {});
    (modelPropertyTypes.get(targetConstructor) as any)[propertyKey] = Object.assign(
      { type },
      options
    );

    const RawType = Array.isArray(type) ? type[0] : type;

    if (
      !options.noTransform &&
      RawType &&
      typeof RawType === 'function' &&
      RawType.prototype &&
      !Array.isArray(RawType) &&
      ![String, Number, Boolean, BigInt, Symbol].includes(<any>RawType)
    ) {
      TransformType(() => RawType)(target, propertyKey);
    }
  };
}
