import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { BaseEntity } from '@/core';
import { IPermissionSetting, ProfileRelationRole } from '@lyvely/core-interface';
import { getStringEnumValues } from '@lyvely/common';

@Schema({ timestamps: true })
export class ProfileRolePermission
  extends BaseEntity<ProfileRolePermission>
  implements IPermissionSetting
{
  @Prop({ required: true })
  id: string;

  @Prop({ enum: getStringEnumValues(ProfileRelationRole), required: true })
  role: ProfileRelationRole;
}

export const ProfileRolePermissionSchema = SchemaFactory.createForClass(ProfileRolePermission);
