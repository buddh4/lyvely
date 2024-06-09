import {
  BasePermissionType,
  UserRole,
  type IGlobalPermission,
  PERMISSIONS_MODULE_ID,
} from '@/permissions';

export const CreateGroupProfilePermission: IGlobalPermission = {
  id: 'create-group-profile',
  moduleId: PERMISSIONS_MODULE_ID,
  name: 'profiles.permissions.create-group-profile.name',
  description: 'profiles.permissions.create-group-profile.description',
  type: BasePermissionType.Global,
  min: UserRole.Admin,
  max: UserRole.User,
  default: UserRole.User,
};
