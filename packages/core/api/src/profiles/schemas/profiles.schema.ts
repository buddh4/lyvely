import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import {
  getDefaultLocale,
  assureObjectId,
  BaseDocument,
  createObjectId,
  DocumentIdentity,
  MixedProp,
  ObjectIdProp,
  TObjectId,
} from '@/core';
import { User } from '@/users';
import { Tag, TagSchema } from './tags.schema';
import {
  MAX_PROFILE_DESCRIPTION_LENGTH,
  ProfileModel,
  ProfileType,
  ProfileUsage,
  ProfileVisibilityLevel,
  VALID_DISPLAY_NAME_REGEX,
  VALID_HANDLE_REGEX,
  IPermissionSetting,
  IProfilePermissionData,
  IProfilePermissionObject,
} from '@lyvely/interface';
import { BaseModel, getNumberEnumValues, PropertiesOf, PropertyType } from '@lyvely/common';
import { Avatar, AvatarSchema } from '@/avatars';
import {
  ProfilePermissionSetting,
  ProfilePermissionSettingSchema,
} from './profile-role-permissions.schema';
import { createHash } from 'crypto';
import { ProfileMemberGroup, ProfileMemberGroupSchema } from './profile-member-group.schema';

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

/**
 * This is the base class for all profile types as user, group and organization profiles.
 * Note, it is not intended to create custom profile types beside the types defined in ProfileTypes.
 */
@Schema({ timestamps: true, discriminatorKey: 'type' })
export class Profile
  extends BaseDocument<Profile>
  implements PropertiesOf<ProfileModel<TObjectId>>, IProfilePermissionObject
{
  /** The main owner of this profile, note that there may be additional owners registered as profile relation. **/
  @ObjectIdProp({ required: true })
  ownerId: TObjectId;

  /**
   * The organization id of this profile.
   * This field is always set, even if this profile is not connected to an organization.
   * The oid is frequently used for queries and indexes.
   **/
  @ObjectIdProp({ required: true })
  oid: TObjectId;

  /** The non-unique name of this profile. **/
  @Prop({ required: true, validate: VALID_DISPLAY_NAME_REGEX })
  name: string;

  /**  The unique handle of this profile, used e.g. in urls. **/
  @Prop({ required: true, validate: VALID_HANDLE_REGEX })
  handle: string;

  /** A optional description text. **/
  @Prop({ max: MAX_PROFILE_DESCRIPTION_LENGTH })
  description?: string;

  /** The avatar of this profile. **/
  @Prop({ type: AvatarSchema })
  avatar?: Avatar;

  /** Stores some profile metadata. **/
  @Prop({ type: ProfileMetadataSchema })
  @PropertyType(ProfileMetadata)
  meta: ProfileMetadata;

  // TODO: (integrity) validate locale!
  /**
   * This locale is used as fallback in case not calendar preferences were set
   * and usually contains the locale of the initial author.
   **/
  @Prop({ default: getDefaultLocale() })
  locale: string;

  /** Whether this profile is archived. **/
  @Prop({ default: false })
  archived: boolean;

  /** Whether this profile was deleted. **/
  @Prop({ default: false })
  deleted: boolean;

  /** Whether this profile is connected to an organization. **/
  @Prop({ default: false })
  hasOrg: boolean;

  /** The current score of this profile. **/
  @Prop({ required: true, default: 0 })
  score: number;

  /** The selected usage options. **/
  @Prop({ type: [String] })
  usage: ProfileUsage[];

  /** Module and other settings. **/
  @MixedProp({ default: {} })
  settings: Record<string, any>;

  /** Explicitly enabled features. **/
  @Prop({ type: [String] })
  enabledFeatures: string[];

  /** Explicitly disabled features. **/
  @Prop({ type: [String] })
  disabledFeatures: string[];

  /** Defines for which type of users or visitors the profile is visible. **/
  @Prop({
    type: Number,
    required: true,
    enum: getNumberEnumValues(ProfileVisibilityLevel),
    default: ProfileVisibilityLevel.Member,
  })
  visibility: ProfileVisibilityLevel;

  /** Profile role permission settings. **/
  @Prop({ type: [ProfilePermissionSettingSchema], default: [] })
  permissions: ProfilePermissionSetting[];

  @Prop({ type: [ProfileMemberGroupSchema], default: [] })
  @PropertyType([ProfileMemberGroup])
  groups: ProfileMemberGroup[];

  /** Stores all tags created by this profile. **/
  @Prop({ type: [TagSchema], default: [] })
  @PropertyType([Tag])
  tags: Tag[];

  /** The guid value is used in the frontend e.g. for avatars. **/
  @Prop({ type: String, unique: true })
  guid: string;

  /** Profile discriminator type **/
  type: ProfileType;

  /**
   * Retrieves the permission settings.
   * This function is part of the IPermissionObject interface.
   *
   * @return {IProfilePermissionSetting<TObjectId>[]} The array of permission settings.
   */
  getPermissionSettings(): IPermissionSetting[] {
    return (
      this.permissions?.map((p) => ({ ...p, groups: p.groups?.map((g) => g.toString()) })) || []
    );
  }

  /**
   * Retrieves an array of permission groups.
   * This function is part of the IPermissionObject interface.
   *
   * @returns {string[]} The array of permission groups' IDs.
   */
  getPermissionGroups(): string[] {
    return this.groups?.map((g) => g._id.toString()) || [];
  }

  /**
   * Retrieves the profile visibility level.
   *
   * @returns {ProfileVisibilityLevel} The profile visibility level.
   */
  getProfilePermissionData(): IProfilePermissionData {
    return this;
  }

  /**
   * Crates a profile for the given initial owner user.
   * If not overwritten by the given data object, this constructor sets the following defaults:
   *
   * - visibility: By default a profile is only visible by its members.
   * - oid: If no oid was set we create one, even if this profile is not connected to an organization.
   * - hasOrg: If no oid was provided, we assume this profile is not connected to an organization.
   * - locale: We fall back to the owners locale or a default locale value in the uncommon case the owner has no locale.
   * @param owner The initial owner of this profile.
   * @param obj Initial profile data.
   */
  constructor(owner: User, obj?: Partial<Profile>) {
    super(obj);

    this.ownerId = assureObjectId(owner)!;
    this.visibility ??= ProfileVisibilityLevel.Member;

    // We need to assign an oid even if this profile is not connected to an organizations for sharding and query index.
    // This OID can later be used to create an organization out of this profile
    if (!this.oid) {
      this.oid = createObjectId();
      this.hasOrg = false;
    } else {
      this.hasOrg = true;
    }

    if (!this.guid) {
      this.guid = createHash('sha256').update(createObjectId().toString()).digest('hex');
    }

    this.settings ||= {};

    this.locale ??= owner.locale || getDefaultLocale();
  }

  /**
   * Checks if this profile is of a specific type.
   * @param type The profile type to check against.
   */
  isOfType(type: ProfileType) {
    return this.type === type;
  }

  /**
   * Checks if this profile is an organization profile.
   */
  isOrganization() {
    return this.isOfType(ProfileType.Organization);
  }

  /**
   * Determines if this profile is connected to an organization.
   * Note, this will return false if the profile itself is an organization.
   */
  hasOrganization() {
    return this.hasOrg && !this.isOrganization();
  }

  /**
   * Determines if this profile is part of the given organization.
   * Note, this will return false if the profile itself is an organization profile.
   * @param oid
   */
  isProfileOfOrganization(oid: DocumentIdentity<Profile> | null | undefined) {
    if (!oid || this.isOrganization()) return false;
    return assureObjectId(oid).equals(this.oid);
  }

  /**
   * Returns a Tag instance by name or undefined if the tag does not exist within this profile.
   * @param name The tag name to search for.
   */
  getTagByName(name: string) {
    return this.tags.find((tag) => tag.name === name);
  }

  /**
   * Returns multiple tags of this profile by name.
   * @param tagNames The tag names to search for.
   */
  getTagsByName(tagNames: string[]) {
    return this.tags.filter((tag) => tagNames.includes(tag.name));
  }

  /**
   * Helper function to return an array of tag ids by name.
   * @param tagNames The tag names to search for.
   */
  getTagIdsByName(tagNames: string[]) {
    return this.getTagsByName(tagNames).map((tag) => assureObjectId(tag.id));
  }

  /**
   * Helper function to find a tag of this profile by id.
   * @param id The tag id to search for.
   */
  getTagById(id: TObjectId) {
    return this.tags.find((tag) => tag._id.equals(id));
  }

  /**
   * Helper function to find multiple tags of this profile by id.
   * @param tagIds Array of tag ids to search for.
   */
  getTagsById(tagIds: TObjectId[]) {
    return this.tags.filter((tag) => tagIds.includes(tag._id));
  }

  /**
   * Helper function which filters out newly created tags.
   */
  getNewTags() {
    return this.tags.filter((tag) => tag.isNew);
  }
}

export const ProfileSchema = SchemaFactory.createForClass(Profile);

ProfileSchema.index(
  { handle: 1 },
  { unique: true, collation: { locale: 'en', strength: 1 }, name: 'UniqueProfileHandleIndex' },
);
