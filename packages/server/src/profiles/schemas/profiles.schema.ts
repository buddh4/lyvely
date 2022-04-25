import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { getDefaultLocale, UserDocument } from '../../users/schemas/users.schema';
import  mongoose from 'mongoose';
import { BaseEntity } from '../../db/base.entity';
import { Category, CategorySchema, } from '../../categories/schemas/categories.schema';
import { IProfile, ProfileType, ProfileVisibilityLevel , getNumberEnumValues } from 'lyvely-common';

import { ProfileRolePermission, ProfileRolePermissionSchema } from './profile-permissions.schema';

export type ProfileDocument = Profile & mongoose.Document;
export const DEFAULT_PROFILE_NAME = 'default';

@Schema({ timestamps: true })
export class Profile extends BaseEntity<Profile> implements IProfile {

  constructor(obj?: Partial<Profile>) {
    super(obj);

    // https://mongoosejs.com/docs/tutorials/lean.html#plugins
    this.visibility = this.visibility ?? ProfileVisibilityLevel.Member;
    this.type = this.type ?? ProfileType.User;
  }

  @Prop({ type: mongoose.Schema.Types.ObjectId, required: true })
  createdBy: mongoose.Types.ObjectId;

  @Prop({ type: mongoose.Schema.Types.ObjectId, required: false })
  oid?: mongoose.Types.ObjectId;

  @Prop({ required: true, default: DEFAULT_PROFILE_NAME })
  name: string;

  // TODO: validate locale!
  @Prop({ default: getDefaultLocale() })
  locale: string;

  @Prop()
  description: string;

  @Prop({ default: false })
  archived: boolean;

  @Prop({ required: true, default: 0 })
  score: number;

  @Prop({ type: Number, required: true, enum: getNumberEnumValues(ProfileType), default: ProfileType.User })
  type: ProfileType;

  @Prop({ type: Number, required: true, enum: getNumberEnumValues(ProfileVisibilityLevel), default: ProfileVisibilityLevel.Member })
  visibility: ProfileVisibilityLevel;

  @Prop( {type: [ProfileRolePermissionSchema], default: []})
  permissions: ProfileRolePermission[];

  @Prop({ type: [CategorySchema], default: [] })
  categories: Category[];

  createdAt: Date;

  updatedAt: Date;

  public getPermissionsByRole(role: string) {
    if(!this.permissions) {
      return [];
    }

    return this.permissions.filter((rolePermission) => rolePermission.role === role);
  }

  public getLocale() {
    if (!this.locale) {
      this.locale = getDefaultLocale();
    }

    return this.locale;
  }
}

export const ProfileSchema = SchemaFactory.createForClass(Profile);

ProfileSchema.methods.getLocale = function (): string {
  const user = <UserDocument>this;

  if (!user.locale) {
    user.locale = getDefaultLocale();
  }

  return user.locale;
};
