import { CanActivate, ExecutionContext, Inject } from '@nestjs/common';
import { Request } from 'express';
import { Reflector } from '@nestjs/core';
import { ContentService } from '../services';
import { ProfileContentRequest } from '../controllers';
import { getContentIdFromRequest , validateContentTypeFromContext } from '../decorators';
import { isValidObjectId } from '@lyvely/common';
import { Content } from '../schemas';
import { getPolicyHandlerFromContext } from '../../policies/decorators/policies.decorator';
import { PolicyService } from '../../policies/services/policy.service';
import { UserProfileRelations } from "../../profiles";

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
  protected policyService: PolicyService

  abstract canActivateContent(profileRelations: UserProfileRelations, content: C, context: ExecutionContext): Promise<boolean>;

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = <ProfileContentRequest> context.switchToHttp().getRequest<Request>();
    const contentId = getContentIdFromRequest(request, context, this.reflector);

    if(isValidObjectId(contentId)) {
      const { profile, profileRelations } = request;
      const content = await this.contentService.findContentByProfileAndId(profile, contentId, false);

      if(!content
        || !validateContentTypeFromContext(content, context, this.reflector)
        || !await this.canActivateContent(profileRelations, <C> content, context)) {
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
