import { CanActivate, ExecutionContext, Inject, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { getPolicyHandlerFromContext } from '../decorators';
import { PolicyService } from '../services';

@Injectable()
export abstract class PolicyGuard implements CanActivate {
  @Inject()
  protected reflector: Reflector;

  @Inject()
  protected policyService: PolicyService;

  async canActivate(context: ExecutionContext): Promise<boolean> {
    return this.policyService.checkEvery(context, ...getPolicyHandlerFromContext(context, this.reflector));
  }
}
