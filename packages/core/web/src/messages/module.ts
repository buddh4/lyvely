import { registerContentType } from '@/content-stream/components/content-stream-entry.registry';
import { translation } from '@/i18n';
import { IModule } from '@/core';
import { MessageModel, MESSAGES_MODULE_ID } from '@lyvely/core-interface';

export default () => {
  return {
    id: MESSAGES_MODULE_ID,
    init: () => {
      registerContentType({
        type: MessageModel.contentType,
        moduleId: MESSAGES_MODULE_ID,
        name: translation('messages.content.name'),
        icon: 'stream',
        feature: 'messages',
        modelClass: MessageModel,
        interfaces: {
          stream: {
            entry: () => import('./components/MessageStreamEntry.vue'),
          },
        },
      });
    },
  } as IModule;
};
