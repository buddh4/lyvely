import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { getDefaultLocale, User } from '@/users';
import { Types } from 'mongoose';
import { BaseEntity, assureObjectId, EntityIdentity, ObjectIdProp } from '@/core';
import { Tag, TagSchema } from './tags.schema';
import {
  ProfileVisibilityLevel,
  ProfileModel,
  MIN_PROFILE_NAME_LENGTH,
  MAX_PROFILE_NAME_LENGTH,
  MAX_PROFILE_DESCRIPTION_LENGTH,
  ProfileType,
  ProfileUsage,
} from '@lyvely/core-interface';
import { BaseModel, getNumberEnumValues, PropertiesOf, PropertyType } from '@lyvely/common';
import { Avatar, AvatarSchema } from '@/avatars';
import {
  ProfileRolePermission,
  ProfileRolePermissionSchema,
} from './profile-role-permissions.schema';

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
  @ObjectIdProp({ required: true })
  ownerId: Types.ObjectId;

  @ObjectIdProp({ required: true })
  oid?: Types.ObjectId;

  @Prop({ min: MIN_PROFILE_NAME_LENGTH, max: MAX_PROFILE_NAME_LENGTH, required: true })
  name: string;

  @Prop({ max: MAX_PROFILE_DESCRIPTION_LENGTH })
  description: string;

  @Prop({ type: AvatarSchema })
  avatar?: Avatar;

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
  guid?: string;

  constructor(owner: EntityIdentity<User>, obj?: Partial<Profile>) {
    super(obj);

    this.ownerId = assureObjectId(owner)!;
    this.visibility = this.visibility ?? ProfileVisibilityLevel.Member;

    // We need to assign an oid even if this profile is not connected to an organizations for sharding and query index.
    // This OID can later be used to create an organization out of this profile
    if (!this.oid) {
      this.oid = new Types.ObjectId();
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
    this.tags = this.tags?.map((tag) => (tag instanceof Tag ? tag : new Tag(tag))) || [];
  }

  getTagByName(name: string) {
    return this.tags.find((tag) => tag.name === name);
  }

  getTagsByName(tagNames: string[]) {
    return this.tags.filter((tag) => tagNames.includes(tag.name));
  }

  getTagIdsByName(tagNames: string[]) {
    return this.getTagsByName(tagNames).map((tag) => assureObjectId(tag.id));
  }

  getTagById(id: Types.ObjectId) {
    return this.tags.find((tag) => tag._id.equals(id));
  }

  getTagsById(tagIds: Types.ObjectId[]) {
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
