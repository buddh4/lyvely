import { IModule } from '@/core';
import { authGuard } from './guards';
import { registerGuards, registerRoutes } from '@/lyvely.router';
import authRoutes from './routes/auth.routes';

export default () => {
  return {
    getId: () => 'auth',
    init: () => {
      registerGuards([authGuard]);
      registerRoutes(authRoutes);
    },
  } as IModule;
};
