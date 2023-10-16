import { IModule } from '@/core';
import { appConfigGuard } from './guards';
import { registerGuards } from '@/lyvely.router';
import { APP_CONFIG_MODULE_ID } from '@lyvely/core-interface';

export default () => {
  return {
    id: 'app-config',
    moduleId: APP_CONFIG_MODULE_ID,
    init: () => {
      registerGuards([appConfigGuard]);
    },
  } as IModule;
};
