import {
  BasePermissionType,
  GlobalPermissionRole,
  type IGlobalPermission,
  PERMISSIONS_MODULE_ID,
} from '../../permissions';

export const CreateOrganizationProfilePermission: IGlobalPermission = {
  id: 'create-organization-profile-permission',
  moduleId: PERMISSIONS_MODULE_ID,
  name: 'profiles.permissions.create-organization-profile.name',
  description: 'profiles.permissions.create-organization-profile.description',
  type: BasePermissionType.Global,
  min: GlobalPermissionRole.Admin,
  max: GlobalPermissionRole.User,
  default: GlobalPermissionRole.Moderator,
};
