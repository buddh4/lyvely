import { CanActivate, ExecutionContext, Inject } from '@nestjs/common';
import { Request } from 'express';
import { Reflector } from '@nestjs/core';
import { ContentService } from '../services/content.service';
import { ProfileContentRequest } from '../controllers/profile-content-request.type';
import { getContentIdFromRequest } from '../decorators/content-id-param.decorator';
import { isValidObjectId } from '@lyvely/common';
import { Content } from '../schemas/content.schema';
import { validateContentTypeFromContext } from '../decorators/content-type.decorator';
import { getPolicyHandlerFromContext } from '../../policies/decorators/policies.decorator';
import { PolicyService } from '../../policies/services/policy.service';

/**
 * If the request contains a cid parameter, this guard will try to fetch and validate the given content id
 * and if valid, set the content to `request.content`.
 *
 * Note, this guard will only fail if there is a non valid cid present in the request, therefore this guard can
 * be used on endpoints in which we do not expect a cid to be present.
 *
 * More restrictive checks should be applied by adding policies to the endpoint.
 */
export abstract class AbstractContentGuard<C extends Content = Content> implements CanActivate {

  @Inject()
  protected reflector: Reflector;

  @Inject()
  protected contentService: ContentService;

  @Inject()
  protected policyService: PolicyService

  abstract canActivateContent(context: ExecutionContext, content: C): Promise<boolean>;
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = <ProfileContentRequest> context.switchToHttp().getRequest<Request>();
    const contentId = getContentIdFromRequest(request, context, this.reflector);

    if(isValidObjectId(contentId)) {
      const content = await this.contentService.findContentById(contentId);

      if(!content
        || !validateContentTypeFromContext(content, context, this.reflector)
        || !await this.canActivateContent(context,<C> content)) {
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
