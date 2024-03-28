import { BasePermissionType, PERMISSIONS_MODULE_ID } from '../../permissions';
import type { IProfilePermission } from './interfaces';
import { ProfileRelationRole } from '../relations';
import { ProfileType } from '../core/interfaces';

export const AddProfileToOrganizationPermission: IProfilePermission = {
  id: 'add-profile-to-organization',
  moduleId: PERMISSIONS_MODULE_ID,
  name: 'profiles.permissions.add-profile-to-organization.name',
  description: 'profiles.permissions.add-profile-to-organization.description',
  type: BasePermissionType.Profile,
  profileTypes: [ProfileType.Organization],
  min: ProfileRelationRole.Admin,
  max: ProfileRelationRole.User,
  default: ProfileRelationRole.User,
};
