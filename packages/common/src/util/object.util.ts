
type WithTransformation = ((any, string) => undefined|any)|undefined;

export function assignRawDataTo<T>(model: T, data: { [ key in keyof T ]?: any } & any,
                             { maxDepth = 100, strict = false, transform = undefined as WithTransformation } = {}): T {
  return _assignRawDataTo(model, data, 0, {  maxDepth, strict, transform });
}

function _assignRawDataTo<T>(model: T, data: { [ key in keyof T ]?: any } & any, level = 0,
                                   { maxDepth = 100, strict = false, transform = undefined as WithTransformation } = {}): T {
  if(level > maxDepth) {
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
      model[path] = _assignRawDataTo([], data[path], level + 1, {maxDepth, strict, transform});
    } else if(isObjectId(data[path])) {
      // Todo: We can not clone an ObjectId by Object.create, maybe implement another clone method in the future.
      model[path] = data[path];
    } else if(typeof data[path] === 'object' && !(data[path] instanceof Date)) {
      if(!model[path]) {
        model[path] = Object.create(data[path].constructor.prototype);
      } else if(model[path].constructor !== data[path].constructor) {
        model[path] = Object.assign(Object.create(getSpecificConstructor(model[path], data[path]).prototype), model[path]);
      }
      model[path] = _assignRawDataTo(model[path], data[path], level + 1, { maxDepth, strict, transform });
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
