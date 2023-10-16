import contentStreamRoutes from './routes/content-stream.routes';
import { registerMenuEntry } from '@/menus';
import { MENU_PROFILE_DRAWER } from '@/profiles/profile.constants';
import { CONTENT_STREAM_MODULE_ID, ContentStreamFeature } from '@lyvely/core-interface';
import { IModule } from '@/core';

export default () => {
  return {
    id: CONTENT_STREAM_MODULE_ID,
    features: [ContentStreamFeature],
    routes: contentStreamRoutes,
    init: () => {
      registerMenuEntry(MENU_PROFILE_DRAWER, {
        id: 'stream',
        moduleId: CONTENT_STREAM_MODULE_ID,
        to: { name: 'stream' },
        feature: ContentStreamFeature.id,
        sortOrder: 1000,
        icon: 'stream',
        title: 'stream.labels.main_nav',
      });
    },
  } as IModule;
};
