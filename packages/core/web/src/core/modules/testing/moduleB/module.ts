import { IModule } from '@/core';

export default () => {
  return {
    getId: () => 'moduleB',
    init: () => {},
  } as IModule;
};
