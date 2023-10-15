import { IModule } from '@/core';

export default () => {
  return {
    getId: () => 'moduleA',
    init: () => {},
  } as IModule;
};
