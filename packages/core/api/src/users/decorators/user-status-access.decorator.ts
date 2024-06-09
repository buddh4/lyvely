import { SetMetadata } from '@nestjs/common';
import { META_USER_STATUS_ACCESS } from '../users.constants';
import { UserRole } from '@lyvely/interface';

export const UserStatusAccess = (role: UserRole | true) =>
  SetMetadata(META_USER_STATUS_ACCESS, role);
