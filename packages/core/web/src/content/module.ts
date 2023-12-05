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
          getContentTypeOptions(content.type)?.interfaces?.edit !== false && !content.meta.archived,
        features: ContentStreamFeature.id,
        sortOrder: 1000,
        icon: 'stream',
        text: 'content.stream.title',
      }));
      registerMenuEntry<ContentModel>(MENU_CONTENT_DROPDOWN, (content: ContentModel) => ({
        id: 'content-archive',
        moduleId: CONTENT_MODULE_ID,
        click: () => useContentEditStore().editContent(content),
        condition:
          getContentTypeOptions(content.type)?.interfaces?.edit !== false && !content.meta.archived,
        features: ContentStreamFeature.id,
        sortOrder: 1000,
        icon: 'stream',
        text: 'content.stream.title',
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
