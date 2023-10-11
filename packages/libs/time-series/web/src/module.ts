import { IModule } from '@/core';

export default () => {
  return {
    getId: () => 'time-series',
  } as IModule;
};
