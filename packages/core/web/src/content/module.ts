import { contentRoutes } from './routes';
import { registerMenuEntry } from '@/ui/menus';
import { MENU_PROFILE_DRAWER } from '@/profiles/profile.constants';
import { CONTENT_MODULE_ID, ContentStreamFeature } from '@lyvely/core-interface';
import { IModule } from '@/core';
import { registerRoutes } from '@/lyvely.router';
import { NotFound } from '@/ui';

export default () => {
  return {
    id: CONTENT_MODULE_ID,
    features: [ContentStreamFeature],
    routes: contentRoutes,
    i18n: {
      base: (locale: string) => import(`./locales/base.${locale}.json`),
    },
    init: () => {
      registerRoutes([{ path: '/:pathMatch(.*)*', name: 'NotFound', component: NotFound }]);
      registerMenuEntry(MENU_PROFILE_DRAWER, {
        id: 'stream',
        moduleId: CONTENT_MODULE_ID,
        to: { name: 'stream' },
        feature: ContentStreamFeature.id,
        sortOrder: 1000,
        icon: 'stream',
        title: 'content.stream.title',
      });
    },
  } as IModule;
};
