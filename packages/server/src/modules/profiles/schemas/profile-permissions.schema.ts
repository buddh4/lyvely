import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose from 'mongoose';
import { BaseEntity } from '../../../core/db/base.entity';
import { Profile } from 'passport';

export type ProfileRolePermissionDocument = Profile & mongoose.Document;

@Schema({ timestamps: true })
export class ProfileRolePermission extends BaseEntity<ProfileRolePermission> {

  @Prop( { required: true })
  role: string;

  @Prop({ required: true })
  permission: string;

}

export const ProfileRolePermissionSchema = SchemaFactory.createForClass(ProfileRolePermission);
