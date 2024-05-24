import { App } from 'vue';
import { IModule } from './module.interface';
import { registerRoutes } from '@/lyvely.router';
import { registerFeatures, registerPermissions } from '@lyvely/interface';

export type IModuleInitializer = { default: () => IModule };

export type IModuleImport<TEager extends boolean | undefined = undefined> = TEager extends true
  ? IModuleInitializer
  : TEager extends false
    ? Promise<IModuleInitializer>
    : IModuleInitializer | Promise<IModuleInitializer>;

export type IModulesGlobImport<TEager extends boolean | undefined = undefined> = Record<
  string,
  IModuleImport<TEager>
>;

const modulesMap: Map<string, IModule> = new Map();

function isModuleInitializer(obj: any): obj is IModuleInitializer {
  if (typeof obj !== 'object') return false;
  return 'default' in obj && typeof obj.default === 'function';
}

export interface IModuleLoaderOptions {
  modules?: IModule[];
}

export async function importModules(
  moduleImport: IModulesGlobImport | IModuleImport,
): Promise<IModule[]> {
  if (moduleImport instanceof Promise) {
    moduleImport = await moduleImport;
  }

  if (isModuleInitializer(moduleImport)) {
    return [initializeModule(moduleImport)];
  }

  return handleGlobImport(moduleImport);
}

async function handleGlobImport(globImport: IModulesGlobImport) {
  const promises: Promise<IModule>[] = [];

  Object.keys(globImport).map((importPath) => {
    let moduleImport = globImport[importPath];

    if (!(moduleImport instanceof Promise)) {
      moduleImport = Promise.resolve(moduleImport);
    }

    promises.push(moduleImport.then((module) => initializeModule(module)));
  });

  return Promise.all(promises);
}

export function initializeModule(moduleImport: IModuleInitializer) {
  return registerModule(moduleImport.default());
}

export function registerModules(...modules: IModule[]) {
  modules.forEach((module) => registerModule(module));
}

export function registerModule(module: IModule) {
  console.debug(`Register module ${module.id}`);
  if (modulesMap.has(module.id)) {
    console.warn(`Module with id ${module.id} already registered`);
  }

  module.dependencies?.forEach((dependency) => {
    if (!modulesMap.has(dependency.id)) registerModules(dependency);
  });

  modulesMap.set(module.id, module);

  if (module.init) module.init();
  if (module.routes)
    registerRoutes(typeof module.routes === 'function' ? module.routes() : module.routes);
  if (module.features)
    registerFeatures(typeof module.features === 'function' ? module.features() : module.features);
  if (module.permissions) {
    registerPermissions(
      typeof module.permissions === 'function' ? module.permissions() : module.permissions,
    );
  }

  return module;
}

export function installModules(app: App) {
  getModules().forEach((m) => installModule(app, m));
}

function installModule(app: App, module: IModule) {
  console.debug(`Install module ${module.id}`);
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
