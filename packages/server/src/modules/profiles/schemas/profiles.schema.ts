import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { getDefaultLocale, User } from '../../users';
import mongoose from 'mongoose';
import { BaseEntity } from '../../core/db/base.entity';
import { Tag, TagSchema } from '../../tags';
import {
  ProfileVisibilityLevel,
  getNumberEnumValues,
  PropertiesOf,
  ProfileModel,
  MIN_PROFILE_NAME_LENGTH,
  MAX_PROFILE_NAME_LENGTH,
  MAX_PROFILE_DESCRIPTION_LENGTH,
  ProfileType,
  BaseModel,
  PropertyType,
  ProfileUsage,
} from '@lyvely/common';

import { ProfileRolePermission, ProfileRolePermissionSchema } from './profile-role-permissions.schema';
import { assureObjectId, EntityIdentity } from '../../core/db/db.utils';

@Schema({ _id: false })
class ProfileMetadata extends BaseModel<ProfileMetadata> {
  @PropertyType(Boolean, { default: true })
  @Prop({ required: true })
  archivable: boolean;

  @PropertyType(Boolean, { default: true })
  @Prop({ required: true })
  deletable: boolean;
}

const ProfileMetadataSchema = SchemaFactory.createForClass(ProfileMetadata);

@Schema({ timestamps: true, discriminatorKey: 'type' })
export class Profile extends BaseEntity<Profile> implements PropertiesOf<ProfileModel> {
  @Prop({ type: mongoose.Schema.Types.ObjectId, required: true })
  ownerId: TObjectId;

  @Prop({ type: mongoose.Schema.Types.ObjectId, required: true })
  oid?: TObjectId;

  @Prop({ min: MIN_PROFILE_NAME_LENGTH, max: MAX_PROFILE_NAME_LENGTH, required: true })
  name: string;

  @Prop({ max: MAX_PROFILE_DESCRIPTION_LENGTH })
  description: string;

  @Prop({ type: ProfileMetadataSchema })
  @PropertyType(ProfileMetadata)
  meta: ProfileMetadata;

  // TODO: (integrity) validate locale!
  @Prop({ default: getDefaultLocale() })
  locale: string;

  @Prop({ default: false })
  archived: boolean;

  @Prop({ default: false })
  hasOrg: boolean;

  @Prop({ required: true, default: 0 })
  score: number;

  @Prop({ type: [String] })
  usage: ProfileUsage[];

  type: ProfileType;

  @Prop({
    type: Number,
    required: true,
    enum: getNumberEnumValues(ProfileVisibilityLevel),
    default: ProfileVisibilityLevel.Member,
  })
  visibility: ProfileVisibilityLevel;

  @Prop({ type: [ProfileRolePermissionSchema], default: [] })
  permissions: ProfileRolePermission[];

  @Prop({ type: [TagSchema], default: [] })
  tags: Tag[];

  @Prop({ type: String })
  imageHash?: string;

  createdAt: Date;

  updatedAt: Date;

  constructor(owner: EntityIdentity<User>, obj?: Partial<Profile>) {
    super(obj);

    this.ownerId = assureObjectId(owner);
    this.visibility = this.visibility ?? ProfileVisibilityLevel.Member;

    // We need to assign an oid even if this profile is not connected to an organizations for sharding and query index.
    // This OID can later be used to create an organization out of this profile
    if (!this.oid) {
      this.oid = new mongoose.Types.ObjectId();
      this.hasOrg = false;
    } else {
      this.hasOrg = true;
    }

    this.locale = this.locale || getDefaultLocale();
  }

  isOfType(type: ProfileType) {
    return this.type === type;
  }

  afterInit() {
    super.afterInit();
    this.tags = this.tags?.map((category) => (category instanceof Tag ? category : new Tag(category))) || [];
  }

  getTagByName(name: string) {
    return this.tags.find((tag) => tag.name === name);
  }

  getTagsByName(tagNames: string[]) {
    return this.tags.filter((tag) => tagNames.includes(tag.name));
  }

  getTagById(id: TObjectId) {
    return this.tags.find((tag) => tag._id.equals(id));
  }

  getTagsById(tagIds: TObjectId[]) {
    return this.tags.filter((tag) => tagIds.includes(tag._id));
  }

  getNewTags() {
    return this.tags.filter((tag) => tag.isNew);
  }

  getPermissionsByRole(role: string) {
    if (!this.permissions?.length) {
      return [];
    }

    return this.permissions.filter((rolePermission) => rolePermission.role === role);
  }
}

export const ProfileSchema = SchemaFactory.createForClass(Profile);
export type ProfileDocument = Profile & mongoose.Document;
