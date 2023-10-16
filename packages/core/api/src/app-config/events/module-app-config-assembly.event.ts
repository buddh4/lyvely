export class ModuleAppConfigAssemblyEvent {
  private readonly config: { [k: string]: object };

  constructor(config: { [k: string]: object }) {
    this.config = config;
  }

  setModuleConfig<T extends Record<string, unknown> = Record<string, unknown>>(
    moduleId: string,
    config: T,
  ) {
    this.config[moduleId] = config;
  }
}
