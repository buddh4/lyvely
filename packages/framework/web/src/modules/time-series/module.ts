import { IModule } from '@/modules/core/modules/interfaces/module.interface';

export default () => {
  return {
    getId: () => 'time-series',
  } as IModule;
};
