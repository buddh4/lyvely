import { registerGuards } from '@/lyvely.router';
import { messageLoaderGuard } from '@/i18n/i18n.guard';

export default () => {
  return {
    getId: () => 'i18n',
    init: () => {
      registerGuards([messageLoaderGuard]);
    },
  };
};
