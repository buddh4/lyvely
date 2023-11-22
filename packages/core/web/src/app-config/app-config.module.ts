import { IModule } from '@/core';
import { appConfigGuard } from './app-config.guard';
import { registerGuards } from '@/lyvely.router';
import { APP_CONFIG_MODULE_ID, useApiRequestInterceptor } from '@lyvely/interface';
import { csrfRequestInterceptor } from './csrf-request-interceptor';

export const appConfigModule = () => {
  return {
    id: 'app-config',
    moduleId: APP_CONFIG_MODULE_ID,
    init: () => {
      registerGuards([{ guard: appConfigGuard, sortOrder: 1000 }]);
      useApiRequestInterceptor(csrfRequestInterceptor);
    },
  } as IModule;
};
