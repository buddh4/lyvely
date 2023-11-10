import { validate } from 'class-validator';
import { IsIn } from './is-in.validator';

describe('IsIn', function () {
  it('value is not in array', async () => {
    class TestModel {
      @IsIn(['t1'])
      private value: string;
      constructor(value: string) {
        this.value = value;
      }
    }

    const baseModel = new TestModel('invalid');
    const result = await validate(baseModel);
    expect(result.length).toEqual(1);
    expect(result[0].property).toEqual('value');
  });

  it('value is in array', async () => {
    class TestModel {
      @IsIn(['t1'])
      private value: string;
      constructor(value: string) {
        this.value = value;
      }
    }

    const baseModel = new TestModel('t1');
    const result = await validate(baseModel);
    expect(result.length).toEqual(0);
  });

  it('value is not in getter result', async () => {
    class TestModel {
      @IsIn(() => ['t1'])
      private value: string;
      constructor(value: string) {
        this.value = value;
      }
    }

    const baseModel = new TestModel('invalid');
    const result = await validate(baseModel);
    expect(result.length).toEqual(1);
    expect(result[0].property).toEqual('value');
  });

  it('value is in getter result', async () => {
    class TestModel {
      @IsIn(() => ['t1'])
      private value: string;
      constructor(value: string) {
        this.value = value;
      }
    }

    const baseModel = new TestModel('t1');
    const result = await validate(baseModel);
    expect(result.length).toEqual(0);
  });
});
