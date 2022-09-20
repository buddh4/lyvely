import { getPrototypeTree, Type } from "../../util";

type DefaultValue<TValue> = TValue | (() => TValue);

interface PropertyDefinition<TTarget = any, TValue = any> {
  type: TTarget,
  default?: DefaultValue<TValue>
  optional?: boolean
}

interface PropertyDefinitionOption<TValue> {
  default?: DefaultValue<TValue>,
  optional?: boolean
}

const modelPropertyTypes: Map<Type, Record<string, PropertyDefinition>> = new Map();

export function PropertyType<
  TTarget,
  TProperty extends Extract<keyof TTarget, string>,
  TValue = TTarget[TProperty]>
    (type: Type<TValue>|Array<Type<TValue>>, options: PropertyDefinitionOption<TValue> = {}): PropertyDecorator {
  return function (target: TTarget, propertyKey: TProperty) {
    const targetConstructor = target.constructor as Type;
    if(!modelPropertyTypes.has(targetConstructor)) modelPropertyTypes.set(targetConstructor, {});
    modelPropertyTypes.get(targetConstructor)[propertyKey] = Object.assign({ type }, options);
  };
}

export function getPropertyTypeDefinitions(type: Type): Record<string, PropertyDefinition> {
  // TODO: (performance) maybe cache the result
  return getPrototypeTree(type).reverse().reduce((result, prototype: Type) => {
      const definition = modelPropertyTypes.get(prototype);
      return definition ? Object.assign(result, definition) : result;
  }, {} as Record<string, PropertyDefinition>);
}

export function getPropertyTypeDefinition(type: Type, propertyKey: string) {
  const typeDefinition = getPropertyTypeDefinitions(type);
  return typeDefinition ? typeDefinition[propertyKey] : undefined;
}

export function getPropertyType(type: Type, propertyKey: string) {
  return getPropertyTypeDefinition(type, propertyKey)?.type;
}
