import { ProfileContext, ProtectedProfileContext } from '../models';
import {
  getProfileRoleLevel,
  IProfilePermissionSetting,
  ProfileRelationInfo,
  ProfileRelationInfos,
  ProfileRelationRole,
  ProfileWithRelationsModel,
} from '@lyvely/interface';
import { getIntersection, registerMapping } from '@lyvely/common';

/**
 * Filters out any permission information not relevant for the given user context.
 *
 * The filter is skipped for Admin and Owner roles, since they need to be able to manage
 * roles and permissions.
 *
 * @param {ProfileContext} context - The profile context.
 * @returns {ProfilePermissionSetting[]} - The sanitized permission settings.
 */
export function sanitizePermissionSettings(context: ProfileContext): IProfilePermissionSetting[] {
  const settings = context.profile.getPermissionSettings();

  if (!settings?.length) return [];

  const result: IProfilePermissionSetting[] = [];
  const role = context.getRole();

  const userRoleLevel = getProfileRoleLevel(role);

  // Do not sanitize any settings for admin and owner roles
  // TODO: If we want to enable moderators to manage users and permissions this needs to be aligned or replaced with a permission check
  if (userRoleLevel <= getProfileRoleLevel(ProfileRelationRole.Admin)) return result;

  for (const setting of settings) {
    result.push(sanitizePermissionSetting(setting, context, role));
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
  setting: IProfilePermissionSetting,
  context: ProfileContext,
  role: ProfileRelationRole,
): IProfilePermissionSetting {
  const result: IProfilePermissionSetting<any> = { ...setting };
  const userRoleLevel = getProfileRoleLevel(role);

  const settingRoleLevel = getProfileRoleLevel(setting.role);
  if (settingRoleLevel < userRoleLevel) {
    // If the user role level is not sufficient anyway, we set the strictest role
    result.role = ProfileRelationRole.Owner;
  } else {
    // If the user role level is sufficient, we set the user role as role level
    result.role = role;
  }

  const membership = context.getMembership();
  if (membership) {
    // Only include groups relevant to the user
    const memberGroups = membership.groups.map((g) => g.toString()) || [];
    const settingGroups = setting.groups || [];
    result.groups = getIntersection(memberGroups, settingGroups);
  }

  return result;
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
