import { Injectable } from '@nestjs/common';
import { ModuleRef, Reflector } from '@nestjs/core';
import { getPolicyToken, IPolicy, PolicyHandler } from '../interfaces';

@Injectable()
export class PolicyService {
  constructor(
    private reflector: Reflector,
    private moduleRef: ModuleRef,
  ) {}

  async checkEvery<T = any>(context: T, ...policies: PolicyHandler<T>[]): Promise<boolean> {
    if (!policies?.length) return true;

    const promises = policies.map((handler) => this.runHandler<T>(handler, context));
    return !(await Promise.all(promises)).includes(false);
  }

  async checkSome<T = any>(context: T, ...policies: PolicyHandler<T>[]): Promise<boolean> {
    if (!policies?.length) return true;

    const promises = policies.map((handler) => this.runHandler<T>(handler, context));
    return (await Promise.all(promises)).includes(true);
  }

  private async runHandler<T = any>(handler: PolicyHandler<T>, context: T): Promise<boolean> {
    const policy = <IPolicy<T>>(
      (handler instanceof Function
        ? this.moduleRef.get(getPolicyToken(handler), { strict: false })
        : handler)
    );
    return policy.verify(context);
  }
}
