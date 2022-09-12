
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

  Object.keys(data).forEach(key => {
    if(!Array.isArray(model) && (strict && !model.hasOwnProperty(key))) {
      return;
    }

    const transformed = (transform) ? transform(data[key], key) : undefined;

    if(transformed !== undefined) {
      model[key] = transformed;
    } else if(Array.isArray(data[key])) {
      model[key] = _assignRawDataTo([], data[key], level + 1, {maxDepth, strict, transform});
    } else if(isObjectId(data[key])) {
      // Todo: We can not clone an ObjectId by Object.create, maybe implement another clone method in the future.
      model[key] = data[key];
    } else if(typeof data[key] === 'object' && !(data[key] instanceof Date)) {
      if(!model[key]) {
        model[key] = Object.create(data[key].constructor.prototype);
      } else if(model[key].constructor !== data[key].constructor) {
        model[key] = Object.assign(Object.create(getSpecificConstructor(model[key], data[key]).prototype), model[key]);
      }
      model[key] = _assignRawDataTo(model[key], data[key], level + 1, { maxDepth, strict, transform });
    } else if(typeof data[key] !== 'function') {
      model[key] = data[key];
    }
  });

  return model;
}

function getSpecificConstructor(a: any, b: any) {
  return (a.constructor === Object.constructor) ? b.constructor : a.constructor
}

export function isObjectId(value: any) {
  return value && typeof value === 'object' && value._bsontype && value._bsontype === "ObjectID";
}
