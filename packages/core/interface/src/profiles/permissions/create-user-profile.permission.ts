import {
  BasePermissionType,
  GlobalPermissionRole,
  type IGlobalPermission,
  PERMISSIONS_MODULE_ID,
} from '../../permissions';

export const CreateUserProfilePermission: IGlobalPermission = {
  id: 'create-private-profile-permission',
  moduleId: PERMISSIONS_MODULE_ID,
  name: 'profiles.permissions.create-private-profile.name',
  description: 'profiles.permissions.create-private-profile.description',
  type: BasePermissionType.Global,
  min: GlobalPermissionRole.Admin,
  max: GlobalPermissionRole.User,
  default: GlobalPermissionRole.User,
};
