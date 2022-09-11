import { ExecutionContext, SetMetadata } from '@nestjs/common';
import { Content } from '../schemas';
import { Type } from '@nestjs/common/interfaces/type.interface';
import { Reflector } from '@nestjs/core';

export const CONTENT_TYPE_KEY = 'contentType';
export const ContentType = (type: string|Type<Content>) => SetMetadata(CONTENT_TYPE_KEY, type);

export function getContentTypeFromContext(context: ExecutionContext, reflector: Reflector) {
  return reflector
    .getAllAndOverride<string|Type<Content>>(CONTENT_TYPE_KEY,  [context.getHandler(), context.getClass()]);
}

export function validateContentTypeFromContext(content: Content, context: ExecutionContext, reflector: Reflector) {
  const contentType = getContentTypeFromContext(context, reflector);

  if(!contentType) {
    return true;
  }

  if(typeof contentType === 'string') {
    return content.type === contentType;
  }

  if(contentType instanceof Function) {
    return content instanceof contentType;
  }

  return false;
}