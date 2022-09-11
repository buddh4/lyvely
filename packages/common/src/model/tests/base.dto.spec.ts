import { DocumentModel } from '../../index';
import { Exclude, Expose, Transform } from 'class-transformer';

class MockObjectId {
  constructor(value) {
    this.value = value;
  }

  value: string
  toString() {
    return this.value;
}
}

interface ITestBaseDto {
  id?: string;
  value: number;
  secret?: string;
}

@Exclude()
class TestBaseDto extends DocumentModel<ITestBaseDto> {
  @Expose()
  value: number;

  secret: 'string'
}

@Exclude()
class TestDocumentDto extends DocumentModel<TestDocumentDto> {
  @Expose()
  stringValue?: string;

  @Expose()
  numberValue?: number;

  @Expose()
  subModel?: Partial<TestBaseDto>;

  secret?: string;

  @Expose()
  @Transform(({ obj, key }) => typeof obj[key] === 'object' ? `${obj[key].text}:${obj[key].value}` : obj[key])
  mappedValue?: string;

  someFunction() {
    return 'yes';
  }
}

describe('Base Model', () => {
  describe('BaseModel constructor', function () {
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
      const baseModel = new TestDocumentDto({
        someFunction: () => 'no'
      });

      expect(baseModel.someFunction()).toEqual('yes');
    });

    it('basic constructor with sub model', async () => {
      const baseModel = new TestDocumentDto({
        subModel: new TestBaseDto({
          value: 10
        })
      });
      expect(baseModel.subModel).toBeDefined();
      expect(baseModel.subModel.value).toEqual(10);
    });

    it('don\'t include non exposed sub model field', async () => {
      const baseModel = new TestDocumentDto({
        subModel: new TestBaseDto({
          value: 10,
          secret: 'Test'
        })
      });
      expect(baseModel.subModel).toBeDefined();
      expect(baseModel.subModel.secret).toBeUndefined()
    });

    it('include non exposed sub model field if sanitize is false', async () => {
      const baseModel = new TestDocumentDto({
        subModel: new TestBaseDto({
          value: 10,
          secret: 'Test'
        }, { sanitize: false })
      }, { sanitize: false });
      expect(baseModel.subModel.secret).toBeDefined()
    });

    it('transform sub document _id to model string id', async () => {
      const obj = {
        _id: <any> new MockObjectId('test'),
        value: 10,
      };

      const baseModel = new TestDocumentDto({ subModel: new TestBaseDto(obj) });

      expect(baseModel.subModel).toBeDefined();
      expect(baseModel.subModel.id).toEqual('test')
    });


    it('test transform document _id to model string id', async () => {
      const obj = {
        _id: new MockObjectId('test'),
        secret: 'asdf'
      };

      const baseModel = new TestDocumentDto(obj);
      expect(baseModel.id).toBeDefined();
      expect(typeof baseModel.id).toEqual('string');
    });

    it('test exclude _id', async () => {
      const obj = {
        _id: new MockObjectId('test'),
        secret: 'asdf'
      };

      const baseModel = new TestDocumentDto(obj);
      expect((<any> baseModel)._id).toBeUndefined();
    });

    it('test don\'t include non exposed field', async () => {
      const baseModel = new TestDocumentDto({ secret: 'Test' });
      expect(baseModel.secret).toBeUndefined();
    });

    it('include exposed field if sanitize is false', async () => {
      const baseModel = new TestDocumentDto({ secret: 'Test' }, { sanitize: false });
      expect(baseModel.secret).toBeDefined();
    });

    it('test mapped value transformation', async () => {
      const baseModel = new TestDocumentDto(<any> {
        mappedValue: {
          text: 'test',
          value: 5
        }
      });
      expect(baseModel.mappedValue).toEqual('test:5');
    });

  });
});
