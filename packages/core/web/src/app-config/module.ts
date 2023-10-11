import { IModule } from '@/core';
import { appConfigGuard } from './guards';
import { registerGuards } from '@/lyvely.router';

export default () => {
  return {
    getId: () => 'app-config',
    init: () => {
      registerGuards([appConfigGuard]);
    },
  } as IModule;
};
