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
    describe('defaultValue', () => {
      it('default value should be returned for unknown shallow path without create', () => {
        const model = {};
        const value = findByPath(model, 'sub', { defaultValue: { test: 'value' } });
        expect(value).toEqual({ test: 'value' });
        expect(model).toEqual({});
      });

      it('default value should be returned for unknown shallow path with create', () => {
        const model = {};
        const value = findByPath(model, 'sub', { create: true, defaultValue: { test: 'value' } });
        expect(value).toEqual({ test: 'value' });
        expect(model).toEqual({ sub: { test: 'value' } });
      });

      it('default value should be returned for unknown deep path without create', () => {
        const model = {};
        const value = findByPath(model, 'sub.path', { defaultValue: { test: 'value' } });
        expect(value).toEqual({ test: 'value' });
        expect(model).toEqual({});
      });

      it('default value should be returned for unknown deep path with create', () => {
        const model = {};
        const value = findByPath(model, 'sub.path', {
          create: true,
          defaultValue: { test: 'value' },
        });
        expect(value).toEqual({ test: 'value' });
        expect(model).toEqual({ sub: { path: { test: 'value' } } });
      });
    });
    describe('with create', () => {
      it('create on undefined model', () => {
        const value = findByPath(undefined, 'sub', { returnParent: true, create: true });
        expect(value).toEqual({ sub: {} });
      });

      it('create without sub path', () => {
        const model = {};
        const value = findByPath(model, 'sub', { create: true });
        expect(value).toEqual({});
        expect(model).toEqual({ sub: {} });
      });

      it('create on sub', () => {
        const model = {};
        const value = findByPath(model, 'sub.sub.field', { create: true });
        expect(value).toEqual({});
        expect(model).toEqual({ sub: { sub: { field: {} } } });
      });

      it('create on sub with default', () => {
        const model = {};
        const value = findByPath(model, 'sub.sub.field', { create: true, defaultValue: [] });
        expect(value).toEqual([]);
        expect(model).toEqual({ sub: { sub: { field: [] } } });
      });
    });

    it('find sub field', () => {
      const model = { sub: { sub: { field: 'value' } } };
      const value = findByPath(model, 'sub.sub.field');
      expect(value).toEqual('value');
    });

    it('find parent of field', () => {
      const model = { sub: { sub: { field: 'value' } } };
      const value = findByPath<{ field: string }>(model, 'sub.sub.field', { returnParent: true });
      expect(value!.field).toEqual('value');
    });

    it('find by root path', () => {
      const model = { sub: { sub: { field: 'value' } } };
      const value = findByPath<{ sub: { field: string } }>(model, 'sub');
      expect(value!.sub!.field).toEqual('value');
    });

    it('find root by root path', () => {
      const model = { sub: { sub: { field: 'value' } } };
      const value = findByPath(model, 'sub', { returnParent: true });
      expect(value === model);
    });

    it('create unknown path', () => {
      const model = <any>{};
      const value = findByPath(model, 'sub.sub', { create: true });
      expect(model.sub.sub).toBeDefined();
      expect(value === model.sub.sub).toEqual(true);
    });

    it('create path starting with reserved character', () => {
      const model = <any>{};
      findByPath(model, 'sub.$.whatever', { create: true });
      expect(model.sub).toBeDefined();
      expect(model.sub.$).toBeUndefined();
    });

    it('create path starting with reserved character', () => {
      const model = <any>{};
      findByPath(model, 'sub.1.whatever', { create: true });
      expect(model.sub).toBeDefined();
      expect(model.sub['1']).toBeUndefined();
    });
  });
});
