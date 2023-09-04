export interface IModuleMetaOptions {
  id: string;
  path: string;
  name: string;
  description: string;
}

export class ModuleMeta {
  private id: string;
  private path: string;
  private name: string;
  private description?: string;

  constructor(data: IModuleMetaOptions) {
    this.id = data.id;
    this.path = data.path;
    this.name = data.name;
    this.description = data.description;
  }

  getId() {
    return this.id;
  }

  getPath() {
    return this.path;
  }

  buildPath(path: string) {
    return this.path + path;
  }

  getName() {
    return this.name;
  }
}
