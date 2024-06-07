import { contentRoleHierarchy, ContentUserRole, IContentPermission } from '../interfaces';
import { IProfilePermission, ProfileRelationRole, ProfileVisibilityLevel } from '@/profiles';
import { IntegrityException } from '@/exceptions';
import { BasePermissionType, IPermission } from '@/permissions';
import { ContentModel } from '@/content/models';

/**
 * Returns the profile visibility level for a given role.
 * @param role
 */
export function getContentUserRoleLevel(role: ContentUserRole) {
  const roleLevel = contentRoleHierarchy.indexOf(role);
  if (roleLevel < 0) throw new IntegrityException(`Invalid content user role level ${role}`);
  return roleLevel;
}

/**
 * Returns the role level associated with the given profile visibility.
 *
 * @param {ProfileVisibilityLevel} visibility - The profile visibility level.
 * @returns {number} - The role level associated with the profile visibility.
 * @throws {IntegrityException} - If the given profile visibility level is invalid.
 */
export function getContentUserRoleLevelByProfileVisibility(
  visibility: ProfileVisibilityLevel
): number {
  switch (visibility) {
    case ProfileVisibilityLevel.Member:
      // Guest is a special kind of member
      return getContentUserRoleLevel(ContentUserRole.Guest);
    case ProfileVisibilityLevel.Organization:
      return getContentUserRoleLevel(ContentUserRole.Organization);
    case ProfileVisibilityLevel.Follower:
      return getContentUserRoleLevel(ContentUserRole.Follower);
    case ProfileVisibilityLevel.User:
      return getContentUserRoleLevel(ContentUserRole.User);
    case ProfileVisibilityLevel.Visitor:
      return getContentUserRoleLevel(ContentUserRole.Visitor);
    default:
      throw new IntegrityException(`Invalid profile visibility level: ${visibility}`);
  }
}

/**
 * Verifies if a userRole has a role level equal to or lower than the specified minRole.
 *
 * @param {ProfileRelationRole} userRole - The user's current role.
 * @param {ProfileRelationRole} minRole - The minimum role required.
 *
 * @return {boolean} - True if the userRole has a role level equal to or lower than the minRole, otherwise false.
 */
export function verifyContentRoleLevel(userRole: ContentUserRole, minRole: ContentUserRole) {
  return getContentUserRoleLevel(userRole) <= getContentUserRoleLevel(minRole);
}

/**
 * Checks if the given permission is a content permission.
 *
 * @param {IPermission<any, any>} permission - The permission to check.
 * @return {boolean} - Returns true if the permission is a content permission, otherwise returns false.
 */
export function isContentPermission(
  permission: IPermission<any, any>
): permission is IContentPermission {
  return permission.type === BasePermissionType.Content;
}

/**
 * Helper function for creating content write permission definitions.
 *
 * A permission created with this helper will include the following default values:
 *
 *  - id: content.${type}.write (should not be changed)
 *  - moduleId: <moduleId>
 *
 *  - min: ContentUserRole.Manager
 *  - max: ContentUserRole.Guest
 *  - default: ContentUserRole.Author
 *
 *  - name: <moduleId>.permissions.<type>.write.name
 *  - description: <moduleId>.permissions.<type>.write.description
 *  - type: BasePermissionType.Content
 *
 * @param type
 * @param moduleId
 * @param feature
 * @param options
 */
export function createContentWritePermission(
  type: string,
  moduleId: string,
  feature?: string,
  options?: Partial<IContentPermission>
): IContentPermission {
  return {
    min: ContentUserRole.Manager,
    max: ContentUserRole.Guest,
    default: ContentUserRole.Author,
    name: `${moduleId.toLowerCase()}.permissions.${type.toLowerCase()}.write.name`,
    description: `${moduleId.toLowerCase()}.permissions.${type.toLowerCase()}.write.description`,
    ...options,
    id: getContentWritePermissionId(type),
    feature,
    moduleId,
    type: BasePermissionType.Content,
  };
}

/**
 * Returns the write permission ID for the specified content type.
 * @return {string} The write permission ID for the specified content type.
 * @param typeOrContent
 */
export function getContentWritePermissionId(typeOrContent: string | ContentModel) {
  const type = typeof typeOrContent === 'string' ? typeOrContent : typeOrContent.type;
  return `content.${type.toLowerCase()}.write`;
}

/**
 * Helper function for creating content delete permission definitions.
 *
 * A permission created with this helper will include the following default values:
 *
 *  - id: content.${type}.delete (should not be changed)
 *  - moduleId: <moduleId>
 *
 *  - min: ContentUserRole.Manager
 *  - max: ContentUserRole.Guest
 *  - default: ContentUserRole.Author
 *
 *  - name: <moduleId>.permissions.<type>.delete.name
 *  - description: <moduleId>.permissions.<type>.delete.description
 *  - type: BasePermissionType.Content
 *
 * @param type
 * @param moduleId
 * @param feature
 * @param options
 */
export function createContentDeletePermission(
  type: string,
  moduleId: string,
  feature?: string,
  options?: Partial<IContentPermission>
): IContentPermission {
  return {
    min: ContentUserRole.Manager,
    max: ContentUserRole.Guest,
    default: ContentUserRole.Author,
    name: `${moduleId.toLowerCase()}.permissions.${type.toLowerCase()}.delete.name`,
    description: `${moduleId.toLowerCase()}.permissions.${type.toLowerCase()}.delete.description`,
    ...options,
    id: getContentDeletePermissionId(type),
    feature,
    moduleId,
    type: BasePermissionType.Content,
  };
}

/**
 * Returns the write permission ID for the specified content type.
 * @return {string} The write permission ID for the specified content type.
 * @param typeOrContent
 */
export function getContentDeletePermissionId(typeOrContent: string | ContentModel) {
  const type = typeof typeOrContent === 'string' ? typeOrContent : typeOrContent.type;
  return `content.${type.toLowerCase()}.delete`;
}

/**
 * Helper function for creating content delete permission definitions.
 *
 * A permission created with this helper will include the following default values:
 *
 *  - id: content.${type}.manage (should not be changed)
 *  - moduleId: <moduleId>
 *
 *  - min: ContentUserRole.Manager
 *  - max: ContentUserRole.Member
 *  - default: ContentUserRole.Author
 *
 *  - name: <moduleId>.permissions.<type>.manage.name
 *  - description: <moduleId>.permissions.<type>.manage.description
 *  - type: BasePermissionType.Content
 *
 * @param type
 * @param moduleId
 * @param feature
 * @param options
 */
export function createContentManagePermission(
  type: string,
  moduleId: string,
  feature?: string,
  options?: Partial<IContentPermission>
): IContentPermission {
  return {
    min: ContentUserRole.Manager,
    max: ContentUserRole.Member,
    default: ContentUserRole.Author,
    name: `${moduleId.toLowerCase()}.permissions.${type.toLowerCase()}.manage.name`,
    description: `${moduleId.toLowerCase()}.permissions.${type.toLowerCase()}.manage.description`,
    ...options,
    id: getContentManagePermissionId(type),
    feature,
    moduleId,
    type: BasePermissionType.Content,
  };
}

/**
 * Returns the manage permission ID for the specified content type.
 * @return {string} The write permission ID for the specified content type.
 * @param typeOrContent
 */
export function getContentManagePermissionId(typeOrContent: string | ContentModel) {
  const type = typeof typeOrContent === 'string' ? typeOrContent : typeOrContent.type;
  return `content.${type.toLowerCase()}.manage`;
}

/**
 * Helper function for creating content create permission definitions.
 *
 * A permission created with this helper will include the following default values:
 *
 *  - id: content.${type}.create (should not be changed)
 *  - moduleId: <moduleId>
 *
 *  - min: ProfileRelationRole.Admin
 *  - max: ProfileRelationRole.User
 *  - default: ProfileRelationRole.Member
 *
 *  - name: <moduleId>.permissions.<type>.create.name
 *  - description: <moduleId>.permissions.<type>.create.description
 *  - type: BasePermissionType.Profile
 *
 *
 * @param type
 * @param moduleId
 * @param feature
 * @param options
 */
export function createContentCreatePermission(
  type: string,
  moduleId: string,
  feature?: string,
  options?: Partial<Omit<IProfilePermission, 'id' | 'moduleId'>>
): IProfilePermission {
  return {
    min: ProfileRelationRole.Admin,
    max: ProfileRelationRole.User,
    default: ProfileRelationRole.Member,
    name: `${moduleId.toLowerCase()}.permissions.${type.toLowerCase()}.create.name`,
    description: `${moduleId.toLowerCase()}.permissions.${type.toLowerCase()}.create.description`,
    ...options,
    id: getContentCreatePermissionId(type),
    feature,
    moduleId,
    type: BasePermissionType.Profile,
  };
}

/**
 * Returns the write permission ID for the specified content type.
 * @return {string} The write permission ID for the specified content type.
 * @param typeOrContent
 */
export function getContentCreatePermissionId(typeOrContent: string | ContentModel) {
  const type = typeof typeOrContent === 'string' ? typeOrContent : typeOrContent.type;
  return `content.${type.toLowerCase()}.create`;
}

/**
 * Creates content permissions for a given type, module ID, feature, and options.
 * @param {string} type - The type of the content.
 * @param {string} moduleId - The module ID of the content.
 * @param {string} feature - The feature of the content.
 * @param {Object} [options] - Optional configuration options.
 * @param {Partial<Omit<IProfilePermission, 'id' | 'moduleId'>>} [options.create] - Partial profile permission configuration for create operation.
 * @param {Partial<Omit<IContentPermission, 'id' | 'moduleId'>>} [options.manage] - Partial content permission configuration for manage operation.
 * @param {Partial<Omit<IContentPermission, 'id' | 'moduleId'>>} [options.write] - Partial content permission configuration for write operation.
 * @param {Partial<Omit<IContentPermission, 'id' | 'moduleId'>>} [options.delete] - Partial content permission configuration for delete operation.
 * @returns {Object} - An object containing the created content permissions.
 * @property {IProfilePermission} Create - The created profile permission.
 * @property {IContentPermission} Manage - The created content permission for manage operation.
 * @property {IContentPermission} Write - The created content permission for write operation.
 * @property {IContentPermission} Delete - The created content permission for delete operation.
 */
export function createContentPermissions(
  type: string,
  moduleId: string,
  feature?: string,
  options?: {
    create?: Partial<Omit<IProfilePermission, 'id' | 'moduleId'>>;
    manage?: Partial<Omit<IContentPermission, 'id' | 'moduleId'>>;
    write?: Partial<Omit<IContentPermission, 'id' | 'moduleId'>>;
    delete?: Partial<Omit<IContentPermission, 'id' | 'moduleId'>>;
  }
): {
  Create: IProfilePermission;
  Manage: IContentPermission;
  Write: IContentPermission;
  Delete: IContentPermission;
} {
  return {
    Create: createContentCreatePermission(type, moduleId, feature, options?.create),
    Manage: createContentManagePermission(type, moduleId, feature, options?.manage),
    Write: createContentWritePermission(type, moduleId, feature, options?.write),
    Delete: createContentDeletePermission(type, moduleId, feature, options?.delete),
  };
}
