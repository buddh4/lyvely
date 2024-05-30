import { PropertyType } from './property-type.decorator';
import { BaseModel } from '../util';
import { plainToClass } from 'class-transformer';

describe('PropertyType', () => {
  it('test primitive value', async () => {
    class PlainSubModel {
      @PropertyType(String, { default: 'defaultValue' })
      value: string;

      constructor(data?: PlainSubModel) {
        BaseModel.init(this, data);
      }
    }

    const model = new PlainSubModel();
    expect(model.value).toEqual('defaultValue');
  });

  it('test string default value', async () => {
    class PlainSubModel {
      @PropertyType(String)
      value: string;

      constructor(data?: PlainSubModel) {
        BaseModel.init(this, data);
      }
    }

    const model = new PlainSubModel();
    expect(model.value).toEqual('');
  });

  it('test number default value', async () => {
    class PlainSubModel {
      @PropertyType(Number)
      value: number;

      constructor(data?: PlainSubModel) {
        BaseModel.init(this, data);
      }
    }

    const model = new PlainSubModel();
    expect(model.value).toEqual(0);
  });

  it('test boolean default value', async () => {
    class PlainSubModel {
      @PropertyType(Boolean)
      value: boolean;

      constructor(data?: PlainSubModel) {
        BaseModel.init(this, data);
      }
    }

    const model = new PlainSubModel();
    expect(model.value).toEqual(false);
  });

  it('basic constructor', async () => {
    class PlainSubModel {
      value: string;
    }

    class TestModel {
      @PropertyType(PlainSubModel)
      sub: PlainSubModel;

      secret: 'string';

      constructor(data?: TestModel) {
        BaseModel.init(this, data);
      }
    }
    const model = new TestModel(<any>{ sub: { value: 'test' } });
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

    class TestModel {
      @PropertyType(PlainSubModel)
      sub: PlainSubModel;

      constructor(data?: TestModel) {
        BaseModel.init(this, data);
      }
    }
    const model = new TestModel({ sub: { sub: { value: 'test' } } });
    expect(model.sub instanceof PlainSubModel).toEqual(true);
    expect(model.sub.sub instanceof ValueModel).toEqual(true);
  });

  it('assure optional property is not initialized by default', async () => {
    class ValueModel {
      value: string;
    }

    class TestModel {
      @PropertyType(ValueModel, { optional: true })
      sub?: ValueModel;

      constructor(data?: TestModel) {
        BaseModel.init(this, data);
      }
    }

    const model = new TestModel();
    expect(model.sub).toBeUndefined();
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

    class TestModel {
      @PropertyType(PlainSubModel)
      sub: PlainSubModel;

      constructor(data?: TestModel) {
        BaseModel.init(this, data);
      }
    }

    const model = new TestModel({ sub: <any>{} });
    expect(model.sub.sub.value).toEqual('defaultValue');
  });

  it('assure properties are inherited', async () => {
    class MyModel {
      @PropertyType(String, { default: 'Test' })
      field: string;

      constructor(data?: MyModel) {
        BaseModel.init(this, data);
      }
    }

    class SubSubModel extends MyModel {}

    const model = new SubSubModel();
    expect(model.field).toEqual('Test');
  });

  it('assure property types are overwritten by parent', async () => {
    class Parent {
      @PropertyType(String, { default: 'Parent' })
      field: string;

      constructor(data?: Parent) {
        BaseModel.init(this, data);
      }
    }

    class SubModel extends Parent {}

    const model = new SubModel();
    expect(model.field).toEqual('Parent');
  });

  it('assure property types are overwritten by child', async () => {
    class Parent {
      @PropertyType(String, { default: 'Parent' })
      field: string;

      constructor(data?: Parent) {
        BaseModel.init(this, data);
      }
    }

    class SubModel extends Parent {
      @PropertyType(String, { default: 'Child' })
      override field: string;
    }

    const model = new SubModel();
    expect(model.field).toEqual('Child');
  });

  it('test array without default', async () => {
    class TestModel {
      @PropertyType(String)
      arr: string[];

      constructor(data?: TestModel) {
        BaseModel.init(this, data);
      }
    }

    const model = new TestModel();
    expect(model.arr).toBeDefined();
    expect(model.arr.length).toEqual(0);
  });

  it('test string array without default', async () => {
    class TestModel {
      @PropertyType([String])
      arr: string[];

      constructor(data?: TestModel) {
        BaseModel.init(this, data);
      }
    }

    const model = new TestModel();
    expect(model.arr).toBeDefined();
    expect(model.arr.length).toEqual(0);
  });

  it('test string array with init value', async () => {
    class TestModel {
      @PropertyType([String])
      arr: string[];

      constructor(data?: TestModel) {
        BaseModel.init(this, data);
      }
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

    class TestModel {
      @PropertyType([SubModel])
      arr: SubModel[];

      constructor(data?: TestModel) {
        BaseModel.init(this, data);
      }
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
    class TestModel {
      @PropertyType(Date)
      date: Date;

      constructor(data?: TestModel) {
        BaseModel.init(this, data);
      }
    }

    const model = new TestModel({ date: <any>'2022-07-23T15:47:51.518Z' });
    expect(model.date instanceof Date).toEqual(true);
    expect(model.date.getFullYear()).toEqual(2022);
    expect(model.date.getDate()).toEqual(23);
    expect(model.date.getMonth()).toEqual(6);
  });

  it('transform to null', async () => {
    class TestModel {
      @PropertyType(null)
      val: null;

      constructor(data?: TestModel) {
        BaseModel.init(this, data);
      }
    }

    const model = new TestModel({ val: <any>1 });
    expect(model.val).toEqual(null);
  });

  it('transform to undefined', async () => {
    class TestModel {
      @PropertyType(undefined)
      val: null;

      constructor(data?: TestModel) {
        BaseModel.init(this, data);
      }
    }

    const model = new TestModel({ val: <any>1 });
    expect(model.val).toEqual(undefined);
  });

  it('transform number to string', async () => {
    class TestModel {
      @PropertyType(String)
      val: string;

      constructor(data?: TestModel) {
        BaseModel.init(this, data);
      }
    }

    const model = new TestModel({ val: <any>1 });
    expect(model.val).toEqual('1');
  });

  it('transform true to string', async () => {
    class TestModel {
      @PropertyType(String)
      val: string;

      constructor(data?: TestModel) {
        BaseModel.init(this, data);
      }
    }

    const model = new TestModel({ val: <any>true });
    expect(model.val).toEqual('true');
  });

  it('transform false to string', async () => {
    class TestModel {
      @PropertyType(String)
      val: string;

      constructor(data?: TestModel) {
        BaseModel.init(this, data);
      }
    }

    const model = new TestModel({ val: <any>false });
    expect(model.val).toEqual('false');
  });

  it('transform bigint to string', async () => {
    class TestModel {
      @PropertyType(String)
      val: string;

      constructor(data?: TestModel) {
        BaseModel.init(this, data);
      }
    }

    const model = new TestModel({ val: <any>BigInt(123) });
    expect(model.val).toEqual('123');
  });

  it('transform bigint to string', async () => {
    class TestModel {
      @PropertyType(String)
      val: string;

      constructor(data?: TestModel) {
        BaseModel.init(this, data);
      }
    }

    const model = new TestModel({ val: <any>BigInt(123) });
    expect(model.val).toEqual('123');
  });

  it('transform object to string results in empty string if not optional', async () => {
    class TestModel {
      @PropertyType(String)
      val: string;

      constructor(data?: TestModel) {
        BaseModel.init(this, data);
      }
    }

    const model = new TestModel({ val: <any>{ test: 'test' } });
    expect(model.val).toEqual('');
  });

  it('transform object to string results in null if optional', async () => {
    class TestModel {
      @PropertyType(String, { optional: true })
      val?: string;

      constructor(data?: TestModel) {
        BaseModel.init(this, data);
      }
    }

    const model = new TestModel({ val: <any>{ test: 'test' } });
    expect(model.val).toEqual(null);
  });

  it('transform number to true', async () => {
    class TestModel {
      @PropertyType(Boolean)
      val: string;

      constructor(data?: TestModel) {
        BaseModel.init(this, data);
      }
    }

    const model = new TestModel({ val: <any>1 });
    expect(model.val).toEqual(true);
  });

  it('transform number to false', async () => {
    class TestModel {
      @PropertyType(Boolean)
      val: string;

      constructor(data?: TestModel) {
        BaseModel.init(this, data);
      }
    }

    const model = new TestModel({ val: <any>0 });
    expect(model.val).toEqual(false);
  });

  it('transform string to int', async () => {
    class TestModel {
      @PropertyType(Number)
      val: number;

      constructor(data?: TestModel) {
        BaseModel.init(this, data);
      }
    }

    const model = new TestModel({ val: <any>'123' });
    expect(model.val).toEqual(123);
  });

  it('transform string to float', async () => {
    class TestModel {
      @PropertyType(Number)
      val: number;

      constructor(data?: TestModel) {
        BaseModel.init(this, data);
      }
    }

    const model = new TestModel({ val: <any>'1.2' });
    expect(model.val).toEqual(1.2);
  });

  it('transform string invalid float', async () => {
    class TestModel {
      @PropertyType(Number, { optional: true })
      val?: number;

      constructor(data?: TestModel) {
        BaseModel.init(this, data);
      }
    }

    const model = new TestModel({ val: <any>'1,2' });
    expect(model.val).toEqual(null);
  });

  it('class transformer type', async () => {
    class NestedModel {
      nested?: number;

      constructor(data?: NestedModel) {
        BaseModel.init(this, data);
      }
    }

    class TestModel {
      @PropertyType(NestedModel)
      val: NestedModel;

      constructor(data?: TestModel) {
        BaseModel.init(this, data);
      }
    }

    const model = plainToClass(TestModel, { val: { nested: 3 } });

    expect(model instanceof TestModel).toEqual(true);
    expect(model.val instanceof NestedModel).toEqual(true);
  });

  it('class transformer array type', async () => {
    class NestedModel {
      nested?: number;

      constructor(data?: NestedModel) {
        BaseModel.init(this, data);
      }
    }

    class TestModel {
      @PropertyType([NestedModel])
      val: NestedModel[];

      constructor(data?: TestModel) {
        BaseModel.init(this, data);
      }
    }

    const model = plainToClass(TestModel, { val: [{ nested: 1 }, { nested: 2 }] });

    expect(model instanceof TestModel).toEqual(true);
    expect(Array.isArray(model.val)).toEqual(true);
    expect(model.val[0] instanceof NestedModel).toEqual(true);
    expect(model.val[1] instanceof NestedModel).toEqual(true);
  });
});
