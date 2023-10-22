/**
 * Defines the possible relations a user or visitor can have with a profile.
 */
export enum ProfileRelationRole {
  Owner = 'owner',
  Admin = 'admin',
  Moderator = 'moderator',
  Member = 'member',
  Guest = 'guest',
  Organization = 'organization',
  Follower = 'follower',
  User = 'user',
  Visitor = 'visitor',
}

/**
 * Defines a flat hierarchy of profile relation roles. This is used for permissions and access rules in which a
 * role with a lower level e.g. an admin includes permissions and access rights of higher levels e.g. members.
 *
 * The following roles are available:
 *
 * - Owner: An owner of the profile has is granted all permissions on this profile
 * - Admin: An admin of the profile has is granted most permissions
 * - Moderator: A moderator has extended permissions required to moderate a profile
 * - Member: A normal member of the profile
 * - Guest: A guest user is similar to a member without being a full member of the profile
 * - Organization: A member of the organization owning the profile
 * - Follower: A follower of a profile
 * - User: A authenticated user without any special relation to the profile
 * - Visitor: A non authenticated user
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
