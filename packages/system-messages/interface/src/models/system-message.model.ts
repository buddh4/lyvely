import { ContentDataTypeModel, ContentModel } from '@lyvely/content-interface';
import { Exclude, Expose } from 'class-transformer';
import { PropertyType } from '@lyvely/common';

@Exclude()
export class SystemMessageContent extends ContentDataTypeModel {
  @Expose()
  params?: Record<string, string>;
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
