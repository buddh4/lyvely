import { ITag } from '../../tags';

export enum ProfileType {
  User,
  Group,
}

/**
 * Determines if this profile supports group functionality as collaborative content
 * (e.g. UserAssignmentStrategy.PerUser)
 * @param profile
 */
export function isGroupProfile(profile: IProfile) {
  return profile.type === ProfileType.Group;
}

/**
 * The level a profile itself is visible and accessible by different types of user relation.
 */
export enum ProfileVisibilityLevel {
  Member, // User/Group
  Organization, // Members of related orga if there is
  User, // Users only
  Visitor // Users + guests
}

export interface IUserToProfileRelation {
  id: string;
  name: string;
  type: ProfileType;
  imageHash?: string;
  score: number;
  relationType: string;
  role?: string;
}

export interface IProfile {
  id: string;
  name: string;
  type: ProfileType;
  score: number;
  imageHash?: string;
  visibility: ProfileVisibilityLevel,
  locale: string;
  tags: ITag[];
}
