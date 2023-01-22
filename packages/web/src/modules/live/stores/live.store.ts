import { defineStore } from 'pinia';
import { eventBus } from '@/modules/core/events/global.emitter';
import { ILiveEvent } from '@lyvely/common';

const apiURL = import.meta.env.VITE_APP_API_URL || 'http://localhost:8080';

export const useLiveStore = defineStore('live', () => {
  const channel = initBroadcastChannel();

  function initBroadcastChannel() {
    const channel = isBroadcastEventsEnabled() ? new BroadcastChannel('live_channel') : null;

    if (!channel) return null;

    channel.onmessage = (event) => emitLocalLiveEvent(event.data);

    return channel;
  }

  function isBroadcastEventsEnabled() {
    return !!window.BroadcastChannel && !!navigator.locks;
  }

  function connectUser() {
    if (isBroadcastEventsEnabled()) {
      navigator.locks.request(
        'live_master',
        async () =>
          new Promise((resolve) => {
            connectUserEventSource();
            window.addEventListener('beforeunload', resolve);
          }),
      );
    } else {
      connectUserEventSource();
    }
  }

  function connectUserEventSource() {
    const eventSource = new EventSource(`${apiURL}/live/user`, { withCredentials: true });
    eventSource.onerror = (err) => console.error(err);
    eventSource.onopen = () => console.debug('Live connection onopen');
    eventSource.onmessage = ({ data }) => {
      const event = JSON.parse(data) as ILiveEvent;
      broadCastLiveEvent(event);
    };
  }

  function broadCastLiveEvent(event: ILiveEvent) {
    if (channel) {
      channel.postMessage(event);
    } else {
      emitLocalLiveEvent(event);
    }
  }

  function emitLocalLiveEvent(event: ILiveEvent) {
    eventBus.emit(createLiveEventType(event.module, event.name), event);
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

  setInterval(() => {
    emitLocalLiveEvent({
      module: 'test',
      name: 'test',
    });
  }, 5000);

  on('test', 'test', () => {
    console.log('Received test event');
  });

  return {
    connectUser,
    on,
    off,
  };
});
