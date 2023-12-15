import { ExecutionContext, SetMetadata } from '@nestjs/common';
import { Reflector } from '@nestjs/core';

export const PERMISSIONS_KEY_STRICT = 'permissions_strict';
export const PERMISSIONS_KEY_SOME = 'permissions_some';

export const StrictPermissions = (...permissions: string[]) =>
  SetMetadata(PERMISSIONS_KEY_STRICT, permissions);
export const Permissions = (...permissions: string[]) =>
  SetMetadata(PERMISSIONS_KEY_SOME, permissions);

export function getStrictPermissionsFromContext(context: ExecutionContext, reflector: Reflector) {
  return (
    reflector.getAllAndMerge<string[]>(PERMISSIONS_KEY_STRICT, [
      context.getHandler(),
      context.getClass(),
    ]) || []
  );
}

export function getPermissionsFromContext(context: ExecutionContext, reflector: Reflector) {
  return (
    reflector.getAllAndMerge<string[]>(PERMISSIONS_KEY_SOME, [
      context.getHandler(),
      context.getClass(),
    ]) || []
  );
}
