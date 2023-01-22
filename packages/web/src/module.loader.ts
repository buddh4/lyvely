import { App } from 'vue';
import { IModule } from '@/modules/core/modules/interfaces/module.interface';

const modulesImport = import.meta.glob<Promise<{ default: () => IModule }>>(
  './modules/**/module.ts',
);

const modules = [] as IModule[];

interface ModuleImport {
  default: () => IModule;
}

let moduleLoadedPromise: Promise<IModule[]>;

export const ModuleLoader = {
  install(app: App) {
    moduleLoadedPromise = loadModules(app);
  },
};

export async function onModulesLoaded(): Promise<IModule[]> {
  return moduleLoadedPromise;
}

async function loadModules(app: App): Promise<IModule[]> {
  const promises: Promise<IModule>[] = [];
  for (const path in modulesImport) {
    const moduleImport = modulesImport[path];
    const importPromise = typeof moduleImport === 'function' ? moduleImport() : moduleImport;
    promises.push(
      importPromise.then((moduleInitializer: ModuleImport) => {
        return pushModule(app, moduleInitializer);
      }),
    );
  }
  return Promise.all(promises);
}

function pushModule(app: App, moduleImport: ModuleImport) {
  const module = moduleImport.default();
  if (module.init) {
    module.init(app);
  }
  modules.push(module);
  return module;
}

export function getModules(): IModule[] {
  return modules;
}
