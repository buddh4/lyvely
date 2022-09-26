import { SetMetadata } from '@nestjs/common';
import { PROFILE_PERMISSIONS_KEY_STRICT, PROFILE_PERMISSIONS_KEY_SOME } from "../guards";

export const ProfilePermissions = (...permissions: string[]) => SetMetadata(PROFILE_PERMISSIONS_KEY_STRICT, permissions);
export const SomeProfilePermissions = (...permissions: string[]) => SetMetadata(PROFILE_PERMISSIONS_KEY_SOME, permissions);
