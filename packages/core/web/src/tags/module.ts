import { registerRoutes } from '@/lyvely.router';
import tagRoutes from './routes/tag.routes';
import { registerMenuEntry, removeMenuEntry } from '@/menus';
import { MENU_PROFILE_DRAWER } from '@/profiles/profile.constants';

export default () => {
  return {
    getId: () => 'tags',
    init: () => {
      registerRoutes(tagRoutes);
      registerMenuEntry(MENU_PROFILE_DRAWER, {
        id: 'tags',
        feature: 'tags',
        to: { name: 'Tags' },
        sortOrder: 2000,
        icon: 'tags',
        title: 'tags.labels.main_nav',
      });
    },
  };
};
