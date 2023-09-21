import { SetMetadata } from '@nestjs/common';

export const USER_PERMISSIONS_KEY_STRICT = 'user_permissions_strict';
export const USER_PERMISSIONS_KEY_SOME = 'user_permissions_some';

export const UserPermissions = (...permissions: string[]) => SetMetadata(USER_PERMISSIONS_KEY_STRICT, permissions);
export const SomeUserPermissions = (...permissions: string[]) => SetMetadata(USER_PERMISSIONS_KEY_SOME, permissions);
