import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { BaseEntity } from '@lyvely/core';

@Schema({ timestamps: true })
export class ProfileRolePermission extends BaseEntity<ProfileRolePermission> {
  @Prop({ required: true })
  role: string;

  @Prop({ required: true })
  permission: string;
}

export const ProfileRolePermissionSchema = SchemaFactory.createForClass(ProfileRolePermission);
