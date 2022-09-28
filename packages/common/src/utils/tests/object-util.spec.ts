import { findByPath } from '@/utils';
import { expect } from '@jest/globals';

describe('object util', () => {
  describe('findByPath', function () {
    it('find sub field', () => {
      const model = { sub: { sub: { field: 'value' } } };
      const value = findByPath(model, 'sub.sub.field');
      expect(value).toEqual('value');
    });

    it('find parent of field', () => {
      const model = { sub: { sub: { field: 'value' } } };
      const value = findByPath(model, 'sub.sub.field', true);
      expect(value.field).toEqual('value');
    });

    it('find by root path', () => {
      const model = { sub: { sub: { field: 'value' } } };
      const value = findByPath(model, 'sub');
      expect(value.sub.field).toEqual('value');
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
