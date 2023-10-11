import { App } from 'vue';
import { IModule } from './module.interface';

export interface IModuleImport {
  default: () => IModule;
}

const modulesMap: Map<string, IModule> = new Map();

export interface IModuleLoaderOptions {
  import?: () => Record<string, Promise<IModuleImport> | (() => Promise<IModuleImport>)>;
}

export async function importModules(
  modules: Record<string, Promise<IModuleImport> | (() => Promise<IModuleImport>)>,
): Promise<IModule[]> {
  const promises: Promise<IModule>[] = [];
  //const allImports = options.import ? [...modulesImport, ...options.import()] : modulesImport;
  for (const path in modules) {
    const moduleImport = modules[path];
    const importPromise = typeof moduleImport === 'function' ? moduleImport() : moduleImport;
    promises.push(
      importPromise.then((moduleInitializer: IModuleImport) => {
        return importModule(moduleInitializer);
      }),
    );
  }

  return Promise.all(promises);
}

export function importModule(moduleImport: IModuleImport) {
  const module = moduleImport.default();
  return registerModule(module);
}

export function registerModules(...modules: IModule[]) {
  modules.forEach((module) => registerModule(module));
}

export function registerModule(module: IModule) {
  console.debug(`Register module ${module.getId()}`);
  if (module.init) {
    module.init();
  }
  modulesMap.set(module.getId(), module);
  return module;
}

export function installModules(app: App) {
  getModules().forEach((m) => installModule(app, m));
}

function installModule(app: App, module: IModule) {
  console.debug(`Install module ${module.getId()}`);
  if (module.install) {
    module.install(app);
  }
}

export function getModules(): IModule[] {
  return Array.from(modulesMap.values());
}

export function getModule(id: string): IModule | undefined {
  return modulesMap.get(id);
}
