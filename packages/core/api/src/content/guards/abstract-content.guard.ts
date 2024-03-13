import { CanActivate, ExecutionContext, Inject } from '@nestjs/common';
import { Request } from 'express';
import { Reflector } from '@nestjs/core';
import { ContentService } from '../services';
import { ProfileContentRequest } from '../types';
import { DocumentNotFoundException } from '@lyvely/interface';
import { isValidObjectId, Type } from '@lyvely/common';
import { Content, ProfileContentContext } from '../schemas';
import {
  META_CONTENT_TYPE,
  META_CONTENT_ID_PARAM,
  META_CONTENT_DEFAULT_ID_PARAM,
} from '../content.constants';
import { BaseProfileGuard, META_PERMISSIONS_SOME, META_PERMISSIONS_STRICT } from '@/profiles';
import { ContentPermissionsService } from '@/content/services/content-permissions.service';

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
  protected override reflector: Reflector;

  @Inject()
  protected contentService: ContentService;

  @Inject()
  protected contentPermissionsService: ContentPermissionsService;

  abstract isContentRequired(): boolean;

  abstract canActivateContent(
    profileContentContext: ProfileContentContext<C>,
    context: ExecutionContext,
  ): Promise<boolean>;

  override async canActivate(context: ExecutionContext): Promise<boolean> {
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
    request.context = new ProfileContentContext<any>({ ...request.context, content });

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
    const strictPermissions = this.getStrictPermissionsFromContext(context);
    const permissions = this.getPermissionsFromContext(context);

    return (
      this.contentPermissionsService.verifyAnyPermission(contentContext, ...permissions) &&
      this.contentPermissionsService.verifyEveryPermission(contentContext, ...strictPermissions)
    );
  }

  private getStrictPermissionsFromContext(context: ExecutionContext) {
    return (
      this.reflector.getAllAndMerge<string[]>(META_PERMISSIONS_STRICT, [
        context.getHandler(),
        context.getClass(),
      ]) || []
    );
  }

  private getPermissionsFromContext(context: ExecutionContext) {
    return (
      this.reflector.getAllAndMerge<string[]>(META_PERMISSIONS_SOME, [
        context.getHandler(),
        context.getClass(),
      ]) || []
    );
  }

  getContentTypeFromContext(context: ExecutionContext) {
    return this.reflector.getAllAndOverride<string | Type<Content>>(META_CONTENT_TYPE, [
      context.getHandler(),
      context.getClass(),
    ]);
  }

  getContentIdParamFromContext(context: ExecutionContext) {
    return (
      this.reflector.getAllAndOverride<string>(META_CONTENT_ID_PARAM, [
        context.getHandler(),
        context.getClass(),
      ]) || META_CONTENT_DEFAULT_ID_PARAM
    );
  }
}
