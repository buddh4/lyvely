import { App } from "vue";
import { Module } from "@/modules/core/modules/interfaces/module.interface";

const modulesImport = import.meta.glob<Promise<{ default: () => Module }>>('./modules/**/module.ts');
const modules = [] as Module[];

export const ModuleLoader = {
  install(app: App) {
    for (const path in modulesImport) {
      modulesImport[path]().then((moduleInitializer) => {
        const module = moduleInitializer.default();
        if(module.init) {
          module.init(app);
        }
        modules.push(module);
      });
    }
  }
}

export function getModules(): Module[] {
  return modules;
}


