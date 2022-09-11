export enum ProfileType {
  User,
  Group,
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
