import { assignRawDataTo } from './index';

class TestClass {
  constructor(public field: string, public sub?: TestClass) {}
}

describe('model assign util', () => {
  describe('assignRawDataTo()', function () {
    it('simple string field assign', async () => {
      const model = {} as any;
      const result = assignRawDataTo(model, { test: 'test' });
      expect(model).toEqual(result);
      expect(model.test).toEqual('test');
    });

    it('do not assign function', async () => {
      const model = {} as any;
      assignRawDataTo(model, { testFunc: () => 'test' });
      expect(model.testFunc).toBeUndefined();
    });

    it('assign by reference if the right type is provided', async () => {
      const model = {} as any;
      const obj = { test: new TestClass('testValue') };
      assignRawDataTo(model, obj);
      expect(model.test).toBeDefined();
      expect(model.test.field).toEqual('testValue');
      expect(model.test instanceof TestClass).toEqual(true);
      expect(model.test === obj.test).toEqual(true);
    });

    it('assign constructor of deep field', async () => {
      const model = {} as any;
      assignRawDataTo(model, { test: new TestClass('testValue', new TestClass('testValue2')) });
      expect(model.test).toBeDefined();
      expect(model.test.sub).toBeDefined();
      expect(model.test.sub.field).toEqual('testValue2');
      expect(model.test.sub instanceof TestClass).toEqual(true);
    });

    it('do not assign unknown field if strict = true', async () => {
      const model = { exists: 'oldValue' } as any;
      assignRawDataTo(model, { exists: 'newValue', doesNotExist: 'value' }, { strict: true });
      expect(model.exists).toEqual('newValue');
      expect(model.doesNotExist).toBeUndefined();
    });

    it('assign array value', async () => {
      const obj = { arr: ['v1', 'v2'] };
      const result = <any>assignRawDataTo({}, { arr: ['v1', 'v2'] });
      expect(result.arr).toBeDefined();
      expect(Array.isArray(result.arr)).toEqual(true);
      expect(result.arr.length).toEqual(2);
      expect(result.arr[0]).toEqual('v1');
      expect(result.arr[1]).toEqual('v2');
      expect(obj.arr !== result.arr).toEqual(true);
    });

    it('assign array value', async () => {
      const obj = { arr: [new TestClass('testValue')] };
      const result = <any>assignRawDataTo({}, obj);
      expect(result?.arr[0].field).toEqual('testValue');
      expect(result.arr[0] instanceof TestClass).toEqual(true);
      expect(result.arr[0] === obj.arr[0]).toEqual(true);
    });

    it('assign with path', async () => {
      const update = { rootValue: 'updated', 'sub.sub.value': 'value' };
      const obj = { rootValue: 'test', sub: { sub: { value: 'test' } } };
      assignRawDataTo(obj, update);
      expect(obj.rootValue).toEqual('updated');
      expect(obj.sub.sub.value).toEqual('value');
    });
  });
});
