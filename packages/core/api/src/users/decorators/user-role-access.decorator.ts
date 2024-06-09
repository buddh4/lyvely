import { SetMetadata } from '@nestjs/common';
import { META_USER_ROLE_ACCESS } from '../users.constants';
import { UserRole } from '@lyvely/interface';

export const UserRoleAccess = (role: UserRole) => SetMetadata(META_USER_ROLE_ACCESS, role);
