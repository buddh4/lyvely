import { App } from 'vue';
import { IModule, IModuleImport, installModules } from '@lyvely/web';

export const moduleInstaller = () => {
  return {
    install(app: App) {
      installModules(app, import.meta.glob<Promise<IModuleImport>>('./modules/**/module.ts'));
    },
  };
};
