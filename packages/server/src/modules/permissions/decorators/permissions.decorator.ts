import { SetMetadata } from '@nestjs/common';

export const PERMISSIONS_KEY_STRICT = 'permissions_strict';
export const PERMISSIONS_KEY_SOME = 'permissions_some';

export const Permissions = (...permissions: string[]) => SetMetadata(PERMISSIONS_KEY_STRICT, permissions);
export const SomePermissions = (...permissions: string[]) => SetMetadata(PERMISSIONS_KEY_SOME, permissions);
