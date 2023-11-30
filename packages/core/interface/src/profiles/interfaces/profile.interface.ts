export enum ProfileType {
  User = 'user',
  Group = 'group',
  Organization = 'organization',
}

/**
 * The level a profile itself is visible and accessible by different types of user relation.
 */
export enum ProfileVisibilityLevel {
  Member, // User/Group
  Organization, // Members of related organization if there is
  User, // All users of the network
  Visitor, // All users + guests
}
