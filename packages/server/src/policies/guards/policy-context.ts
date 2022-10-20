import { ExecutionContext } from '@nestjs/common';
import { Request } from 'express';
import { ModuleRef, Reflector } from '@nestjs/core';

interface IPolicyContext {
  getExecutionContext(): ExecutionContext;
  getReflector(): Reflector;
  getModuleRef(): ModuleRef;
}

export class PolicyContext<R = Request> implements IPolicyContext {
  constructor(
    protected executionContext: ExecutionContext,
    protected reflector: Reflector,
    protected moduleRef: ModuleRef,
  ) {}

  getExecutionContext(): ExecutionContext {
    return this.executionContext;
  }

  getReflector(): Reflector {
    return this.reflector;
  }

  getModuleRef(): ModuleRef {
    return this.moduleRef;
  }

  getHandler() {
    return this.executionContext.getHandler();
  }

  getClass<T = any>() {
    return this.executionContext.getClass<T>();
  }

  getRequest(): R {
    return this.executionContext.switchToHttp().getRequest();
  }
}
