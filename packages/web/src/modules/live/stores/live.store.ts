import { defineStore } from 'pinia';
import { eventBus } from '@/modules/core/events/global.emitter';
import { ILiveEvent } from '@lyvely/common';

const apiURL = import.meta.env.VITE_APP_API_URL || 'http://localhost:8080';

export const useLiveStore = defineStore('live', () => {
  function connectUser() {
    const eventSource = new EventSource(`${apiURL}/live/user`, { withCredentials: true });
    eventSource.onerror = (err) => {
      console.error(err);
    };

    eventSource.onopen = () => {
      console.log('Live connection onopen');
    };

    eventSource.onmessage = ({ data }) => {
      const event = JSON.parse(data) as ILiveEvent;
      console.log('New live event', event);
      eventBus.emit(createLiveEventType(event.module, event.name), event);
    };
  }

  function createLiveEventType(module: string, name: string) {
    return `live.${module}.${name}`;
  }

  function on<TEvent extends ILiveEvent = ILiveEvent>(
    module: string,
    event: string,
    handler: (event: TEvent) => void,
  ) {
    return eventBus.on(createLiveEventType(module, event), handler);
  }

  function off<TEvent extends ILiveEvent = ILiveEvent>(
    module: string,
    event: string,
    handler: (event: TEvent) => void,
  ) {
    return eventBus.off(createLiveEventType(module, event), handler);
  }

  return {
    connectUser,
    on,
    off,
  };
});
