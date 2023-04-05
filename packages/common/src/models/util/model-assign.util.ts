import { findByPath, isObjectId, Type } from '@/utils';
import { initPropertyTypes } from './model-property-type.util';
import { getPropertyTypeDefinition } from '../decorators';
import { isBoolean, isDefined, isNumber, isString } from 'class-validator';

type WithTransformation = ((any, string) => undefined | any) | undefined;
interface IAssignOptions {
  maxDepth?: number;
  strict?: boolean;
  transform?: WithTransformation;
}

export function createAndAssign<T, C extends Type<T> = Type<T>>(
  type: C,
  data?: { [key in keyof T]?: any } & any,
  options: IAssignOptions = {},
) {
  return assignRawDataToAndInitProps(Object.create(type.prototype), data, options);
}

export function assignRawDataToAndInitProps<T>(
  model: T,
  data?: { [key in keyof T]?: any } & any,
  options: IAssignOptions = {},
) {
  assignRawDataTo(model, data, options);
  initPropertyTypes(model);
  return model;
}

export function assignRawDataTo<T>(
  model: T,
  data: { [key in keyof T]?: any } & any,
  { maxDepth = 100, strict = false, transform = undefined as WithTransformation } = {},
): T {
  return _assignRawDataTo(model, data, 0, { maxDepth, strict, transform });
}

const BLACKLISTED_PATH = ['__proto__', 'prototype', 'constructor'];

function _assignRawDataTo<T>(
  model: T,
  data: { [key in keyof T]?: any } & any,
  level = 0,
  { maxDepth = 100, strict = false, transform = undefined as WithTransformation } = {},
): T {
  if (!data || level > maxDepth) {
    return model;
  }

  Object.keys(data).forEach((path) => {
    if (path.includes('.')) {
      const subPathRoot = findByPath(model, path, true, !strict);
      if (subPathRoot) {
        const field = path.slice(path.lastIndexOf('.') + 1);
        if (field.startsWith('$')) return;
        _assignRawDataTo(subPathRoot, { [field]: data[path] });
      }
      return;
    }

    if (BLACKLISTED_PATH.includes(path)) return;
    if (!Array.isArray(model) && strict && !model.hasOwnProperty(path)) return;

    const transformed = transform ? transform(data[path], path) : undefined;

    if (transformed !== undefined) {
      model[path] = transformed;
    } else if (Array.isArray(data[path])) {
      let arrayData = data[path];
      const arrayType = getPropertyTypeDefinition(model.constructor as Type, path)?.type;
      if (arrayType && Array.isArray(arrayType) && arrayType.length) {
        arrayData = data[path].map((entry) => _transformType(entry, arrayType[0]));
      }
      model[path] = _assignRawDataTo([], arrayData, level + 1, { maxDepth, strict, transform });
    } else if (isObjectId(data[path])) {
      // Todo: We can not clone an ObjectId by Object.create, maybe implement another clone method in the future.
      model[path] = data[path];
    } else if (data[path] && typeof data[path] === 'object' && !(data[path] instanceof Date)) {
      // Try to get model type by ModelType decorator, or otherwise try to determine the type from model or data
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
        model[path] = null; // We do not want to convert objects to primitives
      } else {
        model[path] = _assignRawDataTo(
          Object.assign(Object.create(propertyType.prototype), model[path]),
          data[path],
          level + 1,
          { maxDepth, strict, transform },
        );
      }

      if (
        model[path] &&
        typeof model[path] === 'object' &&
        'afterInit' in model[path] &&
        typeof model[path]['afterInit'] === 'function'
      ) {
        model[path].afterInit();
      }
    } else if (typeof data[path] !== 'function') {
      const propertyTypeDefinition = getPropertyTypeDefinition(model.constructor as Type, path);
      const propertyType = propertyTypeDefinition?.type;
      if (typeof data[path] === 'string' && propertyType === Date) {
        try {
          model[path] = new Date(data[path]);
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
const PRIMITIVE_TYPES_WITH_TOSTRING = ['number', 'boolean', 'bigint', 'symbol'];

function _isPrimitiveType(type: any) {
  return PRIMITIVE_TYPES.includes(type);
}

function _transformType(value: any, type: any) {
  if (value === undefined || value === null || _isOfType(value, type)) return value;
  if (type === null || type === undefined) return type;
  if (_isPrimitiveType(type)) {
    if (type === String) {
      return PRIMITIVE_TYPES_WITH_TOSTRING.includes(typeof value) ? value.toString() : null;
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

  return Object.assign(Object.create(type.prototype), value);
}

function getSpecificConstructor(a: any, b: any) {
  return a.constructor === Object.constructor ? b.constructor : a.constructor;
}
