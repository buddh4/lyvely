import { CanActivate, ExecutionContext, Inject } from '@nestjs/common';
import { Request } from 'express';
import { Reflector } from '@nestjs/core';
import { ContentService } from '../services';
import { ProfileContentRequest } from '../types';
import { isValidObjectId, Type } from '@lyvely/common';
import { Content, ProfileContentContext } from '../schemas';
import {
  CONTENT_TYPE_KEY,
  CONTENT_ID_PARAM_KEY,
  CONTENT_DEFAULT_ID_PARAM_KEY,
} from '../content.constants';

/**
 * If the request contains a cid parameter, this guard will try to fetch and validate the given content id
 * and if valid, set the content to `request.content`.
 *
 * By default, this guard only assures there is a valid cid present in the request and that this cid is related with
 * a content of the requested profile.
 *
 * Subclasses may add additional access checks by overwriting `canActivateContent`.
 *
 * Other access checks can be applied on controller level by adding policies to the endpoint.
 */
export abstract class AbstractContentGuard<C extends Content = Content> implements CanActivate {
  @Inject()
  protected reflector: Reflector;

  @Inject()
  protected contentService: ContentService;

  abstract canActivateContent(
    profileContentContext: ProfileContentContext<C>,
    context: ExecutionContext,
  ): Promise<boolean>;

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<ProfileContentRequest<C>>();
    const contentId = getContentIdFromRequest(request, context, this.reflector);
    const { profile, context: profileContentContext } = request;

    if (!isValidObjectId(contentId)) return false;

    const content = await this.contentService.findContentByProfileAndId(profile, contentId);

    if (!content) return false;

    request.content = profileContentContext.content = content as C;

    return (
      validateContentTypeFromContext(content, context, this.reflector) &&
      (await this.canActivateContent(profileContentContext, context))
    );
  }
}

function validateContentTypeFromContext(
  content: Content,
  context: ExecutionContext,
  reflector: Reflector,
) {
  const contentType = getContentTypeFromContext(context, reflector);

  if (!contentType) return true;

  if (typeof contentType === 'string') {
    return content.type === contentType;
  }

  if (contentType instanceof Function) {
    return content instanceof contentType;
  }

  return false;
}

function getContentTypeFromContext(context: ExecutionContext, reflector: Reflector) {
  return reflector.getAllAndOverride<string | Type<Content>>(CONTENT_TYPE_KEY, [
    context.getHandler(),
    context.getClass(),
  ]);
}

function getContentIdFromRequest(
  request: Request,
  context: ExecutionContext,
  reflector: Reflector,
): string {
  const paramName = getContentIdParamFromContext(context, reflector);
  return request.params[paramName] || (request.query[paramName] as string);
}

function getContentIdParamFromContext(context: ExecutionContext, reflector: Reflector) {
  return (
    reflector.getAllAndOverride<string>(CONTENT_ID_PARAM_KEY, [
      context.getHandler(),
      context.getClass(),
    ]) || CONTENT_DEFAULT_ID_PARAM_KEY
  );
}
