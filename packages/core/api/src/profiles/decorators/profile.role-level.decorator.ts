import { ExecutionContext, SetMetadata } from '@nestjs/common';
import { ProfileRelationRole } from '@lyvely/interface';
import { Reflector } from '@nestjs/core';

export const PROFILE_ROLE_LEVEL_KEY = 'profile-role-level';

export const ProfileRoleLevel = (role: ProfileRelationRole) =>
  SetMetadata(PROFILE_ROLE_LEVEL_KEY, role);

export function getProfileRoleFromContext(context: ExecutionContext, reflector: Reflector) {
  return reflector.getAllAndOverride<ProfileRelationRole | undefined>(PROFILE_ROLE_LEVEL_KEY, [
    context.getHandler(),
    context.getClass(),
  ]);
}
