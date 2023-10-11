import { App } from 'vue';
import { IModule } from './module.interface';

export interface IModuleImport {
  default: () => IModule;
}

const modulesMap: Map<string, IModule> = new Map();

const moduleInitializedPromise: Promise<IModule>[] = [];
const moduleInstalledPromise: Promise<IModule>[] = [];

export interface IModuleLoaderOptions {
  import?: () => Record<string, Promise<IModuleImport> | (() => Promise<IModuleImport>)>;
}

export async function onModulesInitialized(): Promise<IModule[]> {
  return Promise.all(moduleInitializedPromise);
}

export async function onModulesInstalled(): Promise<IModule[]> {
  return Promise.all(moduleInstalledPromise);
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

  moduleInitializedPromise.push(...promises);

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

export async function installModules(
  app: App,
  modules: Record<string, Promise<IModuleImport> | (() => Promise<IModuleImport>)>,
): Promise<IModule[]> {
  const promises: Promise<IModule>[] = [];
  //const allImports = options.import ? [...modulesImport, ...options.import()] : modulesImport;
  for (const path in modules) {
    const moduleImport = modules[path];
    const importPromise = typeof moduleImport === 'function' ? moduleImport() : moduleImport;
    promises.push(
      importPromise.then((moduleInitializer: IModuleImport) => {
        return installModule(app, moduleInitializer);
      }),
    );
  }

  moduleInstalledPromise.push(...promises);

  return Promise.all(promises);
}

function installModule(app: App, moduleImport: IModuleImport) {
  const module = moduleImport.default();
  console.debug(`Install module ${module.getId()}`);
  if (module.install) {
    module.install(app);
  }
  return module;
}

export function getModules(): IModule[] {
  return Array.from(modulesMap.values());
}

export function getModule(id: string): IModule | undefined {
  return modulesMap.get(id);
}
