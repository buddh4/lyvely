import { ExecutionContext, SetMetadata } from '@nestjs/common';
import { Reflector } from '@nestjs/core';

export const CHECK_FEATURE_KEY = 'check_feature';
export const Feature = (...handlers: string[]) => SetMetadata(CHECK_FEATURE_KEY, handlers);

export function getFeaturesFromContext(context: ExecutionContext, reflector: Reflector) {
  return reflector.getAllAndMerge<string[]>(CHECK_FEATURE_KEY, [context.getHandler(), context.getClass()]) || [];
}
