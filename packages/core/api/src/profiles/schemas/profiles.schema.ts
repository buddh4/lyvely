import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { getDefaultLocale, User } from '@/users';
import {
  assureObjectId,
  BaseEntity,
  createObjectId,
  EntityIdentity,
  MixedProp,
  ObjectIdProp,
  TObjectId,
} from '@/core';
import { Tag, TagSchema } from './tags.schema';
import {
  MAX_PROFILE_DESCRIPTION_LENGTH,
  MAX_PROFILE_NAME_LENGTH,
  MIN_PROFILE_NAME_LENGTH,
  ProfileModel,
  ProfileType,
  ProfileUsage,
  ProfileVisibilityLevel,
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
export class Profile extends BaseEntity<Profile> implements PropertiesOf<ProfileModel<TObjectId>> {
  @ObjectIdProp({ required: true })
  ownerId: TObjectId;

  @ObjectIdProp({ required: true })
  oid: TObjectId;

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

  @MixedProp({ default: {} })
  settings: Record<string, any>;

  @Prop({ type: [String] })
  enabledFeatures: string[];

  @Prop({ type: [String] })
  disabledFeatures: string[];

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
      this.oid = createObjectId();
      this.hasOrg = false;
    } else {
      this.hasOrg = true;
    }

    this.locale = this.locale || getDefaultLocale();
  }

  isOfType(type: ProfileType) {
    return this.type === type;
  }

  isOrganization() {
    return this.isOfType(ProfileType.Organization);
  }

  /**
   * Determines if this profile is part of an organization. Note this will return false for root organization profiles.
   * @param oid
   */
  hasOrganization() {
    return this.hasOrg && !this.isOrganization();
  }

  /**
   * Determines if this profile is part of the given organization. Note this will return false for root organization profiles.
   * @param oid
   */
  isProfileOfOrganization(oid: EntityIdentity<Profile> | null | undefined) {
    if (!oid || this.isOrganization()) return false;
    return assureObjectId(oid).equals(this.oid);
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
