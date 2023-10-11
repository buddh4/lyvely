import { registerRoutes } from '@/lyvely.router';
import streamRoutes from './routes/stream.routes';
import { registerMenuEntry } from '@/menus';
import { MENU_PROFILE_DRAWER } from '@/profiles/profile.constants';

export default () => {
  return {
    getId: () => 'stream',
    init: () => {
      registerRoutes(streamRoutes);
      registerMenuEntry(MENU_PROFILE_DRAWER, {
        id: 'stream',
        to: { name: 'stream' },
        sortOrder: 1000,
        icon: 'stream',
        title: 'stream.labels.main_nav',
      });
    },
  };
};
