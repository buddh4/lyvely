export class ModuleAppConfigAssemblyEvent {
  private readonly config: { [k: string]: object };

  constructor(config: { [k: string]: object }) {
    this.config = config;
  }

  setModuleConfig(moduleId: string, config: object) {
    this.config[moduleId] = config;
  }
}
