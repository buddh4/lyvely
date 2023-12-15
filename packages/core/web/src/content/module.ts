import { contentRoutes } from './routes';
import { registerMenuEntry, registerComponentStackEntries } from '@lyvely/ui';
import {
  MENU_PROFILE_DRAWER,
  MENU_PROFILE_MOBILE_FOOTER,
  STACK_PROFILE_LAYOUT,
} from '@/profiles/profile.constants';
import { CONTENT_MODULE_ID, ContentStreamFeature } from '@lyvely/interface';
import type { ContentModel } from '@lyvely/interface';
import { IModule } from '@/core';
import { MENU_CONTENT_DROPDOWN } from '@/content/content.constants';
import { useContentEditStore } from '@/content/stores';
import { getContentTypeOptions } from '@/content/registries';
import { useContentArchive } from '@/content/composables';
import { useConfirm } from '@/ui';

export default () => {
  return {
    id: CONTENT_MODULE_ID,
    features: [ContentStreamFeature],
    routes: contentRoutes,
    i18n: {
      base: (locale: string) => import(`./locales/base.${locale}.json`),
    },
    init: () => {
      registerComponentStackEntries(STACK_PROFILE_LAYOUT, [
        {
          id: 'CreateOrEditContentModal',
          component: () => import('./components/CreateOrEditContentModal.vue'),
        },
      ]);
      registerMenuEntry(MENU_PROFILE_DRAWER, {
        id: 'stream',
        moduleId: CONTENT_MODULE_ID,
        to: { name: 'stream' },
        features: ContentStreamFeature.id,
        sortOrder: 1000,
        icon: 'stream',
        text: 'content.stream.title',
      });
      registerMenuEntry<ContentModel>(MENU_CONTENT_DROPDOWN, (content: ContentModel) => ({
        id: 'content-edit',
        moduleId: CONTENT_MODULE_ID,
        click: () => useContentEditStore().editContent(content),
        condition:
          content.getTypeMeta()?.deletable &&
          getContentTypeOptions(content.type)?.interfaces?.edit !== false &&
          !content.meta.archived,
        sortOrder: 1000,
        icon: 'edit',
        text: 'common.edit',
      }));
      registerMenuEntry<ContentModel>(MENU_CONTENT_DROPDOWN, (content: ContentModel) => ({
        id: 'content-archive',
        moduleId: CONTENT_MODULE_ID,
        click: () =>
          useConfirm(useContentArchive(content).toggleArchive, {
            text: content.meta.archived
              ? 'content.actions.confirm.restore'
              : 'content.actions.confirm.archive',
          }),
        condition: content.getTypeMeta()?.deletable,
        sortOrder: 1000,
        icon: content.meta.archived ? 'restore' : 'archive',
        text: content.meta.archived ? 'content.actions.restore' : 'content.actions.archive',
      }));
      registerMenuEntry(MENU_PROFILE_MOBILE_FOOTER, {
        id: 'stream-footer',
        moduleId: CONTENT_MODULE_ID,
        to: { name: 'stream' },
        features: ContentStreamFeature.id,
        sortOrder: 1000,
        icon: 'stream',
        text: 'content.stream.title',
      });
    },
  } as IModule;
};
