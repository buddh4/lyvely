import { Type } from '../../utils/util.types';
import { getPropertyTypeDefinitions } from '../decorators';

interface InitPropertiesOptionsIF {
  maxDepth?: number;
}

const primitivePrototypes = [
  String.prototype,
  Number.prototype,
  Boolean.prototype,
  BigInt.prototype,
  Symbol.prototype,
];

const primitiveDefaults = new Map();
primitiveDefaults.set(String, '');
primitiveDefaults.set(Number, 0);
primitiveDefaults.set(Boolean, false);
primitiveDefaults.set(Symbol, null);

export function initPropertyTypes<T>(model: T, options: InitPropertiesOptionsIF = {}) {
  return _initPropertyTypes<T>(model, 0, options);
}

function _initPropertyTypes<T>(model: T, level = 0, { maxDepth = 100 } = {}) {
  if (level > maxDepth) {
    return model;
  }

  if (model && typeof model === 'object') {
    const propertyDefinitions = getPropertyTypeDefinitions(model.constructor as Type);
    Object.keys(propertyDefinitions).forEach((key) => {
      const propertyKey = key as keyof T & string;
      const propertyDefinition = propertyDefinitions[propertyKey];
      // Instantiate empty non optional properties or if the type does not match the configured type
      if (!model[propertyKey] && !propertyDefinition.optional) {
        if (propertyDefinition.default) {
          model[propertyKey] =
            typeof propertyDefinition.default === 'function'
              ? propertyDefinition.default()
              : propertyDefinition.default;
        } else if (!propertyDefinition.type) {
          model[propertyKey] = propertyDefinition.type; //null, undefined etc
        } else if (Array.isArray(propertyDefinition.type)) {
          model[propertyKey] = [] as any;
        } else if (propertyDefinition.type === Date) {
          model[propertyKey] = new Date() as any;
        } else if (!primitivePrototypes.includes(propertyDefinition.type.prototype)) {
          model[propertyKey] = Object.assign(
            Object.create(propertyDefinition.type.prototype),
            model[propertyKey],
          );
          if (
            !propertyDefinition.default &&
            'afterInit' in (<any>model)[propertyKey] &&
            typeof (<any>model)[propertyKey]['afterInit'] === 'function'
          ) {
            (<any>model)[propertyKey].afterInit();
          }
        } else {
          model[propertyKey] = primitiveDefaults.get(propertyDefinition.type);
        }
      }
      _initPropertyTypes(model[propertyKey], level + 1, { maxDepth });
    });
  }

  return model;
}
