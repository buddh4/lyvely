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

  function connectUser() {
    if (isBroadcastEventsEnabled()) {
      navigator.locks.request(
        'live_master',
        async () =>
          new Promise((resolve) => {
            console.debug(`Connect to user event source`);
            connectUserEventSource();
            window.addEventListener('beforeunload', resolve);
          }),
      );
    } else {
      connectUserEventSource();
    }
  }

  let releaseGuestLock: ((v: any) => void) | undefined;
  function connectProfileGuest(pid: string) {
    if (isBroadcastEventsEnabled()) {
      navigator.locks.request(
        `live_${pid}_master`,
        async () =>
          new Promise((resolve) => {
            console.debug(`Connect to ${pid} as guest`);
            releaseGuestLock = resolve;
            connectProfileGuestEventSource(pid);
            window.addEventListener('beforeunload', resolve);
          }),
      );
    } else {
      connectProfileGuestEventSource(pid);
    }
  }

  function connectUserEventSource() {
    const eventSource = new EventSource(createApiUrl('/live/user'), { withCredentials: true });
    eventSource.onerror = (error) => console.error(error);
    eventSource.onopen = () => console.debug('Live connection onopen');
    eventSource.onmessage = ({ data }) => {
      const event = JSON.parse(data) as ILiveEvent;
      broadCastLiveEvent(event);
    };
    return eventSource;
  }

  let guestSource: EventSource | undefined;
  let guestPid: string | undefined;
  function connectProfileGuestEventSource(pid: string) {
    if (guestSource && guestPid === pid) return;

    if (guestSource && guestPid !== pid) guestSource.close();

    guestPid = pid;

    guestSource = new EventSource(createApiUrl(`/live/${pid}/guest`), { withCredentials: true });
    guestSource.onerror = (error) => console.error(error);
    guestSource.onopen = () => console.debug('Live connection onopen');
    guestSource.onmessage = ({ data }) => {
      const event = JSON.parse(data) as ILiveEvent;
      broadCastLiveEvent(event);
    };
  }

  function closeGuestConnection() {
    if (guestSource) guestSource.close();
    if (releaseGuestLock) releaseGuestLock(undefined);
    releaseGuestLock = undefined;
    guestSource = undefined;
    guestPid = undefined;
  }

  function broadCastLiveEvent(event: ILiveEvent) {
    if (channel) {
      channel.postMessage(event);
    }

    emitLocalLiveEvent(event);
  }

  function emitLocalLiveEvent(event: ILiveEvent) {
    useEventBus().emit(createLiveEventType(event.module, event.name), event);
  }

  function createLiveEventType(module: string, name: string) {
    return `live.${module}.${name}`;
  }

  function on<TEvent extends ILiveEvent = ILiveEvent>(
    module: string,
    event: string,
    handler: (event: TEvent) => void,
  ) {
    return useEventBus().on(createLiveEventType(module, event), handler);
  }

  function off<TEvent extends ILiveEvent = ILiveEvent>(
    module: string,
    event: string,
    handler: (event: TEvent) => void,
  ) {
    return useEventBus().off(createLiveEventType(module, event), handler);
  }

  return {
    connectUser,
    connectProfileGuest,
    closeGuestConnection,
    on,
    off,
  };
});
