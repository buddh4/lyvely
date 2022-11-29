import mitt from 'mitt';
import { LyvelyApp } from '@/lyvely.app';

type GlobalEvents = {
  'app.init.pre': void;
  'app.init.post': LyvelyApp;
  'app.mount.pre': LyvelyApp;
  'app.mount.post': LyvelyApp;
} & Record<string, any>;

export const eventBus = mitt<GlobalEvents>();
