import { ContentDataTypeModel, ContentModel } from './content.model';
import { Exclude, instanceToPlain } from 'class-transformer';
import { PropertyType } from '@lyvely/common';
import { StreamResponse } from '../../streams';
import { registerContentModelType } from '../registries';

describe('ContentResponseModel', () => {
  describe('transform', () => {
    it('Content fields are included by default', () => {
      class TestContentDataType extends ContentDataTypeModel {
        field: string;
      }
      class TestContentModel<TID = string> extends ContentModel<TID, TestContentModel> {
        @PropertyType(TestContentDataType)
        content: TestContentDataType;

        type = 'test';
      }

      registerContentModelType('test', TestContentModel);
      const content = new TestContentModel({ content: { field: 'value' } });
      const response = new StreamResponse({ models: [content] });
      const result = instanceToPlain(response);
      expect(result.models[0].content.field).toEqual('value');
    });
    it('It is possible to exclude fields from content model', () => {
      class TestContentDataType extends ContentDataTypeModel {
        @Exclude()
        secret: string;
      }
      class TestContentModel<TID = string> extends ContentModel<TID, TestContentModel> {
        @PropertyType(TestContentDataType)
        content: TestContentDataType;

        type = 'test';
      }

      registerContentModelType('test', TestContentModel);
      const content = new TestContentModel({ content: { secret: 'secret!' } });
      const response = new StreamResponse({ models: [content] });
      const result = instanceToPlain(response);
      expect(result.models[0].content.secret).toBeUndefined();
    });
  });
});
