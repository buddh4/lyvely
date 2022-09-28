import { App } from "vue";
import { IModule } from "@/modules/core/modules/interfaces/module.interface";

const modulesImport = import.meta.glob<Promise<{ default: () => IModule }>>(
  "./modules/**/module.ts"
);
const modules = [] as IModule[];

export const ModuleLoader = {
  install(app: App) {
    for (const path in modulesImport) {
      modulesImport[path]().then((moduleInitializer) => {
        const module = moduleInitializer.default();
        if (module.init) {
          module.init(app);
        }
        modules.push(module);
      });
    }
  },
};

export function getModules(): IModule[] {
  return modules;
}
