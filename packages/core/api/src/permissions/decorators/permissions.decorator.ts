import { SetMetadata } from '@nestjs/common';
import { META_PERMISSIONS_SOME, META_PERMISSIONS_STRICT } from '@/profiles/profiles.constants';

export const StrictPermissions = (...permissions: string[]) =>
  SetMetadata(META_PERMISSIONS_STRICT, permissions);
export const Permissions = (...permissions: string[]) =>
  SetMetadata(META_PERMISSIONS_SOME, permissions);
