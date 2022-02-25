import { ExecutionContext, Injectable } from '@nestjs/common';
import { ModuleRef, Reflector } from '@nestjs/core';
import { Policy, PolicyHandler } from '../interfaces/policy.interface';
import { PolicyContext } from '../guards/policy-context';

@Injectable()
export class PolicyService {
  constructor(private reflector: Reflector, private moduleRef: ModuleRef) {}

  async check(executionContext: ExecutionContext, handler: PolicyHandler<any>): Promise<boolean> {
    return this.checkEvery(executionContext, handler);
  }

  async checkEvery(executionContext: ExecutionContext, ...policies: PolicyHandler<any>[]): Promise<boolean> {
    if(!policies?.length) {
      return true;
    }

    const context = new PolicyContext(executionContext, this.reflector, this.moduleRef);
    const promises = policies.map((handler) => this.runHandler(handler, context));
    return !(await Promise.all(promises)).includes(false);
  }

  async checkSome(executionContext: ExecutionContext, ...policies: PolicyHandler<any>[]): Promise<boolean> {
    if(!policies?.length) {
      return true;
    }

    const context = new PolicyContext(executionContext, this.reflector, this.moduleRef);
    const promises = policies.map((handler) => this.runHandler(handler, context));
    return (await Promise.all(promises)).includes(true);
  }

  private async runHandler(handler: PolicyHandler<any>, context: PolicyContext): Promise<boolean> {
    const policy = <Policy<any>> (handler instanceof Function ? this.moduleRef.get(handler,  { strict: false }) : handler);
    return policy.validate(context);
  }

}