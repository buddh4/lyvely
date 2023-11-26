import tagRoutes from './routes/tag.routes';
import { registerMenuEntry } from '@lyvely/ui';
import { MENU_PROFILE_DRAWER } from '@/profiles/profile.constants';

export default () => {
  return {
    id: 'tags',
    routes: tagRoutes,
    i18n: {
      base: (locale: string) => import(`./locals/base.${locale}.json`),
    },
    init: () => {
      registerMenuEntry(MENU_PROFILE_DRAWER, {
        id: 'tags',
        moduleId: 'tags',
        to: { name: 'Tags' },
        sortOrder: 2000,
        icon: 'tags',
        text: 'tags.labels.main_nav',
      });
    },
  };
};
