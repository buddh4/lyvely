import { TransformObjectId } from './transform-object-id.decorator';
import { BaseModel } from '../base.model';
import { instanceToPlain } from 'class-transformer';

describe('TransformObjectIdDecorator', () => {
  it('string to string', async () => {
    class TestModel<TID = string> extends BaseModel<TestModel> {
      @TransformObjectId()
      id: TID;
    }

    const model = new TestModel({ id: 'test' });
    expect(model.id).toEqual('test');
  });

  it('string to string transform', async () => {
    class TestModel<TID = string> extends BaseModel<TestModel> {
      @TransformObjectId()
      id: TID;
    }

    const model = new TestModel({ id: 'test' });
    const serialized = instanceToPlain(model);
    expect(serialized.id).toEqual('test');
  });

  it('object to string', async () => {
    class TestModel<TID = string> extends BaseModel<TestModel> {
      @TransformObjectId()
      id: TID;
    }

    const model = new TestModel({
      id: <any>{
        _bsontype: 'ObjectID',
        toString: () => 'test',
      },
    });
    expect(model.id).toEqual('test');
  });

  it('object to string transform', async () => {
    class TestModel<TID = string> extends BaseModel<TestModel> {
      @TransformObjectId()
      id: TID;
    }

    const model = new TestModel();
    model.id = <any>{ toString: () => 'test' };
    const serialized = instanceToPlain(model);
    expect(serialized.id).toEqual('test');
  });

  it('default', async () => {
    class TestModel<TID = string> extends BaseModel<TestModel> {
      @TransformObjectId()
      id: TID;
    }

    const model = new TestModel();
    expect(model.id).toBeUndefined();
  });

  it('optional', async () => {
    class TestModel<TID = string> extends BaseModel<TestModel> {
      @TransformObjectId({ optional: false })
      id: TID;
    }

    const model = new TestModel();
    expect(model.id).toEqual('');
  });
});
