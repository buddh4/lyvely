import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { getDefaultLocale, UserDocument } from '../../users';
import  mongoose from 'mongoose';
import { BaseEntity } from '../../db/base.entity';
import { Tag, TagSchema, } from '../../tags';
import { IProfile, ProfileType, ProfileVisibilityLevel , getNumberEnumValues } from '@lyvely/common';

import { ProfileRolePermission, ProfileRolePermissionSchema } from './profile-permissions.schema';
import { Organization } from "../../organization";
import { assureObjectId } from "../../db/db.utils";

export type ProfileDocument = Profile & mongoose.Document;
export const DEFAULT_PROFILE_NAME = 'default';

@Schema({ timestamps: true })
export class Profile extends BaseEntity<Profile> implements IProfile {

  @Prop({ type: mongoose.Schema.Types.ObjectId, required: true })
  createdBy: TObjectId;

  @Prop({ type: mongoose.Schema.Types.ObjectId, required: false })
  oid?: TObjectId;

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

  @Prop( { type: [ProfileRolePermissionSchema], default: [] })
  permissions: ProfileRolePermission[];

  @Prop({ type: [TagSchema], default: [] })
  tags: Tag[];

  createdAt: Date;

  updatedAt: Date;

  constructor(obj?: Partial<Profile>)
  constructor(organization?: Organization | Partial<Profile>, obj?: Partial<Profile>){
    if(organization && !(organization instanceof Organization)) {
      obj = organization;
      organization = undefined;
    }

    super(obj);

    this.visibility = this.visibility ?? ProfileVisibilityLevel.Member;
    this.type = this.type ?? ProfileType.User;

    if(!this._id) {
      this._id = new mongoose.Types.ObjectId();
    }

    if(organization) {
      this.oid = assureObjectId(organization as Organization);
    }

    // We need to assign an oid even if this profile is not connected to an organization for sharding and query index.
    if(!this.oid) {
      this.oid = this._id;
    }
  }

  getTagByName(name: string) {
    return this.tags.find(tag => tag.name === name);
  }

  getTagsByName(tagNames: string[]) {
    return this.tags.filter(tag => tagNames.includes(tag.name));
  }

  getTagById(id: TObjectId) {
    return this.tags.find(tag => tag._id.equals(id));
  }

  getTagsById(tagIds: TObjectId[]) {
    return this.tags.filter(tag => tagIds.includes(tag._id));
  }

  getNewTags() {
    return this.tags.filter(tag => tag.isNew);
  }

  protected afterInit() {
    super.afterInit();
    this.tags = this.tags?.map(category => (category instanceof Tag) ? category : new Tag(category)) || [];
  }

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
