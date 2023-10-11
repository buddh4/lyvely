import { App } from 'vue';
import { IModule, IModuleImport, installModule } from '@lyvely/core-web';

export const moduleLoader = () => {
  return {
    install(app: App) {
      installModule(app, import.meta.glob<Promise<IModuleImport>>('./modules/**/module.ts'));
    },
  };
};
