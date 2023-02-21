import { getPrototypeTree, Type } from '@/utils';

const modelPropertyTypes: Map<Type, Record<string, IPropertyDefinition>> = new Map();

export type DefaultValue<TValue> = TValue | (() => TValue);

export interface IPropertyDefinitionOption<TValue> {
  default?: DefaultValue<TValue>;
  optional?: boolean;
}

export interface IPropertyDefinition<TTarget = any, TValue = any>
  extends IPropertyDefinitionOption<TValue> {
  type: TTarget;
}

export function getPropertyTypeDefinitions(type: Type): Record<string, IPropertyDefinition> {
  // TODO: (performance) maybe cache the result
  return getPrototypeTree(type)
    .reverse()
    .reduce((result, prototype: Type) => {
      const definition = modelPropertyTypes.get(prototype);
      return definition ? Object.assign(result, definition) : result;
    }, {} as Record<string, IPropertyDefinition>);
}

export function getPropertyTypeDefinition(type: Type, propertyKey: string) {
  const typeDefinition = getPropertyTypeDefinitions(type);
  return typeDefinition ? typeDefinition[propertyKey] : undefined;
}

export function PropertyType<
  TTarget,
  TProperty extends Extract<keyof TTarget, string>,
  TValue = TTarget[TProperty],
>(
  type: Type<TValue> | Array<Type<TValue>>,
  options: IPropertyDefinitionOption<TValue> = {},
): PropertyDecorator {
  return function (target: TTarget, propertyKey: TProperty) {
    const targetConstructor = target.constructor as Type;
    if (!modelPropertyTypes.has(targetConstructor)) modelPropertyTypes.set(targetConstructor, {});
    modelPropertyTypes.get(targetConstructor)[propertyKey] = Object.assign({ type }, options);
  };
}
