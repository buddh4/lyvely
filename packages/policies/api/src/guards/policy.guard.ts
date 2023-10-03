import { CanActivate, ExecutionContext, Inject, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { getAnyPolicyHandlerFromContext, getPolicyHandlerFromContext } from '../decorators';
import { PolicyService } from '../services';

@Injectable()
export abstract class PolicyGuard implements CanActivate {
  @Inject()
  protected reflector: Reflector;

  @Inject()
  protected policyService: PolicyService;

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const policies = getPolicyHandlerFromContext(context, this.reflector);
    const anyPolicies = getAnyPolicyHandlerFromContext(context, this.reflector);

    const request = context.switchToHttp().getRequest<any>();
    const requestContext = request.context || { user: request.user };
    return !(
      await Promise.all([
        this.policyService.checkSome(requestContext, ...anyPolicies),
        this.policyService.checkEvery(requestContext, ...policies),
      ])
    ).includes(false);
  }
}
