import { defineStore } from 'pinia';
import { useEventBus } from '@/core';
import { createApiUrl, ILiveEvent } from '@lyvely/interface';

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

  function connectUser(pid?: string) {
    if (isBroadcastEventsEnabled()) {
      navigator.locks.request(
        'live_master',
        async () =>
          new Promise((resolve) => {
            console.debug(`Connect to user event source`);
            connectUserEventSource(pid);
            window.addEventListener('beforeunload', resolve);
          })
      );
    } else {
      connectUserEventSource(pid);
    }
  }

  let liveEventSource: EventSource | undefined;
  let livePid: string | undefined;
  function connectUserEventSource(pid?: string) {
    if (liveEventSource && pid === pid) return;
    else if (liveEventSource) liveEventSource.close();

    liveEventSource = new EventSource(
      createApiUrl('/live/user', livePid ? { pid: livePid } : undefined),
      {
        withCredentials: true,
      }
    );

    liveEventSource.onerror = (error) => console.error(error);
    liveEventSource.onopen = () => console.debug('Live connection onopen');
    liveEventSource.onmessage = ({ data }) => {
      const event = JSON.parse(data) as ILiveEvent;
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
    connectUser,
    on,
    off,
  };
});
