import { getPropertyTypeDefinition, getPropertyTypeDefinitions } from "../model";
import { Type } from "../util";

type WithTransformation = ((any, string) => undefined|any)|undefined;
interface AssignOptions {
  maxDepth?: number,
  strict?: boolean,
  transform?: WithTransformation
}

interface InitPropertiesOptions {
  maxDepth?: number,
}

export function assignRawDataToAndInitProps<T>(model: T, data?: { [ key in keyof T ]?: any } & any, options: AssignOptions = {}) {
  assignRawDataTo(model, data, options);
  initPropertyTypes(model);
}

export function initPropertyTypes<T>(model: T, options: InitPropertiesOptions = {}) {
  return _initPropertyTypes<T>(model, 0, options)
}

const primitivePrototypes = [
  String.prototype,
  Number.prototype,
  Boolean.prototype,
  Symbol.prototype,
  Array.prototype,
];

const primitiveDefaults = new Map();
primitiveDefaults.set(String, '');
primitiveDefaults.set(Number, 0);
primitiveDefaults.set(Boolean, false);
primitiveDefaults.set(Symbol, null);
primitiveDefaults.set(Array, []);

function _initPropertyTypes<T>(model: T, level = 0, { maxDepth = 100 } = {} ) {
  if(level > maxDepth) {
    return model;
  }

  if(model && typeof model === 'object') {
    const propertyDefinitions = getPropertyTypeDefinitions(model.constructor as Type);
    Object.keys(propertyDefinitions).forEach(propertyKey => {
      const propertyDefinition = propertyDefinitions[propertyKey];
      // Instantiate empty non optional properties or if the type does not match the configured type
      if((!model[propertyKey] && !propertyDefinition.optional)) {
        if(propertyDefinition.default) {
          model[propertyKey] = typeof propertyDefinition.default === 'function' ? propertyDefinition.default() : propertyDefinition.default;
        } else if(!primitivePrototypes.includes(propertyDefinition.type.prototype)) {
          model[propertyKey] = Object.assign(Object.create(propertyDefinition.type.prototype), model[propertyKey]);
          if(!propertyDefinition.default && 'afterInit' in model[propertyKey] && typeof model[propertyKey]['afterInit'] === 'function') {
            model[propertyKey].afterInit();
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

export function assignRawDataTo<T>(model: T, data: { [ key in keyof T ]?: any } & any,
                             { maxDepth = 100, strict = false, transform = undefined as WithTransformation } = {}): T {
  return _assignRawDataTo(model, data, 0, {  maxDepth, strict, transform });
}

function _assignRawDataTo<T>(model: T, data: { [ key in keyof T ]?: any } & any, level = 0,
                                   { maxDepth = 100, strict = false, transform = undefined as WithTransformation } = {}): T {
  if(!data || level > maxDepth) {
    return model;
  }

  Object.keys(data).forEach(path => {
    if(path.includes('.')) {
      const subPathRoot = findByPath(model, path, true, !strict);
      if(subPathRoot) {
        const field = path.slice(path.lastIndexOf(".") + 1);
        _assignRawDataTo(subPathRoot, { [field]: data[path]});
      }
      return;
    }

    if(!Array.isArray(model) && (strict && !model.hasOwnProperty(path))) {
      return;
    }

    const transformed = (transform) ? transform(data[path], path) : undefined;

    if(transformed !== undefined) {
      model[path] = transformed;
    } else if(Array.isArray(data[path])) {
      let arrayData = data[path];
      const arrayType = getPropertyTypeDefinition(model.constructor as Type, path)?.type;
      if(arrayType && Array.isArray(arrayType) && arrayType.length) {
        arrayData = data[path].map(entry => entry instanceof arrayType[0] ? entry : Object.assign(Object.create(arrayType[0].prototype), entry))
      }
      model[path] = _assignRawDataTo([], arrayData, level + 1, {maxDepth, strict, transform});
    } else if(isObjectId(data[path])) {
      // Todo: We can not clone an ObjectId by Object.create, maybe implement another clone method in the future.
      model[path] = data[path];
    } else if(data[path] && typeof data[path] === 'object' && !(data[path] instanceof Date)) {
      // Try to get model type by ModelType decorator, or otherwise try to determine the type from model or data
      let modelType = getPropertyTypeDefinition(model.constructor as Type, path)?.type;
      if(!modelType) {
        modelType = !model[path] ? data[path].constructor : getSpecificConstructor(model[path], data[path]);
      }

      model[path] = _assignRawDataTo(
        Object.assign(Object.create(modelType.prototype), model[path]),
        data[path],
        level + 1,
        { maxDepth, strict, transform });

      if('afterInit' in model[path] && typeof model[path]['afterInit'] === 'function') {
        model[path].afterInit();
      }
    } else if(typeof data[path] !== 'function') {
      model[path] = data[path];
    }
  });

  return model;
}

export function findByPath<T>(model: T, path: string, parent = false, create = true) {
  if(!path.includes('.')) {
    return parent ? model : model[path];
  }

  path = parent ? path.replace(/\.[^/.]+$/, "") : path;

  let result = model;
  const subPaths = path.split('.');
  subPaths.forEach((sub, index) => {
    if(sub && sub.length && sub.charAt(0) === '$' || /^[0-9]+$/.test(sub)) {
      // we do not support mongodb special cases e.g. array etc.
      result = undefined;
    } else if(result && !result[sub] && create && index !== subPaths.length) {
      result[sub] = {};
    }
    result = result && result[sub] ? result[sub] : undefined
  });
  return result;
}

function getSpecificConstructor(a: any, b: any) {
  return (a.constructor === Object.constructor) ? b.constructor : a.constructor
}

export function isObjectId(value: any) {
  return value && typeof value === 'object' && value._bsontype && value._bsontype === "ObjectID";
}

export function getPrototypeTree(type: Type): Array<Type> {
  const prototypeTree = [type];

  for(let curr = Object.getPrototypeOf(type.prototype); curr && curr !== Object.prototype; curr = Object.getPrototypeOf(curr)) {
    prototypeTree.push(curr.constructor)
    curr = Object.getPrototypeOf(curr);
  }

  return prototypeTree;
}
