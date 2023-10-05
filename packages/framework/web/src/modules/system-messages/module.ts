import { registerContentType } from '@/modules/content-stream/components/content-stream-entry.registry';
import { IModule } from '@/modules/core/modules/interfaces/module.interface';
import { SystemMessageModel } from '@lyvely/system-messages-interface';
import { translation } from '@/i18n';

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
