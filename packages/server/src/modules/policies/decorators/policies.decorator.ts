import { IPolicy, PolicyHandler } from '../interfaces/policy.interface';
import { ExecutionContext, SetMetadata, Type } from '@nestjs/common';
import { Reflector } from '@nestjs/core';

export const CHECK_POLICIES_KEY = 'check_policy';
export const Policies = (...handlers: Type<IPolicy<any>>[]) => SetMetadata(CHECK_POLICIES_KEY, handlers);

export function getPolicyHandlerFromContext(context: ExecutionContext, reflector: Reflector) {
  return (
    reflector.getAllAndOverride<PolicyHandler<any>[]>(CHECK_POLICIES_KEY, [context.getHandler(), context.getClass()]) ||
    []
  );
}
