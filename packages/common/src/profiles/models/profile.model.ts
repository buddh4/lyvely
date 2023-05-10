import { Exclude, Expose, Type } from 'class-transformer';
import { BaseModel, DocumentModel } from '@/models';
import { ProfileType, ProfileVisibilityLevel } from '../interfaces';
import { IsArray, IsEnum, IsInt, IsOptional, IsString, Length, Min } from 'class-validator';
import { TagModel } from '@/tags';

export const MIN_PROFILE_NAME_LENGTH = 1;
export const MAX_PROFILE_NAME_LENGTH = 100;

export const MAX_PROFILE_DESCRIPTION_LENGTH = 200;

@Expose()
export class ProfileInfoModel extends BaseModel<ProfileInfoModel> {
  pid: string;
  imageGuid?: string;
  name: string;
}

@Exclude()
export class ProfileModel extends DocumentModel<ProfileModel> {
  @Expose()
  @IsString()
  @Length(MIN_PROFILE_NAME_LENGTH, MAX_PROFILE_NAME_LENGTH)
  name: string;

  @Expose()
  @IsOptional()
  @IsString()
  description?: string;

  @Expose()
  @IsInt()
  @Min(0)
  score: number;

  @Expose()
  @IsEnum(ProfileType)
  type: ProfileType;

  @Expose()
  @IsEnum(ProfileVisibilityLevel)
  visibility: number;

  @Expose()
  @IsString()
  locale: string;

  @Expose()
  @IsString()
  @IsOptional()
  guid?: string;

  @Expose()
  @Type(() => TagModel)
  @IsArray()
  tags: TagModel[];
}

export enum ProfileUsage {
  Business = 'Business',
  Private = 'Private',
  Health = 'Health',
  School = 'School',
  Family = 'Family',
  Improvement = 'Improvement',
}

export enum BaseUserProfileRelationType {
  Membership = 'Membership',
}

/**
 * Defines the role a profile member can have.
 */
export enum BaseMembershipRole {
  Owner = 'owner',
  Admin = 'admin',
  Moderator = 'moderator',
  Member = 'member',
  Guest = 'guest',
}

/**
 * Defines the possible relations a user or visitor can have with a profile.
 */
export enum BaseProfileRelationRole {
  Owner = 'owner',
  Admin = 'admin',
  Moderator = 'moderator',
  Member = 'member',
  Guest = 'guest',
  Organization = 'organization',
  InvitedMember = 'member_invited',
  RequestedMember = 'member_requested',
  Follower = 'follower',
  User = 'user',
  Visitor = 'visitor',
}

const multiUserProfiles = [ProfileType.Group, ProfileType.Organization];

export function isMultiUserProfile(modelOrType?: ProfileModel | ProfileType) {
  const type = modelOrType instanceof ProfileModel ? modelOrType.type : modelOrType;
  return type && multiUserProfiles.includes(type);
}
