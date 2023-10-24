import { IPolicy, PolicyHandler } from '../interfaces';
import { ExecutionContext, SetMetadata, Type } from '@nestjs/common';
import { Reflector } from '@nestjs/core';

export const CHECK_POLICIES_KEY = 'check_policies';
export const CHECK_ANY_POLICIES_KEY = 'check_any_policies';
export const Policies = (...handlers: Type<IPolicy<any>>[]) =>
  SetMetadata(CHECK_POLICIES_KEY, handlers);

export const PolicyAny = (...handlers: Type<IPolicy<any>>[]) =>
  SetMetadata(CHECK_ANY_POLICIES_KEY, handlers);

export function getPolicyHandlerFromContext(context: ExecutionContext, reflector: Reflector) {
  return (
    reflector.getAllAndOverride<PolicyHandler<any>[]>(CHECK_POLICIES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]) || []
  );
}

export function getAnyPolicyHandlerFromContext(context: ExecutionContext, reflector: Reflector) {
  return (
    reflector.getAllAndOverride<PolicyHandler<any>[]>(CHECK_ANY_POLICIES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]) || []
  );
}
