import { registerContentStreamEntryComponent } from '@/modules/content-stream/components/content-stream-entry.registry';
import MessageStreamEntry from '@/modules/messages/components/MessageStreamEntry.vue';
import { IModule } from '@/modules/core/modules/interfaces/module.interface';

export default () => {
  return {
    getId: () => 'messages',
    init: () => {
      registerContentStreamEntryComponent('Message', MessageStreamEntry);
    },
  } as IModule;
};
