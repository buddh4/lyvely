import { ContentDataTypeModel, ContentModel } from '@/content';
import { Exclude, Expose } from 'class-transformer';
import { PropertyType } from '@lyvely/common';

@Exclude()
export class SystemMessageContentModel extends ContentDataTypeModel {
  @Expose()
  params?: Record<string, string>;
}

@Exclude()
export class SystemMessageModel<TID = string> extends ContentModel<TID> {
  static contentType = 'SystemMessage';

  @Expose()
  @PropertyType(SystemMessageContentModel)
  content: SystemMessageContentModel;

  @Expose()
  type = SystemMessageModel.contentType;
}
