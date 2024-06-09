/**
 * Defines global roles of a user or visitor.
 */
export enum UserRole {
  Admin = 'admin',
  Moderator = 'moderator',
  User = 'user',
  Visitor = 'visitor',
}

/**
 * Defines a flat hierarchy of global user roles. This is used for permissions and access rules in which a
 * role with a lower level e.g. an admin includes permissions and access rights of higher levels e.g. user.
 */
export const userRoleHierarchy = [
  UserRole.Admin,
  UserRole.Moderator,
  UserRole.User,
  UserRole.Visitor,
];

/**
 * Returns the role of the given user.
 *
 * @param {User} user - The user object. If not provided, the role of a visitor will be returned.
 * @returns {UserRole} The role of the user. If the user object is not provided, UserRole.Visitor will be returned. If the user object does not have a role assigned, UserRole.User will be returned.
 */
export function getUserRole(user?: { role: UserRole } | null) {
  if (!user) return UserRole.Visitor;
  return user.role ?? UserRole.User;
}

/**
 * Retrieves the role level of a given user.
 *
 * @param {UserModel<any>|null} user - The user object.
 * @returns {number} The role level of the user.
 */
export function getUserRoleLevel(user?: { role: UserRole } | null) {
  return getUserRoleLevelByRole(getUserRole(user));
}

/**
 * Retrieves the role level of a given user.
 *
 * @param {UserModel<any>|null} role - The user role.
 * @returns {number} The role level of the user.
 */
export function getUserRoleLevelByRole(role: UserRole) {
  const roleLevel = userRoleHierarchy.indexOf(role);
  return roleLevel < 0 ? userRoleHierarchy.indexOf(UserRole.Visitor) : roleLevel;
}

/**
 * Verifies if a user has a role level equal to or lower than the specified minRole.
 *
 * @param user
 * @param {UserRole} minRole - The minimum role level to compare against.
 * @returns {boolean} - Returns true if the user role level is equal to or higher than the minimum role level, otherwise false.
 */
export function verifyUserRoleLevel(
  user: { role: UserRole } | null | undefined,
  minRole: UserRole
) {
  return verifyUserRoleLevels(getUserRole(user), minRole);
}

/**
 * Verifies if a userRole has a role level equal to or lower than the specified minRole.
 *
 * @param userRole
 * @param {UserRole} minRole - The minimum role level to compare against.
 * @returns {boolean} - Returns true if the user role level is equal to or higher than the minimum role level, otherwise false.
 */
export function verifyUserRoleLevels(userRole: UserRole, minRole: UserRole) {
  return getUserRoleLevelByRole(userRole) <= getUserRoleLevelByRole(minRole);
}
