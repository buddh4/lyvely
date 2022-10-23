import { App } from 'vue';
import { IModule } from '@/modules/core/modules/interfaces/module.interface';

const modulesImport = import.meta.glob<Promise<{ default: () => IModule }>>('./modules/**/module.ts');
const modules = [] as IModule[];

interface ModuleImport {
  default: () => IModule;
}

export const ModuleLoader = {
  install(app: App) {
    for (const path in modulesImport) {
      const moduleImport = modulesImport[path];
      const importPromise = typeof moduleImport === 'function' ? moduleImport() : moduleImport;
      importPromise.then((moduleInitializer: ModuleImport) => {
        pushModule(app, moduleInitializer);
      });
    }
  },
};

function pushModule(app: App, moduleImport: ModuleImport) {
  const module = moduleImport.default();
  if (module.init) {
    module.init(app);
  }
  modules.push(module);
}

export function getModules(): IModule[] {
  return modules;
}
