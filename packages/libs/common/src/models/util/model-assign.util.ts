import { findByPath, isBlacklistedProperty, isObjectId, isPlainObject, Type } from '../../utils';
import { initPropertyTypes } from './model-property-type.util';
import { getPropertyTypeDefinition } from '../decorators';
import { implementsAfterInit, implementsGetDefaults } from './model-interfaces.helper';

type WithTransformation = ((model: any, field: string) => undefined | any) | undefined;

export interface InitModelDataOptions {
  maxDepth?: number;
  strict?: boolean;
  skipGetDefaults?: boolean;
  skipAfterInit?: boolean;
  skipInitProps?: boolean;
  transform?: WithTransformation;
}

export function createBaseModelAndInit<T, C extends Type<T> = Type<T>>(
  type: C,
  data?: { [key in keyof T]?: any } & any,
  options: InitModelDataOptions = {},
) {
  return initBaseModelData(Object.create(type.prototype), data, options);
}

export function initBaseModelData<T extends Object>(
  model: T,
  data?: { [key in keyof T]?: any } & any,
  options: InitModelDataOptions = {},
) {
  return _initBaseModelData(model, data, 0, options);
}

export function assignRawDataTo<T extends Object>(
  model: T,
  data: { [key in keyof T]?: any } & any,
  options?: InitModelDataOptions,
): T {
  return _initBaseModelData(model, data, 0, {
    ...options,
    skipInitProps: true,
    skipGetDefaults: true,
    skipAfterInit: true,
  });
}

function _initBaseModelData<T extends object>(
  model: T,
  data: { [key in keyof T]?: any } & any,
  level = 0,
  options?: InitModelDataOptions,
): T {
  options = {
    maxDepth: 100,
    transform: undefined as WithTransformation,
    ...options,
  } as InitModelDataOptions;

  const { maxDepth, transform, skipGetDefaults, skipInitProps, skipAfterInit, strict } = options;

  if (!skipGetDefaults && implementsGetDefaults(model)) {
    data = data ? Object.assign(model.getDefaults(), data) : model.getDefaults();
  }

  if (!data || level > maxDepth!) {
    initPropertyTypes(model);
    return _initModel(model, data, options);
  }

  Object.keys(data).forEach((key) => {
    const path = key as keyof T & string;
    if (path.includes('.')) {
      const subPathRoot = findByPath(model, path, { returnParent: true, create: !strict });
      if (subPathRoot) {
        const field = path.slice(path.lastIndexOf('.') + 1);
        if (field.startsWith('$')) return;
        _initBaseModelData(subPathRoot, { [field]: data[path] }, level + 1, options);
      }
      return;
    }

    if (isBlacklistedProperty(path)) return;
    if (isPlainObject(model) && strict && !Object.hasOwn(model, path)) return;

    const transformed: any = transform ? transform(data[path], path) : undefined;

    if (transformed !== undefined) {
      model[<keyof T>path] = transformed;
    } else if (Array.isArray(data[path])) {
      let arrayData = data[path];
      const arrayType = getPropertyTypeDefinition(model.constructor as Type, path)?.type;
      if (arrayType && Array.isArray(arrayType) && arrayType.length) {
        arrayData = data[path].map((entry: any) => _transformType(entry, arrayType[0], options));
      }
      model[path] = <T[keyof T & string]>_initBaseModelData([], arrayData, level + 1, options);
    } else if (isObjectId(data[path])) {
      // TODO: Handle cases in which propertyType is not String && != ObjectId
      const propertyTypeDefinition = getPropertyTypeDefinition(model.constructor as Type, path);
      const propertyType = propertyTypeDefinition?.type;
      model[path] = propertyType === String ? data[path].toString() : data[path];
    } else if (isPlainObject(data[path])) {
      // Try to get model type by PropertyType decorator, or otherwise try to determine the type from model or data
      const propertyTypeDefinition = getPropertyTypeDefinition(model.constructor as Type, path);
      let propertyType = propertyTypeDefinition?.type;
      if (!propertyTypeDefinition) {
        propertyType = !model[path]
          ? data[path].constructor
          : getSpecificConstructor(model[path], data[path]);
      }

      // Only create a new instance if the type is not the expected, otherwise just use the given value
      if (_isOfType(data[path], propertyType)) {
        model[path] = data[path];
      } else if (PRIMITIVE_TYPES.includes(propertyType)) {
        model[path] = <T[keyof T & string]>null; // We do not want to convert objects to primitives
      } else {
        model[path] = _initBaseModelData(
          Object.assign(Object.create(propertyType.prototype), model[path]),
          data[path],
          level + 1,
          options,
        );
      }
    } else if (typeof data[path] !== 'function') {
      const propertyTypeDefinition = getPropertyTypeDefinition(model.constructor as Type, path);
      const propertyType = propertyTypeDefinition?.type;
      if (typeof data[path] === 'string' && propertyType === Date) {
        try {
          (<any>model)[path] = new Date(data[path]);
        } catch (err) {
          console.warn(err, 'Tried to assign invalid string date to model property');
          model[path] = data[path];
        }
      } else {
        model[path] = propertyTypeDefinition
          ? _transformType(data[path], propertyType)
          : data[path];
      }
    }
  });

  return _initModel(model, data, options);
}

function _initModel<T extends object>(
  model: T,
  data: { [key in keyof T]?: any } & any,
  options: Pick<InitModelDataOptions, 'skipInitProps' | 'skipAfterInit'> = {},
) {
  if (isPlainObject(data) && '_id' in data && isObjectId(data._id)) {
    (<any>model).id = data._id.toString();
  }

  if (!options.skipInitProps) {
    initPropertyTypes(model);
  }

  if (!options.skipAfterInit && implementsAfterInit(model)) {
    model.afterInit();
  }

  return model;
}

function _isOfType(value: any, type: any) {
  if ([null, undefined, String, Number, Boolean, BigInt, Symbol].includes(type)) {
    if (type === null) return value === null;
    if (type === undefined) return value === undefined;
    if (type === String) return typeof value === 'string';
    if (type === Number) return typeof value === 'number';
    if (type === Boolean) return typeof value === 'boolean';
    if (type === BigInt) return typeof value === 'bigint';
    if (type === Symbol) return value === type; // Not sure how to handle this...
  }

  return value instanceof type;
}

const PRIMITIVE_TYPES = [null, undefined, String, Number, Boolean, BigInt, Symbol];
const TYPES_WITH_TOSTRING = ['number', 'boolean', 'bigint', 'symbol', 'object'];

function _isPrimitiveType(type: any) {
  return PRIMITIVE_TYPES.includes(type);
}

function _transformType(value: any, type: any, options?: InitModelDataOptions) {
  if (value === undefined || value === null || _isOfType(value, type)) return value;
  if (type === null || type === undefined) return type;
  if (_isPrimitiveType(type)) {
    if (type === String) {
      return TYPES_WITH_TOSTRING.includes(typeof value) ? value.toString() : null;
    }

    if (type === Number) {
      if (typeof value === 'string') {
        try {
          return !isNaN(<any>value) ? parseFloat(value) : null;
        } catch (e) {
          return null;
        }
      } else if (typeof value === 'bigint') return Number(value);
      else if (typeof value === 'boolean') return value ? 1 : 0;
      else return null;
    }

    if (type === Boolean) {
      return ['true', 'false', '0', '1', 1, 0].includes(value)
        ? ['true', '1', 1].includes(value)
        : null;
    }

    if (type === BigInt) {
      try {
        return BigInt(value);
      } catch (e) {
        return null;
      }
    }

    if (type === Symbol) return type;

    return null;
  }

  return createBaseModelAndInit(type, value, options);
}

function getSpecificConstructor(a: any, b: any) {
  return a.constructor === Object.constructor ? b.constructor : a.constructor;
}
