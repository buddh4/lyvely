import { registerContentType } from '@/content';
import { translation } from '@/i18n';
import { IModule } from '@/core';
import {
  MessageModel,
  CreateMessageModel,
  MESSAGES_MODULE_ID,
  CreateMessagePermission,
} from '@lyvely/interface';

export default () => {
  return {
    id: MESSAGES_MODULE_ID,
    permissions: [CreateMessagePermission],
    i18n: {
      base: (locale: string) => import(`./locales/base.${locale}.json`),
    },
    init: () => {
      registerContentType({
        type: MessageModel.contentType,
        moduleId: MESSAGES_MODULE_ID,
        name: translation('messages.content.name'),
        icon: 'stream',
        modelClass: MessageModel,
        interfaces: {
          create: {
            mode: 'modal',
            modelClass: CreateMessageModel,
            component: () => import('./components/EditMessageModal.vue'),
          },
          edit: {
            mode: 'modal',
            component: () => import('./components/EditMessageModal.vue'),
          },
          stream: {
            entry: () => import('./components/MessageStreamEntry.vue'),
            details: () => import('./components/MessageDetails.vue'),
          },
        },
      });
    },
  } as IModule;
};
