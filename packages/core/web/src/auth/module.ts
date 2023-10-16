import { IModule } from '@/core';
import { authGuard } from './guards';
import { registerGuards } from '@/lyvely.router';
import authRoutes from './routes/auth.routes';
import { AUTH_MODULE_ID } from '@lyvely/core-interface';

export default () => {
  return {
    id: 'auth',
    moduleId: AUTH_MODULE_ID,
    routes: authRoutes,
    init: () => {
      registerGuards([authGuard]);
    },
  } as IModule;
};
