import { Prop, SchemaFactory } from '@nestjs/mongoose';
import { NestedSchema, ObjectIdArrayProp, TObjectId } from '@/core';
import { ProfileRelationRole, IProfilePermissionSetting, ContentUserRole } from '@lyvely/interface';
import { BaseModel, getStringEnumValues, type StrictBaseModelData } from '@lyvely/common';

@NestedSchema()
export class ProfilePermissionSetting implements IProfilePermissionSetting<TObjectId> {
  @Prop({ required: true })
  id: string;

  @Prop({
    enum: [...getStringEnumValues(ProfileRelationRole), ...getStringEnumValues(ContentUserRole)],
    required: true,
  })
  role: ProfileRelationRole | ContentUserRole;

  @ObjectIdArrayProp()
  groups?: TObjectId[];

  constructor(data: StrictBaseModelData<ProfilePermissionSetting>) {
    BaseModel.init(this, data);
  }
}

export const ProfilePermissionSettingSchema =
  SchemaFactory.createForClass(ProfilePermissionSetting);
