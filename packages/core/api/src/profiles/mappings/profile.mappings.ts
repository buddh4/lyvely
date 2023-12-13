import { ProfileContext, ProtectedProfileContext } from '../models';
import {
  getPermission,
  getProfileRoleLevel,
  IProfilePermissionSetting,
  isProfilePermission,
  ProfileRelationInfo,
  ProfileRelationInfos,
  ProfileRelationRole,
  ProfileWithRelationsModel,
  verifyProfileRoleLevel,
} from '@lyvely/interface';
import { getIntersection, registerMapping } from '@lyvely/common';
import { ProfilePermissionSetting } from '@/profiles/schemas';

/**
 * Filters out any permission information not relevant for the given user context.
 *
 * The filter is skipped for Admin and Owner roles, since they need to be able to manage
 * roles and permissions.
 *
 * @param {ProfileContext} context - The profile context.
 * @returns {ProfilePermissionSetting[]} - The sanitized permission settings.
 */
export function sanitizePermissionSettings(
  context: ProfileContext,
): IProfilePermissionSetting<any>[] {
  const settings = context.profile.permissions;

  if (!settings?.length) return [];

  const result: ProfilePermissionSetting[] = [];
  const userRole = context.getRole();

  // Do not sanitize any settings for admin and owner roles
  // TODO: If we want to enable moderators to manage users and permissions this needs to be aligned or replaced with a permission check
  if (verifyProfileRoleLevel(userRole, ProfileRelationRole.Admin)) {
    return context.profile.permissions;
  }

  for (const setting of settings) {
    const sanitizedSetting = sanitizePermissionSetting(setting, context, userRole);
    if (sanitizedSetting) result.push(sanitizedSetting);
  }

  return result;
}

/**
 * Sanitizes a permission setting based on the user's role and context.
 *
 * This function will
 *  - Set the permission role to Owner if the user has not the sufficient role level.
 *  - Set the permission role to the User users permission role if the users role level is sufficient.
 *  - Only set the intersection of user relation groups and permission setting groups.
 *
 * @param {IProfilePermissionSetting} setting - The permission setting to sanitize.
 * @param {ProfileContext} context - The context of the user.
 * @param {ProfileRelationRole} role - The role of the user.
 * @returns {IProfilePermissionSetting} - The sanitized permission setting.
 */
function sanitizePermissionSetting(
  setting: ProfilePermissionSetting,
  context: ProfileContext,
  role: ProfileRelationRole,
): ProfilePermissionSetting | null {
  try {
    const result: ProfilePermissionSetting = new ProfilePermissionSetting(setting);

    const permission = getPermission(setting.id);
    if (!permission) return null;

    // Sanitizing content permissions is trickier, since the role depends on the content.
    if (isProfilePermission(permission)) {
      const userRoleLevel = getProfileRoleLevel(role);
      const settingRoleLevel = getProfileRoleLevel(setting.role as ProfileRelationRole);
      if (settingRoleLevel < userRoleLevel) {
        // If the user role level is not sufficient anyway, we set the strictest role
        result.role = ProfileRelationRole.Owner;
      } else {
        // If the user role level is sufficient, we set the user role as role level
        result.role = role;
      }
    }

    const membership = context.getMembership();
    if (membership) {
      // Only include groups relevant to the user
      const memberGroups = membership.groups || [];
      const settingGroups = setting.groups || [];
      result.groups = getIntersection(memberGroups, settingGroups);
    } else {
      result.groups = [];
    }

    return result;
  } catch (e) {
    console.log(e);
    return null;
  }
}

export function useProfileMappings() {
  registerMapping(ProtectedProfileContext, ProfileRelationInfo, (relations) => {
    const { id, name, description, score, type, guid } = relations.profile;

    return new ProfileRelationInfo({
      id,
      name,
      description,
      score,
      type,
      guid,
      relations: relations.relations.map(({ type, role }) => ({ type, role })),
    });
  });

  registerMapping([ProtectedProfileContext], ProfileRelationInfos, (relations) => {
    return new ProfileRelationInfos({
      profiles: relations.map((relation) => {
        const { name, description, score, type, guid, id } = relation.profile;
        return new ProfileRelationInfo({
          ...{ name, description, score, type, guid, id },
          relations: relation.relations.map(({ type, role }) => ({ type, role })),
        });
      }),
    });
  });

  registerMapping(ProfileContext, ProfileWithRelationsModel<any>, (context) => {
    const { relations, profile } = context;
    return new ProfileWithRelationsModel<any>({
      ...profile,
      permissions: sanitizePermissionSettings(context),
      userRelations: relations,
    });
  });

  registerMapping(ProtectedProfileContext, ProfileWithRelationsModel<any>, (context) => {
    const { relations, profile } = context;
    return new ProfileWithRelationsModel<any>({
      ...profile,
      permissions: sanitizePermissionSettings(context),
      userRelations: relations,
    });
  });
}
