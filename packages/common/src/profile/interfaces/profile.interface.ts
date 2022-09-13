export enum ProfileType {
  User = 'UserProfile',
  Group = 'GroupProfile',
  Organization = 'Organization'
}

/**
 * The level a profile itself is visible and accessible by different types of user relation.
 */
export enum ProfileVisibilityLevel {
  Member, // User/Group
  Organization, // Members of related organization if there is
  User, // All users of the network
  Visitor // All users + guests
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
