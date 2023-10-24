import { PropertyType } from './property-type.decorator';
import { BaseModel } from '../base.model';

describe('PropertyType', () => {
  it('test primitive value', async () => {
    class PlainSubModel extends BaseModel<PlainSubModel> {
      @PropertyType(String, { default: 'defaultValue' })
      value: string;
    }

    const model = new PlainSubModel();
    expect(model.value).toEqual('defaultValue');
  });

  it('test string default value', async () => {
    class PlainSubModel extends BaseModel<PlainSubModel> {
      @PropertyType(String)
      value: string;
    }

    const model = new PlainSubModel();
    expect(model.value).toEqual('');
  });

  it('test number default value', async () => {
    class PlainSubModel extends BaseModel<PlainSubModel> {
      @PropertyType(Number)
      value: number;
    }

    const model = new PlainSubModel();
    expect(model.value).toEqual(0);
  });

  it('test boolean default value', async () => {
    class PlainSubModel extends BaseModel<PlainSubModel> {
      @PropertyType(Boolean)
      value: boolean;
    }

    const model = new PlainSubModel();
    expect(model.value).toEqual(false);
  });

  it('basic constructor', async () => {
    class PlainSubModel {
      value: string;
    }

    class TestModel extends BaseModel<TestModel> {
      @PropertyType(PlainSubModel)
      sub: PlainSubModel;

      secret: 'string';
    }
    const model = new TestModel({ sub: { value: 'test' } });
    expect(model.sub instanceof PlainSubModel).toEqual(true);
  });

  it('cascading type constructor', async () => {
    class ValueModel {
      value: string;
    }

    class PlainSubModel {
      @PropertyType<PlainSubModel, 'sub'>(ValueModel)
      sub: ValueModel;
    }

    class TestModel extends BaseModel<TestModel> {
      @PropertyType(PlainSubModel)
      sub: PlainSubModel;
    }
    const model = new TestModel({ sub: { sub: { value: 'test' } } });
    expect(model.sub instanceof PlainSubModel).toEqual(true);
    expect(model.sub.sub instanceof ValueModel).toEqual(true);
  });

  it('assure afterInit is called', async () => {
    class ValueModel {
      value: string;

      afterInit() {
        this.value = this.value || 'default';
      }
    }

    class PlainSubModel {
      @PropertyType<PlainSubModel, 'sub'>(ValueModel)
      sub: ValueModel;
    }

    class TestModel extends BaseModel<TestModel> {
      @PropertyType(PlainSubModel)
      sub: PlainSubModel;
    }
    const model = new TestModel({ sub: { sub: <any>{} } });
    expect(model.sub.sub.value).toEqual('default');
  });

  it('assure optional property is not initialized by default', async () => {
    class ValueModel {
      value: string;
    }

    class TestModel extends BaseModel<TestModel> {
      @PropertyType(ValueModel, { optional: true })
      sub?: ValueModel;
    }

    const model = new TestModel();
    expect(model.sub).toBeUndefined();
  });

  it('assure non optional property is initialized by default', async () => {
    class ValueModel {
      value: string;

      afterInit() {
        this.value = this.value || 'defaultValue';
      }
    }

    class TestModel extends BaseModel<TestModel> {
      @PropertyType(ValueModel)
      sub: ValueModel;
    }

    const model = new TestModel();
    expect(model.sub).toBeDefined();
    expect(model.sub.value).toEqual('defaultValue');
  });

  it('assure afterInit is not called for existing property', async () => {
    let counter = 0;
    class ValueModel {
      afterInit() {
        counter++;
      }
    }

    class TestModel extends BaseModel<TestModel> {
      @PropertyType(ValueModel)
      sub: ValueModel;
    }

    new TestModel({ sub: new ValueModel() });
    expect(counter).toEqual(1);
  });

  it('assure empty default value is assigned', async () => {
    class ValueModel {
      constructor(public value: string) {}
    }

    class PlainSubModel {
      @PropertyType(ValueModel, {
        default: () => new ValueModel('defaultValue'),
      })
      sub: ValueModel;
    }

    class TestModel extends BaseModel<TestModel> {
      @PropertyType(PlainSubModel)
      sub: PlainSubModel;
    }

    const model = new TestModel({ sub: <any>{} });
    expect(model.sub.sub.value).toEqual('defaultValue');
  });

  it('assure properties are inherited', async () => {
    class MyModel extends BaseModel<MyModel> {
      @PropertyType(String, { default: 'Test' })
      field: string;
    }

    class SubSubModel extends MyModel {}

    const model = new SubSubModel();
    expect(model.field).toEqual('Test');
  });

  it('assure property types are overwritten by parent', async () => {
    class Parent extends BaseModel<Parent> {
      @PropertyType(String, { default: 'Parent' })
      field: string;
    }

    class SubModel extends Parent {}

    const model = new SubModel();
    expect(model.field).toEqual('Parent');
  });

  it('assure property types are overwritten by child', async () => {
    class Parent extends BaseModel<Parent> {
      @PropertyType(String, { default: 'Parent' })
      field: string;
    }

    class SubModel extends Parent {
      @PropertyType(String, { default: 'Child' })
      field: string;
    }

    const model = new SubModel();
    expect(model.field).toEqual('Child');
  });

  it('test array without default', async () => {
    class TestModel extends BaseModel<TestModel> {
      @PropertyType(String)
      arr: string[];
    }

    const model = new TestModel();
    expect(model.arr).toBeDefined();
    expect(model.arr.length).toEqual(0);
  });

  it('test string array without default', async () => {
    class TestModel extends BaseModel<TestModel> {
      @PropertyType([String])
      arr: string[];
    }

    const model = new TestModel();
    expect(model.arr).toBeDefined();
    expect(model.arr.length).toEqual(0);
  });

  it('test string array with init value', async () => {
    class TestModel extends BaseModel<TestModel> {
      @PropertyType([String])
      arr: string[];
    }

    const model = new TestModel({ arr: ['test'] });
    expect(model.arr).toBeDefined();
    expect(model.arr.length).toEqual(1);
    expect(model.arr[0]).toEqual('test');
  });

  it('test typed array', async () => {
    class SubModel {
      value: string;
    }

    class TestModel extends BaseModel<TestModel> {
      @PropertyType([SubModel])
      arr: SubModel[];
    }

    const model = new TestModel({ arr: [{ value: 'v1' }, { value: 'v2' }] });

    expect(model.arr).toBeDefined();
    expect(model.arr.length).toEqual(2);
    expect(model.arr[0].value).toEqual('v1');
    expect(model.arr[0] instanceof SubModel).toEqual(true);
    expect(model.arr[1].value).toEqual('v2');
    expect(model.arr[1] instanceof SubModel).toEqual(true);
  });

  it('test string to date conversion', async () => {
    class TestModel extends BaseModel<TestModel> {
      @PropertyType(Date)
      date: Date;
    }

    const model = new TestModel({ date: <any>'2022-07-23T15:47:51.518Z' });
    expect(model.date instanceof Date).toEqual(true);
    expect(model.date.getFullYear()).toEqual(2022);
    expect(model.date.getDate()).toEqual(23);
    expect(model.date.getMonth()).toEqual(6);
  });

  it('transform to null', async () => {
    class TestModel extends BaseModel<TestModel> {
      @PropertyType(null)
      val: null;
    }

    const model = new TestModel({ val: <any>1 });
    expect(model.val).toEqual(null);
  });

  it('transform to undefined', async () => {
    class TestModel extends BaseModel<TestModel> {
      @PropertyType(undefined)
      val: null;
    }

    const model = new TestModel({ val: <any>1 });
    expect(model.val).toEqual(undefined);
  });

  it('transform number to string', async () => {
    class TestModel extends BaseModel<TestModel> {
      @PropertyType(String)
      val: string;
    }

    const model = new TestModel({ val: <any>1 });
    expect(model.val).toEqual('1');
  });

  it('transform true to string', async () => {
    class TestModel extends BaseModel<TestModel> {
      @PropertyType(String)
      val: string;
    }

    const model = new TestModel({ val: <any>true });
    expect(model.val).toEqual('true');
  });

  it('transform false to string', async () => {
    class TestModel extends BaseModel<TestModel> {
      @PropertyType(String)
      val: string;
    }

    const model = new TestModel({ val: <any>false });
    expect(model.val).toEqual('false');
  });

  it('transform bigint to string', async () => {
    class TestModel extends BaseModel<TestModel> {
      @PropertyType(String)
      val: string;
    }

    const model = new TestModel({ val: <any>BigInt(123) });
    expect(model.val).toEqual('123');
  });

  it('transform bigint to string', async () => {
    class TestModel extends BaseModel<TestModel> {
      @PropertyType(String)
      val: string;
    }

    const model = new TestModel({ val: <any>BigInt(123) });
    expect(model.val).toEqual('123');
  });

  it('transform object to string results in empty string if not optional', async () => {
    class TestModel extends BaseModel<TestModel> {
      @PropertyType(String)
      val: string;
    }

    const model = new TestModel({ val: <any>{ test: 'test' } });
    expect(model.val).toEqual('');
  });

  it('transform object to string results in null if optional', async () => {
    class TestModel extends BaseModel<TestModel> {
      @PropertyType(String, { optional: true })
      val?: string;
    }

    const model = new TestModel({ val: <any>{ test: 'test' } });
    expect(model.val).toEqual(null);
  });

  it('transform number to true', async () => {
    class TestModel extends BaseModel<TestModel> {
      @PropertyType(Boolean)
      val: string;
    }

    const model = new TestModel({ val: <any>1 });
    expect(model.val).toEqual(true);
  });

  it('transform number to false', async () => {
    class TestModel extends BaseModel<TestModel> {
      @PropertyType(Boolean)
      val: string;
    }

    const model = new TestModel({ val: <any>0 });
    expect(model.val).toEqual(false);
  });

  it('transform string to int', async () => {
    class TestModel extends BaseModel<TestModel> {
      @PropertyType(Number)
      val: number;
    }

    const model = new TestModel({ val: <any>'123' });
    expect(model.val).toEqual(123);
  });

  it('transform string to float', async () => {
    class TestModel extends BaseModel<TestModel> {
      @PropertyType(Number)
      val: number;
    }

    const model = new TestModel({ val: <any>'1.2' });
    expect(model.val).toEqual(1.2);
  });

  it('transform string invalid float', async () => {
    class TestModel extends BaseModel<TestModel> {
      @PropertyType(Number, { optional: true })
      val?: number;
    }

    const model = new TestModel({ val: <any>'1,2' });
    expect(model.val).toEqual(null);
  });
});
