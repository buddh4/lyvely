import { Prop, SchemaFactory } from '@nestjs/mongoose';
import { BaseDocument, NestedSchema, ObjectIdArrayProp, TObjectId } from '@/core';
import { ProfileRelationRole, IProfilePermissionSetting } from '@lyvely/interface';
import { getStringEnumValues } from '@lyvely/common';

@NestedSchema()
export class ProfilePermissionSetting
  extends BaseDocument<ProfilePermissionSetting>
  implements IProfilePermissionSetting<TObjectId>
{
  @Prop({ enum: getStringEnumValues(ProfileRelationRole), required: true })
  role: ProfileRelationRole;

  @ObjectIdArrayProp()
  groups?: TObjectId[];
}

export const ProfilePermissionSettingSchema =
  SchemaFactory.createForClass(ProfilePermissionSetting);
