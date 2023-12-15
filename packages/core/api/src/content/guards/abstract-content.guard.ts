import { CanActivate, ExecutionContext, Inject } from '@nestjs/common';
import { Request } from 'express';
import { Reflector } from '@nestjs/core';
import { ContentService } from '../services';
import { ProfileContentRequest } from '../types';
import { DocumentNotFoundException } from '@lyvely/interface';
import { isValidObjectId, Type } from '@lyvely/common';
import { Content, ProfileContentContext } from '../schemas';
import {
  CONTENT_TYPE_KEY,
  CONTENT_ID_PARAM_KEY,
  CONTENT_DEFAULT_ID_PARAM_KEY,
} from '../content.constants';
import { BaseProfileGuard } from '@/profiles';
import { ContentPermissionsService } from '@/content/services/content-permissions.service';
import { getPermissionsFromContext, getStrictPermissionsFromContext } from '@/permissions';

/**
 * This guard will try to extract a content id, usually by :cid parameter and will add a ProfileContentContext to the
 * request and a permission check supporting the @@Permissions and @StrictPermissions decorators for global, profile and content level permissions.
 *
 * Subclasses may add additional access checks by overwriting `canActivateContent`.
 *
 * Other access checks can be applied on controller level by adding policies to the endpoint.
 */
export abstract class AbstractContentGuard<C extends Content = Content>
  extends BaseProfileGuard
  implements CanActivate
{
  @Inject()
  protected reflector: Reflector;

  @Inject()
  protected contentService: ContentService;

  @Inject()
  protected contentPermissionsService: ContentPermissionsService;

  abstract isContentRequired(): boolean;

  abstract canActivateContent(
    profileContentContext: ProfileContentContext<C>,
    context: ExecutionContext,
  ): Promise<boolean>;

  async canActivate(context: ExecutionContext): Promise<boolean> {
    if (!(await super.canActivate(context))) return false;

    const request = context.switchToHttp().getRequest<ProfileContentRequest<C>>();
    const contentId = this.getContentIdFromRequest(request, context);
    const { profile, context: profileContentContext } = request;

    if (!request.content && !contentId && this.isContentRequired()) {
      throw new DocumentNotFoundException();
    } else if (!request.content && !contentId) {
      return true;
    } else if (!request.content && !isValidObjectId(contentId)) {
      return false;
    }

    const content =
      request.content || (await this.contentService.findContentByProfileAndId(profile, contentId));

    if (!content) return false;

    request.content = profileContentContext.content = content as C;
    request.context = new ProfileContentContext({ ...request.context, content });

    await this.contentService.populateContentPolicies(request.content, request.context);

    return (
      this.verifyPermissions(request.context, context) &&
      this.validateContentTypeFromContext(content, context) &&
      (await this.canActivateContent(profileContentContext, context))
    );
  }

  getContentIdFromRequest(request: Request, context: ExecutionContext): string {
    const paramName = this.getContentIdParamFromContext(context);
    return request.params[paramName] || (request.query[paramName] as string);
  }

  validateContentTypeFromContext(content: Content, context: ExecutionContext) {
    const contentType = this.getContentTypeFromContext(context);

    if (!contentType) return true;

    if (typeof contentType === 'string') {
      return content.type === contentType;
    }

    if (contentType instanceof Function) {
      return content instanceof contentType;
    }

    return false;
  }

  verifyPermissions(contentContext: ProfileContentContext, context: ExecutionContext) {
    const strictPermissions = getStrictPermissionsFromContext(context, this.reflector);
    const permissions = getPermissionsFromContext(context, this.reflector);

    return (
      this.contentPermissionsService.verifyAnyPermission(contentContext, ...permissions) &&
      this.contentPermissionsService.verifyEveryPermission(contentContext, ...strictPermissions)
    );
  }

  getContentTypeFromContext(context: ExecutionContext) {
    return this.reflector.getAllAndOverride<string | Type<Content>>(CONTENT_TYPE_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
  }

  getContentIdParamFromContext(context: ExecutionContext) {
    return (
      this.reflector.getAllAndOverride<string>(CONTENT_ID_PARAM_KEY, [
        context.getHandler(),
        context.getClass(),
      ]) || CONTENT_DEFAULT_ID_PARAM_KEY
    );
  }
}
