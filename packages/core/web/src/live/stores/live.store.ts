import { defineStore } from 'pinia';
import { useEventBus } from '@/core';
import { createApiUrl, ILiveEvent } from '@lyvely/interface';
import { API_LIVE_INIT } from '@lyvely/interface/src';

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

  function init() {
    if (isBroadcastEventsEnabled()) {
      navigator.locks.request(
        `live_master`,
        async () =>
          new Promise((resolve) => {
            console.debug(`Connect to user event source`);
            connectEventSource();
            window.addEventListener('beforeunload', resolve);
          })
      );
    } else {
      connectEventSource();
    }
  }

  let liveEventSource: EventSource | undefined;
  function connectEventSource() {
    if (liveEventSource && pid === livePid) return;
    else if (liveEventSource) liveEventSource.close();

    liveEventSource = new EventSource(createApiUrl(API_LIVE_INIT), {
      withCredentials: true,
    });

    liveEventSource.onerror = (error) => console.error(error);
    liveEventSource.onopen = () => console.debug('Live connection onopen');
    liveEventSource.onmessage = ({ data }) => {
      const event = JSON.parse(data) as ILiveEvent;
      console.debug(`Received Live Event:`, event);
      broadCastLiveEvent(event);
    };

    return liveEventSource;
  }

  function broadCastLiveEvent(event: ILiveEvent) {
    if (channel) {
      channel.postMessage(event);
    }

    emitLocalLiveEvent(event);
  }

  function emitLocalLiveEvent(event: ILiveEvent) {
    useEventBus<any>().emit(createLiveEventType(event.module, event.name), event);
  }

  function createLiveEventType(module: string, name: string) {
    return `live.${module}.${name}`;
  }

  function on<TEvent extends ILiveEvent = ILiveEvent>(
    module: string,
    event: string,
    handler: (event: TEvent) => void
  ) {
    return useEventBus<any>().on(createLiveEventType(module, event), handler);
  }

  function off<TEvent extends ILiveEvent = ILiveEvent>(
    module: string,
    event: string,
    handler: (event: TEvent) => void
  ) {
    return useEventBus<any>().off(createLiveEventType(module, event), handler);
  }

  return {
    init,
    on,
    off,
  };
});
