import { IModule } from '@/modules/core';

export default () => {
  return {
    getId: () => 'invitations',
    options: {
      i18n: {
        baseLocales: false,
      },
    },
  } as IModule;
};
