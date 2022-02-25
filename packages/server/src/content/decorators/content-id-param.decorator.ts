import { ExecutionContext, SetMetadata } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Request } from 'express';

export const CONTENT_ID_PARAM_KEY = 'contentIdParam';
export const DEFAULT_CONTENT_ID_PARAM_KEY = 'cid';
export const ContentIdParam = (contentIdParamName: string) => SetMetadata(CONTENT_ID_PARAM_KEY, contentIdParamName);

export function getContentIdFromRequest(request: Request, context: ExecutionContext, reflector: Reflector) {
  return request.params[getContentIdParamFromContext(context, reflector)];
}

export function getContentIdParamFromContext(context: ExecutionContext, reflector: Reflector) {
  return reflector.getAllAndOverride<string>(CONTENT_ID_PARAM_KEY, [context.getHandler(), context.getClass()])
    || DEFAULT_CONTENT_ID_PARAM_KEY;
}