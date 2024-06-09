import {
  BasePermissionType,
  UserRole,
  type IGlobalPermission,
  PERMISSIONS_MODULE_ID,
} from '@/permissions';

export const CreateUserProfilePermission: IGlobalPermission = {
  id: 'create-private-profile',
  moduleId: PERMISSIONS_MODULE_ID,
  name: 'profiles.permissions.create-private-profile.name',
  description: 'profiles.permissions.create-private-profile.description',
  type: BasePermissionType.Global,
  min: UserRole.Admin,
  max: UserRole.User,
  default: UserRole.User,
};
