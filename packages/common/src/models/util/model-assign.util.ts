import { findByPath, isObjectId, Type } from '@/utils';
import { initPropertyTypes } from './model-property-type.util';
import { getPropertyTypeDefinition } from '../decorators';

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

    if (!Array.isArray(model) && strict && !model.hasOwnProperty(path)) {
      return;
    }

    const transformed = transform ? transform(data[path], path) : undefined;

    if (transformed !== undefined) {
      model[path] = transformed;
    } else if (Array.isArray(data[path])) {
      let arrayData = data[path];
      const arrayType = getPropertyTypeDefinition(model.constructor as Type, path)?.type;
      if (arrayType && Array.isArray(arrayType) && arrayType.length) {
        arrayData = data[path].map((entry) =>
          entry instanceof arrayType[0]
            ? entry
            : Object.assign(Object.create(arrayType[0].prototype), entry),
        );
      }
      model[path] = _assignRawDataTo([], arrayData, level + 1, { maxDepth, strict, transform });
    } else if (isObjectId(data[path])) {
      // Todo: We can not clone an ObjectId by Object.create, maybe implement another clone method in the future.
      model[path] = data[path];
    } else if (data[path] && typeof data[path] === 'object' && !(data[path] instanceof Date)) {
      // Try to get model type by ModelType decorator, or otherwise try to determine the type from model or data
      let propertyType = getPropertyTypeDefinition(model.constructor as Type, path)?.type;
      if (!propertyType) {
        propertyType = !model[path]
          ? data[path].constructor
          : getSpecificConstructor(model[path], data[path]);
      }

      // Only create a new instance if the type is not the expected, otherwise just use the given value
      if (data[path] instanceof propertyType) {
        model[path] = data[path];
      } else {
        model[path] = _assignRawDataTo(
          Object.assign(Object.create(propertyType.prototype), model[path]),
          data[path],
          level + 1,
          { maxDepth, strict, transform },
        );
      }

      if ('afterInit' in model[path] && typeof model[path]['afterInit'] === 'function') {
        model[path].afterInit();
      }
    } else if (typeof data[path] !== 'function') {
      const propertyType = getPropertyTypeDefinition(model.constructor as Type, path)?.type;
      if (typeof data[path] === 'string' && propertyType === Date) {
        try {
          model[path] = new Date(data[path]);
        } catch (err) {
          console.warn(err, 'Tried to assign invalid string date to model property');
          model[path] = data[path];
        }
      } else {
        model[path] = data[path];
      }
    }
  });

  return model;
}

function getSpecificConstructor(a: any, b: any) {
  return a.constructor === Object.constructor ? b.constructor : a.constructor;
}
