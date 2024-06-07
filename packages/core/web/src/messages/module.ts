import { registerContentType, StreamEntryLayout } from '@/content';
import { translation } from '@/i18n';
import { IModule } from '@/core';
import {
  CreateMessageModel,
  MessageModel,
  MESSAGES_MODULE_ID,
  MessagePermissions,
} from '@lyvely/interface';

export default () => {
  return {
    id: MESSAGES_MODULE_ID,
    permissions: MessagePermissions,
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
          upsert: {
            createModel: CreateMessageModel,
            component: () => import('./components/UpsertMessageModal.vue'),
          },
          stream: {
            entryOptions: {
              layout: StreamEntryLayout.Message,
            },
            details: () => import('./components/MessageDetails.vue'),
          },
        },
      });
    },
  } as IModule;
};
