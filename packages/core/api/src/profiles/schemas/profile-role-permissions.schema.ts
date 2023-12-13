import { Prop, SchemaFactory } from '@nestjs/mongoose';
import { BaseDocument, NestedSchema, ObjectIdArrayProp, TObjectId } from '@/core';
import { ProfileRelationRole, IProfilePermissionSetting, ContentUserRole } from '@lyvely/interface';
import { getStringEnumValues } from '@lyvely/common';

@NestedSchema()
export class ProfilePermissionSetting
  extends BaseDocument<ProfilePermissionSetting>
  implements IProfilePermissionSetting<TObjectId>
{
  @Prop({ required: true })
  id: string;

  @Prop({
    enum: [...getStringEnumValues(ProfileRelationRole), ...getStringEnumValues(ContentUserRole)],
    required: true,
  })
  role: ProfileRelationRole | ContentUserRole;

  @ObjectIdArrayProp()
  groups?: TObjectId[];
}

export const ProfilePermissionSettingSchema =
  SchemaFactory.createForClass(ProfilePermissionSetting);
