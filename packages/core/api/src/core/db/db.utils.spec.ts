import { applyInc, applyPush } from './db.utils';

class SubModel {
  public fieldA?: string;
  public fieldB?: number;
  public sub?: SubModel;

  constructor(obj: Partial<SubModel>) {
    Object.assign(this, obj);
  }
}
class TestModel {
  public sub?: SubModel;
  public value?: any;
  public arr?: string[];

  constructor(obj: Partial<TestModel>) {
    Object.assign(this, obj);
  }
}

describe('DbUtils', () => {
  describe('applyInc', function () {
    it('apply root path inc', () => {
      const model = { field: 0 };
      applyInc(model, { field: 1 });
      expect(model.field).toEqual(1);
    });

    it('apply sub path inc', () => {
      const model = { sub: { sub: { field: 0 } } };
      applyInc(model, { 'sub.sub.field': 1 });
      expect(model.sub.sub.field).toEqual(1);
    });

    it('apply multiple sub path inc', () => {
      const model = { sub: { sub: { field1: 0, field2: 0 } } };
      applyInc(model, { 'sub.sub.field1': 1, 'sub.sub.field2': 1 });
      expect(model.sub.sub.field1).toEqual(1);
      expect(model.sub.sub.field2).toEqual(1);
    });

    it('apply negative sub path inc', () => {
      const model = { sub: { sub: { field: 0 } } };
      applyInc(model, { 'sub.sub.field': -1 });
      expect(model.sub.sub.field).toEqual(-1);
    });

    it('apply invalid inc path', () => {
      const model = { sub: { sub: { field: 0 } } };
      applyInc(model, { 'sub.sub.field.': 1 });
      expect(model.sub.sub.field).toEqual(0);
    });
  });

  describe('applyPush', function () {
    it('push single value', () => {
      const model = new TestModel({ arr: ['a', 'b'] });
      applyPush(model, { arr: 'c' });
      expect(model.arr?.length).toEqual(3);
      expect(model.arr?.[0]).toEqual('a');
      expect(model.arr?.[1]).toEqual('b');
      expect(model.arr?.[2]).toEqual('c');
    });

    it('push with $each', () => {
      const model = new TestModel({ arr: ['a'] });
      applyPush(model, { arr: { $each: ['b', 'c'] } });
      expect(model.arr?.length).toEqual(3);
      expect(model.arr?.[0]).toEqual('a');
      expect(model.arr?.[1]).toEqual('b');
      expect(model.arr?.[2]).toEqual('c');
    });

    it('push on undefined array field', () => {
      const model = new TestModel({});
      applyPush(model, { arr: { $each: ['a', 'b', 'c'] } });
      expect(model.arr?.length).toEqual(3);
      expect(model.arr?.[0]).toEqual('a');
      expect(model.arr?.[1]).toEqual('b');
      expect(model.arr?.[2]).toEqual('c');
    });

    it('push to sub path', () => {
      const model = { sub: { arr: ['a', 'b'] } };
      applyPush(model, { 'sub.arr': 'c' });
      expect(model.sub.arr?.length).toEqual(3);
      expect(model.sub.arr?.[0]).toEqual('a');
      expect(model.sub.arr?.[1]).toEqual('b');
      expect(model.sub.arr?.[2]).toEqual('c');
    });
  });
});
