import { registerContentType } from '@/modules/content-stream/components/content-stream-entry.registry';
import MessageStreamEntry from '@/modules/messages/components/MessageStreamEntry.vue';
import { IModule } from '@/modules/core/modules/interfaces/module.interface';
import { MessageModel } from '@lyvely/common';

export default () => {
  return {
    getId: () => 'messages',
    init: () => {
      registerContentType({
        type: MessageModel.contentType,
        modelClass: MessageModel,
        streamEntryComponent: MessageStreamEntry,
      });
    },
  } as IModule;
};
