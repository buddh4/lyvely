import { applyInc, applyPush, applyRawDataTo, findByPath } from "../../db/db.utils";
import { expect } from '@jest/globals';

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
  describe('applyRawDataTo', function () {
    it('top level field is applied', () => {
      const model = new TestModel({ value: 'TestValue' });
      applyRawDataTo(model, { value: 'NewTestValue' });
      expect(model.value).toEqual('NewTestValue');
    });

    it('apply array values', () => {
      const model = new TestModel({ arr: ['a', 'b'] });
      applyRawDataTo(model, { arr: ['c', 'd', 'e'] });
      expect(model.arr).toEqual( ['c', 'd', 'e']);
    });

    it('sub level field is applied', () => {
      const model = new TestModel({ sub: new SubModel({ fieldA: 'a' }) });
      applyRawDataTo(model, { sub: { fieldA: 'NewA' } });
      expect(model.sub.fieldA).toEqual('NewA');
      expect(model.sub instanceof SubModel).toEqual(true);
    });

    it('sub level2 field is applied', () => {
      const model = new TestModel({ sub: new SubModel({ sub: new SubModel({ fieldA: 'subA' }) }) });
      applyRawDataTo(model, { sub: { sub: { fieldA: 'newSubA' } } });
      expect(model.sub.sub.fieldA).toEqual('newSubA');
      expect(model.sub.sub instanceof SubModel).toEqual(true);
    });

    it('do not apply unknown field if strict = true', () => {
      const model = new TestModel({ sub: new SubModel({ sub: new SubModel({ fieldA: 'subA' }) }) });
      applyRawDataTo(model, <any> { doesNotExist: 'whatever' }, { strict: true });
      expect((<any> model).doesNotExist).toBeUndefined();
    });
  });

  describe('applyInc', function () {
    it('apply root path inc', () => {
      const model = { field: 0 };
      applyInc(model, { 'field': 1 });
      expect(model.field).toEqual(1);
    });

    it('apply sub path inc', () => {
      const model = { sub: { sub: { field: 0 }} };
      applyInc(model, { 'sub.sub.field': 1 });
      expect(model.sub.sub.field).toEqual(1);
    });

    it('apply negative sub path inc', () => {
      const model = { sub: { sub: { field: 0 }} };
      applyInc(model, { 'sub.sub.field': -1 });
      expect(model.sub.sub.field).toEqual(-1);
    });

    it('apply invalid inc path', () => {
      const model = { sub: { sub: { field: 0 }} };
      applyInc(model, { 'sub.sub.field.': 1 });
      expect(model.sub.sub.field).toEqual(0);
    });
  });

  describe('applyPush', function () {
    it('push single value', () => {
      const model = new TestModel({ arr: ['a', 'b'] });
      applyPush(model, { arr: 'c' });
      expect(model.arr.length).toEqual(3);
      expect(model.arr[0]).toEqual('a');
      expect(model.arr[1]).toEqual('b');
      expect(model.arr[2]).toEqual('c');
    });

    it('push with $each', () => {
      const model = new TestModel({ arr: ['a'] });
      applyPush(model, { arr: { $each: ['b', 'c'] } });
      expect(model.arr.length).toEqual(3);
      expect(model.arr[0]).toEqual('a');
      expect(model.arr[1]).toEqual('b');
      expect(model.arr[2]).toEqual('c');
    });

    it('push on undefined array field', () => {
      const model = new TestModel({});
      applyPush(model, { arr: { $each: ['a', 'b', 'c'] } });
      expect(model.arr.length).toEqual(3);
      expect(model.arr[0]).toEqual('a');
      expect(model.arr[1]).toEqual('b');
      expect(model.arr[2]).toEqual('c');
    });
  });
});
