import { ContentDataTypeModel, ContentModel } from '@/content';
import { Exclude, Expose } from 'class-transformer';
import { PropertyType } from '@/models';

@Exclude()
export class SystemMessageContent extends ContentDataTypeModel {
  @Expose()
  params?: Array<string>;
}

@Exclude()
export class SystemMessageModel extends ContentModel {
  static contentType = 'SystemMessage';

  @Expose()
  @PropertyType(SystemMessageContent)
  content: SystemMessageContent;

  @Expose()
  type = SystemMessageModel.contentType;
}
