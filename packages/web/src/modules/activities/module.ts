import { IModule } from '@/modules/core/modules/interfaces/module.interface';

export default () => {
  return {
    getId: () => 'activities',
  } as IModule;
};
