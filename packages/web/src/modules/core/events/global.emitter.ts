import mitt from 'mitt';
import { App } from '@vue/runtime-core';

type GlobalEvents = {
  'app.create.pre': void,
  'app.create.post': App,
  'app.mount.pre': App,
  'app.mount.post': App,
} & Record<string, any>;

export const eventBus = mitt<GlobalEvents>();
