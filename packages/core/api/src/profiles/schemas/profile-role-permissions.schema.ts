import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { BaseDocument } from '@/core';
import { IPermissionSetting, ProfileRelationRole } from '@lyvely/interface';
import { getStringEnumValues } from '@lyvely/common';

@Schema({ timestamps: true })
export class ProfileRolePermission
  extends BaseDocument<ProfileRolePermission>
  implements IPermissionSetting
{
  @Prop({ required: true })
  id: string;

  @Prop({ enum: getStringEnumValues(ProfileRelationRole), required: true })
  role: ProfileRelationRole;
}

export const ProfileRolePermissionSchema = SchemaFactory.createForClass(ProfileRolePermission);
