export interface IContent<TID = any> {
  id: string;
  type: string;
  title: string;
  text: string;
  visibility: number;
  archived: boolean;
  tagIds: TID[];
}

/**
 * A role is assigned with a specific content visibility level, which defines the level of visible and accessible content
 * of a given role. A role can only view content which a visibility level >= the roles visibility level.
 */
export enum ContentVisibilityLevel {
  Owner,
  Admin,
  Moderator,
  Member,
  Guest, // External explicitly invited guests
  Organization,
  User, // Registered users
  Public, // Unregistered users
}
