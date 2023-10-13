import { registerRoutes } from '@/lyvely.router';
import streamRoutes from './routes/stream.routes';
import { registerMenuEntry } from '@/menus';
import { MENU_PROFILE_DRAWER } from '@/profiles/profile.constants';
import { ContentStreamFeature, registerFeatures } from '@lyvely/core-interface';

export default () => {
  return {
    getId: () => 'stream',
    init: () => {
      registerFeatures([ContentStreamFeature]);
      registerRoutes(streamRoutes);
      registerMenuEntry(MENU_PROFILE_DRAWER, {
        id: 'stream',
        to: { name: 'stream' },
        feature: ContentStreamFeature.id,
        sortOrder: 1000,
        icon: 'stream',
        title: 'stream.labels.main_nav',
      });
    },
  };
};
