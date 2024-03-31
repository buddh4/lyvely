/**
 * Represents the possible roles of a user (or visitor) in relation to a profile.
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
