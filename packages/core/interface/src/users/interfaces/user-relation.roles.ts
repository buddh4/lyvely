/**
 * Represents the possible roles of a user (or visitor) in relation to another user.
 */
export enum UserRelationRole {
  /** The user itself. **/
  Owner = 'owner',
  /** A friend of the user. **/
  Friend = 'friend',
  /** A contact of the user. **/
  Contact = 'contact',
  /** A follower of the user. **/
  Follower = 'follower',
  /** An authenticated user. **/
  User = 'user',
  /** An unauthenticated visitor. **/
  Visitor = 'visitor',
}

/**
 * Defines a flat hierarchy of user relation roles. This is used for permissions and access rules in which a
 * role with a lower level e.g. a friend includes permissions and access rights of higher levels e.g. user.
 */
export const userRelationRoleHierarchy = [
  UserRelationRole.Owner,
  UserRelationRole.Friend,
  UserRelationRole.Contact,
  UserRelationRole.Follower,
  UserRelationRole.User,
  UserRelationRole.Visitor,
];
