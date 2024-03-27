import {
  BasePermissionType,
  GlobalPermissionRole,
  type IGlobalPermission,
  PERMISSIONS_MODULE_ID,
} from '../../permissions';

export const CreateGroupProfilePermission: IGlobalPermission = {
  id: 'create-group-profile-permission',
  moduleId: PERMISSIONS_MODULE_ID,
  name: 'profiles.permissions.create-group-profile.name',
  description: 'profiles.permissions.create-group-profile.description',
  type: BasePermissionType.Global,
  min: GlobalPermissionRole.Admin,
  max: GlobalPermissionRole.User,
  default: GlobalPermissionRole.User,
};
