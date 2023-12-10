import { Exclude, Expose } from 'class-transformer';
import { BaseModel, PropertyType } from '@lyvely/common';
import { BaseUserProfileRelationType } from '../interfaces';
import { ProfileType } from '@/profiles/core/interfaces';

/**
 * Represents a summary of a profile relation.
 */
@Exclude()
export class ProfileRelationSummary {
  @Expose()
  type: string;

  @Expose()
  role?: string;
}

/**
 * This class serves as overview of the relations between a user (usually the active user) and a profile and
 * mainly contains a subset of the profile data.
 *
 * This is used in profile selections and overviews and does not contain detailed information.
 *
 * @class ProfileRelationInfo
 * @extends BaseModel
 */
@Exclude()
export class ProfileRelationInfo extends BaseModel<ProfileRelationInfo> {
  /** The id of the profile. **/
  @Expose()
  id: string;

  /** The name of the profile. **/
  @Expose()
  name: string;

  /** The description of the profile. **/
  @Expose()
  description: string;

  /** The current score of the profile. **/
  @Expose()
  score: number;

  /** The profile type e.g. group, user, organization. **/
  @Expose()
  type: ProfileType;

  /** The profile guid. **/
  @Expose()
  guid: string;

  /** A summary of the relation between the user and the profile. **/
  @PropertyType([ProfileRelationSummary])
  relations: ProfileRelationSummary[];

  /**
   * Checks if the user is a member of this profile.
   * @param role
   */
  isMember(role?: string): boolean {
    return !!this.relations.find(
      (relation) =>
        relation.type === BaseUserProfileRelationType.Membership &&
        (!role || relation.role === role),
    );
  }
}

/**
 * A class representing multiple profile relation infos.
 * @class
 * @extends BaseModel
 * @template TID - The type of the profile identifier.
 */
@Exclude()
export class ProfileRelationInfos extends BaseModel<ProfileRelationInfos> {
  @Expose()
  @PropertyType([ProfileRelationInfo])
  profiles: ProfileRelationInfo[];
}
