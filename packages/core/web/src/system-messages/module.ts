import { registerContentType } from '@/content-stream/components/content-stream-entry.registry';
import { translation } from '@/i18n';
import { IModule } from '@/core';
import { SystemMessageModel } from '@lyvely/core-interface';

export default () => {
  return {
    getId: () => 'messages',
    init: () => {
      registerContentType({
        type: SystemMessageModel.contentType,
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
