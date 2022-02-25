import { ICategory } from '../../category';

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

export interface IProfile {
  id: string;
  name: string;
  type: ProfileType;
  visibility: ProfileVisibilityLevel,
  score: number;
  locale: string;
  categories: ICategory[];
}