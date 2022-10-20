import { ContextType, ExecutionContext, Type } from '@nestjs/common';
import { HttpArgumentsHost, RpcArgumentsHost, WsArgumentsHost } from '@nestjs/common/interfaces';
import { User } from '@/users';
import { ProfileContext, Profile } from '@/profiles';

interface ITestExecutionContextOptions {
  params?: Record<string, string>;
  query?: Record<string, string>;
  user?: User;
  profile?: Profile;
  profileRelations?: ProfileContext;
  class?: any;
  // eslint-disable-next-line @typescript-eslint/ban-types
  handler?: Function;
}

function emptyFunc() {
  return;
}

class TestContextClass {
  emptyFunc() {
    return;
  }
}

export class TestExecutionContext implements ExecutionContext {
  request: any;

  constructor(private options: ITestExecutionContextOptions) {}

  getArgByIndex<T = any>(): T {
    return undefined;
  }

  getArgs<T = any[]>(): T {
    return undefined;
  }

  getClass<T = any>(): Type<T> {
    return this.options.class || new TestContextClass();
  }

  // eslint-disable-next-line @typescript-eslint/ban-types
  getHandler(): Function {
    return this.options.handler || emptyFunc;
  }

  getType<TContext = ContextType>(): TContext {
    return undefined;
  }

  switchToHttp(): HttpArgumentsHost {
    return <any>{
      getRequest: () => {
        if (!this.request) {
          this.request = {
            params: this.options.params || {},
            query: this.options.query || {},
            user: this.options.user,
            profile: this.options.profile,
            profileRelations: this.options.profileRelations,
          };
        }
        return this.request;
      },
    };
  }

  switchToRpc(): RpcArgumentsHost {
    return undefined;
  }

  switchToWs(): WsArgumentsHost {
    return undefined;
  }
}

export function createTestExecutionContext(options: ITestExecutionContextOptions = {}) {
  return new TestExecutionContext(options);
}
