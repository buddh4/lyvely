import { findByPath, hasOwnNonNullableProperty, isPlainObject } from './object.util';

describe('object util', () => {
  describe('isPlainObject', function () {
    it('empty object is plain object', () => {
      expect(isPlainObject({})).toEqual(true);
    });
    it('null Object is considered an object', () => {
      expect(isPlainObject(Object.create(null))).toEqual(true);
    });
    it('empty object is plain object', () => {
      expect(isPlainObject({ field: 'string' })).toEqual(true);
    });
    it('null is not plain object', () => {
      expect(isPlainObject(null)).toEqual(false);
    });
    it('undefined is not plain object', () => {
      expect(isPlainObject(undefined)).toEqual(false);
    });
    it('number is not plain object', () => {
      expect(isPlainObject(2)).toEqual(false);
    });
    it('symbol is not plain object', () => {
      expect(isPlainObject(Symbol())).toEqual(false);
    });
    it('string is not plain object', () => {
      expect(isPlainObject('Test')).toEqual(false);
    });
    it('array is not plain object', () => {
      expect(isPlainObject([])).toEqual(false);
    });
    it('map is not plain object', () => {
      expect(isPlainObject(new Map())).toEqual(false);
    });
    it('date is not plain object', () => {
      expect(isPlainObject(new Date())).toEqual(false);
    });
  });

  describe('hasOwnNonNullableProperty', function () {
    it('property exists', () => {
      expect(hasOwnNonNullableProperty({ field: 'test' }, 'field')).toEqual(true);
    });
    it('property does not exists', () => {
      expect(hasOwnNonNullableProperty({ field: 'test' }, 'anotherField')).toEqual(false);
    });
    it('property is null', () => {
      expect(hasOwnNonNullableProperty({ field: null }, 'field')).toEqual(false);
    });
    it('property is undefined', () => {
      expect(hasOwnNonNullableProperty({ field: undefined }, 'field')).toEqual(false);
    });
    it('null value', () => {
      expect(hasOwnNonNullableProperty(null, 'field')).toEqual(false);
    });
    it('undefined value', () => {
      expect(hasOwnNonNullableProperty(undefined, 'field')).toEqual(false);
    });
  });

  describe('findByPath', function () {
    it('find sub field', () => {
      const model = { sub: { sub: { field: 'value' } } };
      const value = findByPath(model, 'sub.sub.field');
      expect(value).toEqual('value');
    });

    it('find parent of field', () => {
      const model = { sub: { sub: { field: 'value' } } };
      const value = findByPath<{ field: string }>(model, 'sub.sub.field', true);
      expect(value!.field).toEqual('value');
    });

    it('find by root path', () => {
      const model = { sub: { sub: { field: 'value' } } };
      const value = findByPath<{ sub: { field: string } }>(model, 'sub');
      expect(value!.sub!.field).toEqual('value');
    });

    it('find root by root path', () => {
      const model = { sub: { sub: { field: 'value' } } };
      const value = findByPath(model, 'sub', true);
      expect(value === model);
    });

    it('create unknown path', () => {
      const model = <any>{};
      const value = findByPath(model, 'sub.sub');
      expect(model.sub.sub).toBeDefined();
      expect(value === model.sub.sub).toEqual(true);
    });

    it('create path starting with reserved character', () => {
      const model = <any>{};
      findByPath(model, 'sub.$.whatever');
      expect(model.sub).toBeDefined();
      expect(model.sub.$).toBeUndefined();
    });

    it('create path starting with reserved character', () => {
      const model = <any>{};
      findByPath(model, 'sub.1.whatever');
      expect(model.sub).toBeDefined();
      expect(model.sub['1']).toBeUndefined();
    });
  });
});
