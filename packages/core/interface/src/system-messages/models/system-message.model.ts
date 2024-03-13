import { ContentDataTypeModel, ContentModel } from '@/content';
import { Exclude, Expose } from 'class-transformer';
import { PropertyType } from '@lyvely/common';

@Expose()
export class SystemMessageContentModel extends ContentDataTypeModel {
  params?: Record<string, string>;
}

@Exclude()
export class SystemMessageModel<TID = string> extends ContentModel<TID> {
  static contentType = 'SystemMessage';

  @Expose()
  @PropertyType(SystemMessageContentModel)
  override content: SystemMessageContentModel;

  @Expose()
  override type = SystemMessageModel.contentType;
}
