import {
  BasePermissionType,
  UserRole,
  type IGlobalPermission,
  PERMISSIONS_MODULE_ID,
} from '@/permissions';

export const CreateOrganizationProfilePermission: IGlobalPermission = {
  id: 'create-organization-profile',
  moduleId: PERMISSIONS_MODULE_ID,
  name: 'profiles.permissions.create-organization-profile.name',
  description: 'profiles.permissions.create-organization-profile.description',
  type: BasePermissionType.Global,
  min: UserRole.Admin,
  max: UserRole.User,
  default: UserRole.Moderator,
};
