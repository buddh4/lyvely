import { OptionalUser } from '@/users';
import { GlobalPermissionRole } from '@lyvely/interface';

export interface IGlobalPermissionsService {
  verifyPermission(user: OptionalUser, permissionId: string): boolean;
  getGlobalUserRole(user: OptionalUser): GlobalPermissionRole;
}
