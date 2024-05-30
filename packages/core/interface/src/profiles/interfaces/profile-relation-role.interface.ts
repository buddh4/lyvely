/**
 * Represents all possible roles of a user (or visitor) in relation to a profile.
 * @enum {string}
 */
export enum ProfileRelationRole {
  /** Owner of the profile. **/
  Owner = 'owner',
  /** Admin of the profile. **/
  Admin = 'admin',
  /** Moderator of the profile. **/
  Moderator = 'moderator',
  /** Simple member of the profile. **/
  Member = 'member',
  /** Guest member of the profile. **/
  Guest = 'guest',
  /** Organization member of the profiles' organization. **/
  Organization = 'organization',
  /** Follower of the profile. **/
  Follower = 'follower',
  /** An authenticated user. **/
  User = 'user',
  /** An unauthenticated visitor. **/
  Visitor = 'visitor',
}

/**
 * Each profile relation role is assigned with a specific level.
 * This enum is usually used in relation to hierarchical access or permission checks within a profile in which user access
 * is only granted if his role within a profile is less or equal a given role set by a policy or other type of rule.
 */
export enum ProfileRoleLevel {
  Owner,
  Admin,
  Moderator,
  Member,
  Guest, // External explicitly invited guests
  Organization,
  Follower,
  User, // Registered users
  Visitor, // Unregistered users
}

/**
 * Defines a flat hierarchy of profile relation roles. This is used for permissions and access checks in which a
 * profile relation role with a lower level e.g. an admin includes permissions and access rights of higher levels e.g. members.
 */
export const profileRelationRoleHierarchy = [
  ProfileRelationRole.Owner,
  ProfileRelationRole.Admin,
  ProfileRelationRole.Moderator,
  ProfileRelationRole.Member,
  ProfileRelationRole.Guest,
  ProfileRelationRole.Organization,
  ProfileRelationRole.Follower,
  ProfileRelationRole.User,
  ProfileRelationRole.Visitor,
];
