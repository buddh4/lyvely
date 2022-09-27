import { Exclude, Expose, Type } from 'class-transformer';
import { DocumentModel } from '@/models';
import { ProfileType, ProfileVisibilityLevel } from '../interfaces';
import { IsArray, IsEnum, IsInt, IsOptional, IsString, Length, Min } from 'class-validator';
import { TagModel } from '@/tags';

export const MIN_PROFILE_NAME_LENGTH = 1;
export const MAX_PROFILE_NAME_LENGTH = 100;

export const MAX_PROFILE_DESCRIPTION_LENGTH = 200;

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
  imageHash?: string;

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
  Improvement = 'Improvement'
}

export enum BaseUserProfileRelationType {
  Membership = 'Membership',
}

export enum BaseMembershipRole {
  Owner = 'owner',
  Member = 'member',
  Moderator = 'moderator',
  Admin = 'admin',
}

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
  Visitor = 'visitor'
}

const multiUserProfiles = [ProfileType.Group, ProfileType.Organization];

export function isMultiUserProfile(modelOrType?: ProfileModel|ProfileType) {
  const type = modelOrType instanceof ProfileModel ? modelOrType.type : modelOrType;
  return type && multiUserProfiles.includes(type);
}
