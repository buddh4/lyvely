import tagRoutes from './routes/tag.routes';
import { registerMenuEntry } from '@/menus';
import { MENU_PROFILE_DRAWER } from '@/profiles/profile.constants';

export default () => {
  return {
    id: 'tags',
    routes: tagRoutes,
    init: () => {
      registerMenuEntry(MENU_PROFILE_DRAWER, {
        id: 'tags',
        moduleId: 'tags',
        feature: 'tags',
        to: { name: 'Tags' },
        sortOrder: 2000,
        icon: 'tags',
        title: 'tags.labels.main_nav',
      });
    },
  };
};
