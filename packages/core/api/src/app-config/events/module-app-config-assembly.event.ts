import { type OptionalUserRequest, User } from '@/users';

export class ModuleAppConfigAssemblyEvent {
  public readonly req: OptionalUserRequest;
  public readonly config: { [k: string]: object };

  constructor(config: { [k: string]: object }, req: OptionalUserRequest) {
    this.config = config;
    this.req = req;
  }

  setModuleConfig<T extends Record<string, unknown> = Record<string, unknown>>(
    moduleId: string,
    config: T
  ) {
    this.config[moduleId] = config;
  }
}
