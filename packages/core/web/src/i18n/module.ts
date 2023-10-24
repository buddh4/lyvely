import { registerGuards } from '@/lyvely.router';
import { messageLoaderGuard } from '@/i18n/i18n.guard';
import { IModule } from '@/core';
import { I18N_MODULE_ID } from '@lyvely/core-interface';

export default () => {
  return {
    id: I18N_MODULE_ID,
    init: () => {
      registerGuards([{ sortOrder: 100, guard: messageLoaderGuard }]);
    },
  } as IModule;
};
