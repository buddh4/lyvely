import { IProfilePermission, ProfileRelationRole } from '@/profiles/interfaces';
import { PROFILES_MODULE_ID } from '@/profiles/profiles.constants';
import { BasePermissionType } from '@/permissions';

export const ManageTagsPermission: IProfilePermission = {
  id: 'tags.permissions.manage',
  moduleId: PROFILES_MODULE_ID,
  name: 'tags.permissions.manage.name',
  description: 'tags.permissions.manage.description',
  type: BasePermissionType.Profile,
  min: ProfileRelationRole.Admin,
  max: ProfileRelationRole.Guest,
  default: ProfileRelationRole.Member,
};

export const useTagPermissions = () => ({
  Manage: ManageTagsPermission,
});

export const TagPermissions = [ManageTagsPermission];
