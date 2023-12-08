import { ProfileRelationRole } from './profile-permission.interface';

/**
 * Defines the role a profile member can have.
 */
export enum ProfileMembershipRole {
  Owner = 'owner',
  Admin = 'admin',
  Moderator = 'moderator',
  Member = 'member',
  Guest = 'guest',
}

export const membershipToRelationRole = {
  [ProfileMembershipRole.Owner]: ProfileRelationRole.Owner,
  [ProfileMembershipRole.Admin]: ProfileRelationRole.Admin,
  [ProfileMembershipRole.Moderator]: ProfileRelationRole.Moderator,
  [ProfileMembershipRole.Member]: ProfileRelationRole.Member,
  [ProfileMembershipRole.Guest]: ProfileRelationRole.Guest,
};

export const relationToMembershipRole = {
  [ProfileRelationRole.Owner]: ProfileMembershipRole.Owner,
  [ProfileRelationRole.Admin]: ProfileMembershipRole.Admin,
  [ProfileRelationRole.Moderator]: ProfileMembershipRole.Moderator,
  [ProfileRelationRole.Member]: ProfileMembershipRole.Member,
  [ProfileRelationRole.Guest]: ProfileMembershipRole.Guest,
};
