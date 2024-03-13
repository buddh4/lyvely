import { DocumentModel } from '../index';
import { Exclude, Expose, instanceToPlain } from 'class-transformer';

class MockObjectId {
  constructor(value: any) {
    this.value = value;
  }

  value: string;
  toString() {
    return this.value;
  }
}

@Exclude()
class TestBaseDto {
  @Expose()
  id: string;

  @Expose()
  value: number;

  secret: 'string';

  constructor(data: Partial<TestBaseDto>) {
    DocumentModel.init(this, data);
  }
}

@Exclude()
class TestDocumentDto {
  @Expose()
  id: string;

  @Expose()
  stringValue?: string;

  @Expose()
  numberValue?: number;

  @Expose()
  subModel?: Partial<TestBaseDto>;

  secret?: string;

  constructor(data: Partial<TestDocumentDto>) {
    DocumentModel.init(this, data);
  }

  someFunction() {
    return 'yes';
  }
}

describe('Base Model', () => {
  describe('constructor', function () {
    it('basic constructor', async () => {
      const baseModel = new TestDocumentDto({
        stringValue: 'Test',
        numberValue: 5,
      });

      expect(baseModel.stringValue).toEqual('Test');
      expect(baseModel.numberValue).toEqual(5);
      expect(baseModel.subModel).toBeUndefined();
    });

    it('do not overwrite functions', async () => {
      const baseModel = new TestDocumentDto(<any>{
        someFunction: () => 'no',
      });

      expect(baseModel.someFunction()).toEqual('yes');
    });

    it('basic constructor with sub model', async () => {
      const baseModel = new TestDocumentDto({
        subModel: new TestBaseDto({
          value: 10,
        }),
      });
      expect(baseModel.subModel).toBeDefined();
      expect(baseModel.subModel?.value).toEqual(10);
    });

    it('transform sub document _id to model string id', async () => {
      const obj = {
        _id: <any>new MockObjectId('test'),
        value: 10,
      };

      const baseModel = new TestDocumentDto({ subModel: new TestBaseDto(obj) });

      expect(baseModel.subModel).toBeDefined();
      expect(baseModel.subModel?.id).toEqual('test');
    });

    it('test transform document _id to model string id', async () => {
      const obj = {
        _id: new MockObjectId('test'),
        secret: 'asdf',
      };

      const baseModel = new TestDocumentDto(obj);
      expect(baseModel.id).toBeDefined();
      expect(typeof baseModel.id).toEqual('string');
    });

    it('test exclude _id', async () => {
      const obj = {
        _id: new MockObjectId('test'),
        secret: 'asdf',
      };

      const baseModel = new TestDocumentDto(obj);
      expect(instanceToPlain(baseModel)._id).toBeUndefined();
    });
  });
});
