import { useLiveStore } from '@/live/stores/live.store';
import { type IModule, useEventBus } from '@/core';

export const useLiveModule = () => {
  return {
    id: 'live',
    init: () => {
      useEventBus().on('app.mount.post', () => useLiveStore().init());
    },
  } satisfies IModule;
};
