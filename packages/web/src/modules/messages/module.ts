import { registerContentType } from '@/modules/content-stream/components/content-stream-entry.registry';
import MessageStreamEntry from '@/modules/messages/components/MessageStreamEntry.vue';
import { IModule } from '@/modules/core/modules/interfaces/module.interface';
import { MessageModel } from '@lyvely/common';
import { translation } from '@/i18n';

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
        streamEntryComponent: MessageStreamEntry,
      });
    },
  } as IModule;
};
