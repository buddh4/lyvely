import { registerContentType } from '@/content-stream/components/content-stream-entry.registry';
import { translation } from '@/i18n';
import { IModule } from '@/core';
import { MessageModel } from '@lyvely/core-interface';

export default () => {
  return {
    getId: () => 'messages',
    init: () => {
      registerContentType({
        type: MessageModel.contentType,
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
