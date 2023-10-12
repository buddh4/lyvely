import { Exclude, Expose, Type } from 'class-transformer';
import { BaseModel, DocumentModel, TransformObjectId } from '@lyvely/common';
import { ProfileType, ProfileVisibilityLevel } from '../interfaces';
import { IsArray, IsEnum, IsInt, IsOptional, IsString, Length, Min } from 'class-validator';
import { TagModel } from './tag.model';

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
export class ProfileModel<TID = string> extends DocumentModel<ProfileModel<TID>> {
  @Expose()
  subscription?: string;

  @TransformObjectId()
  @Expose()
  oid: TID;

  @Expose()
  name: string;

  @Expose()
  description?: string;

  @Expose()
  score: number;

  @Expose()
  type: ProfileType;

  @Expose()
  visibility: number;

  @Expose()
  locale: string;

  @Expose()
  guid?: string;

  @Expose()
  @Type(() => TagModel)
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
