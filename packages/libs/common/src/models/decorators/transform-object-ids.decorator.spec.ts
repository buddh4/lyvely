import { TransformObjectId, TransformObjectIds } from './transform-object-id.decorator';
import { BaseModel } from '../base.model';
import { instanceToPlain } from 'class-transformer';

describe('TransformObjectIdDecorator', () => {
  it('string to string', async () => {
    class TestModel<TID = string> extends BaseModel<TestModel> {
      @TransformObjectIds()
      ids: TID[];
    }

    const model = new TestModel({ ids: ['test'] });
    expect(model.ids[0]).toEqual('test');
  });

  it('string to string transform', async () => {
    class TestModel<TID = string> extends BaseModel<TestModel> {
      @TransformObjectIds()
      ids: TID[];
    }

    const model = new TestModel({ ids: ['test'] });
    const serialized = instanceToPlain(model);
    expect(serialized.ids[0]).toEqual('test');
  });

  it('object to string', async () => {
    class TestModel<TID = string> extends BaseModel<TestModel> {
      @TransformObjectIds()
      ids: TID[];
    }

    const model = new TestModel({
      ids: [
        <any>{ _bsontype: 'ObjectId', toString: () => 'test1' },
        <any>{ _bsontype: 'ObjectId', toString: () => 'test2' },
      ],
    });
    expect(model.ids[0]).toEqual('test1');
    expect(model.ids[1]).toEqual('test2');
  });

  it('object to string transform', async () => {
    class TestModel<TID = string> extends BaseModel<TestModel> {
      @TransformObjectIds()
      ids: TID[];
    }

    const model = new TestModel();
    model.ids = [
      <any>{ _bsontype: 'ObjectId', toString: () => 'test1' },
      <any>{ _bsontype: 'ObjectId', toString: () => 'test2' },
    ];
    const serialized = instanceToPlain(model);
    expect(serialized.ids[0]).toEqual('test1');
    expect(serialized.ids[1]).toEqual('test2');
  });

  it('default', async () => {
    class TestModel<TID = string> extends BaseModel<TestModel> {
      @TransformObjectIds()
      ids: TID[];
    }

    const model = new TestModel();
    expect(model.ids).toEqual([]);
  });

  it('optional', async () => {
    class TestModel<TID = string> extends BaseModel<TestModel> {
      @TransformObjectIds({ optional: true })
      ids: TID[];
    }

    const model = new TestModel();
    expect(model.ids).toBeUndefined();
  });
});
