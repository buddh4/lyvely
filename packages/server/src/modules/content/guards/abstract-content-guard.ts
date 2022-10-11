import { CanActivate, ExecutionContext, Inject } from '@nestjs/common';
import { Request } from 'express';
import { Reflector } from '@nestjs/core';
import { ContentService } from '../services';
import { ProfileContentRequest } from '../types';
import { isValidObjectId } from '@lyvely/common';
import { Content } from '../schemas';
import { getPolicyHandlerFromContext } from '../../policies/decorators/policies.decorator';
import { PolicyService } from '../../policies/services/policy.service';
import { ProfileContext } from '../../profiles';
import { Type } from '@nestjs/common/interfaces/type.interface';

export const CONTENT_ID_PARAM_KEY = 'contentIdParam';
export const DEFAULT_CONTENT_ID_PARAM_KEY = 'cid';
export const CONTENT_TYPE_KEY = 'contentType';

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

  @Inject()
  protected policyService: PolicyService;

  abstract canActivateContent(
    profileRelations: ProfileContext,
    content: C,
    context: ExecutionContext,
  ): Promise<boolean>;

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = <ProfileContentRequest>context.switchToHttp().getRequest<Request>();
    const contentId = getContentIdFromRequest(request, context, this.reflector);

    if (isValidObjectId(contentId)) {
      const { profile, profileRelations } = request;
      const content = await this.contentService.findContentByProfileAndId(profile, contentId, false);

      if (
        !content ||
        !validateContentTypeFromContext(content, context, this.reflector) ||
        !(await this.canActivateContent(profileRelations, <C>content, context))
      ) {
        return false;
      }

      request.content = content;
    }

    return this.validateContentPolicies(context);
  }

  private async validateContentPolicies(context: ExecutionContext) {
    return this.policyService.checkEvery(context, ...getPolicyHandlerFromContext(context, this.reflector));
  }
}

function validateContentTypeFromContext(content: Content, context: ExecutionContext, reflector: Reflector) {
  const contentType = getContentTypeFromContext(context, reflector);

  if (!contentType) {
    return true;
  }

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

function getContentIdFromRequest(request: Request, context: ExecutionContext, reflector: Reflector): string {
  const name = getContentIdParamFromContext(context, reflector);
  return request.params[name] || (request.query[name] as string);
}

function getContentIdParamFromContext(context: ExecutionContext, reflector: Reflector) {
  return (
    reflector.getAllAndOverride<string>(CONTENT_ID_PARAM_KEY, [context.getHandler(), context.getClass()]) ||
    DEFAULT_CONTENT_ID_PARAM_KEY
  );
}
