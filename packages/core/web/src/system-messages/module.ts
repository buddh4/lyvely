import { registerContentType } from '@/content';
import { translation } from '@/i18n';
import { IModule } from '@/core';
import { SYSTEM_MESSAGES_MODULE_ID, SystemMessageModel } from '@lyvely/interface';

export default () => {
  return {
    id: SYSTEM_MESSAGES_MODULE_ID,
    i18n: {
      base: (locale: string) => import(`./locales/base.${locale}.json`),
    },
    init: () => {
      registerContentType({
        type: SystemMessageModel.contentType,
        moduleId: SYSTEM_MESSAGES_MODULE_ID,
        name: translation('system-messages.content.name'),
        icon: 'lyvely',
        feature: 'system-messages',
        modelClass: SystemMessageModel,
        interfaces: {
          stream: {
            entry: () => import('./components/SystemMessageStreamEntry.vue'),
            details: () => import('./components/SystemMessageDetails.vue'),
          },
          edit: false,
          create: false,
        },
      });
    },
  } as IModule;
};
