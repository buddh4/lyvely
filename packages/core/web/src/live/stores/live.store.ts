import { defineStore } from 'pinia';
import { useEventBus } from '@/core';
import { createApiUrl, ILiveEvent, API_LIVE_INIT, useLiveClient } from '@lyvely/interface';
import { useProfileStore } from '@/profiles';

type LiveSubscriptionState = {
  profile: Record<string, string[]>;
  content: Record<string, string[]>;
  global: string[];
  user: string[];
};

type LiveSubscriptionEvent = {
  type: 'profile' | 'content' | 'global' | 'user' | 'state';
  pid?: string;
  cid?: string;
  state?: LiveSubscriptionState;
  topic?: string;
};

export const useLiveStore = defineStore('live', () => {
  const channel = initBroadcastChannel();
  const client = useLiveClient();
  let isMaster = !isBroadcastEventsEnabled();

  /**
   * Represents the state of a live subscription.
   * This state is only managed broadcast to other tabs by the master tab.
   *
   * @typedef {Object} LiveSubscriptionState
   * @property {boolean} initialized - Indicates whether the subscription has been initialized.
   * @property {Object} profile - Contains user profile information.
   * @property {Object} content - Holds the content related to the subscription.
   * @property {string[]} global - List of global identifiers related to the subscription.
   * @property {string[]} user - List of user-specific identifiers related to the subscription.
   */
  const state: LiveSubscriptionState = {
    profile: {},
    content: {},
    global: [''],
    user: [''],
  };

  /**
   * On profile changes, we subscribe to the default topic of this profile if this is not a member profile, since we
   * are automatically subscribed to all member profiles default topics.
   */
  useProfileStore().onSwitchProfile((newProfile, oldProfile) => {
    if (!newProfile.isMember()) {
      client.subscribeToProfile(newProfile.id);
    }

    if (oldProfile && !oldProfile.isMember()) {
      // TODO: unsubscribe
    }
  });

  function addGlobalSubscription(topic: string) {
    if (!isMaster && channel) {
      channel.postMessage({
        type: 'global',
        topic,
      } satisfies LiveSubscriptionEvent);
    } else {
      _subscribeToGlobal(topic);
    }
  }

  function _subscribeToGlobal(topic: string) {
    if (state.global.includes(topic)) return;
    client
      .subscribeToGlobal(topic)
      .then(() => {
        state.global.push(topic);
        broadcastState();
      })
      .catch((e) => console.error(e));
  }

  function addUserSubscription(topic: string) {
    if (!isMaster && channel) {
      channel.postMessage({
        type: 'user',
        topic,
      } satisfies LiveSubscriptionEvent);
    } else {
      _subscribeToUser(topic);
    }
  }

  function _subscribeToUser(topic: string) {
    if (state.user.includes(topic)) return;
    client
      .subscribeToUser(topic)
      .then(() => {
        state.user.push(topic);
        broadcastState();
      })
      .catch((e) => console.error(e));
  }

  function addProfileSubscription(pid: string, topic?: string) {
    if (!isMaster && channel) {
      channel.postMessage({
        type: 'profile',
        pid,
        topic,
      } satisfies LiveSubscriptionEvent);
    } else {
      _subscribeToProfile(pid, topic);
    }
  }

  function _subscribeToProfile(pid: string, topic?: string) {
    const subscriptions = state.profile[pid] || [];
    if (subscriptions.includes(topic || '')) return Promise.resolve();
    client
      .subscribeToProfile(pid, topic)
      .then(() => {
        subscriptions.push(topic || '');
        state.profile[pid] = subscriptions;
        broadcastState();
      })
      .catch((e) => console.error(e));
  }

  function addContentSubscription(pid: string, cid: string, topic?: string) {
    if (!isMaster && channel) {
      channel.postMessage({
        type: 'content',
        pid,
        topic,
      } satisfies LiveSubscriptionEvent);
    } else {
      _subscribeToContent(pid, cid, topic);
    }
  }

  function _subscribeToContent(pid: string, cid: string, topic?: string) {
    const key = `${pid}-${cid}`;
    const subscriptions = state.content[key] || [];
    if (subscriptions.includes(topic || '')) return Promise.resolve();
    client
      .subscribeToContent(pid, cid, topic)
      .then(() => {
        subscriptions.push(topic || '');
        state.content[key] = subscriptions;
        broadcastState();
      })
      .catch((e) => console.error(e));
  }

  function broadcastState() {
    if (!isMaster || !channel) return;
    channel.postMessage({
      type: 'state',
      state: state,
    } satisfies LiveSubscriptionEvent);
  }

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
    if (liveEventSource) return;
    if (isBroadcastEventsEnabled()) {
      navigator.locks.request(
        `live_master`,
        async () =>
          new Promise((resolve) => {
            isMaster = true;
            console.debug(`Connect to user event source`);
            connectEventSource();
            broadcastState();
            window.addEventListener('beforeunload', () => {
              isMaster = false;
              resolve(null);
            });
          })
      );
    } else {
      connectEventSource();
    }
  }

  let liveEventSource: EventSource | undefined;
  function connectEventSource() {
    if (liveEventSource) liveEventSource.close();

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

  function emitLocalLiveEvent(event: ILiveEvent | LiveSubscriptionEvent) {
    if (isSubscriptionEvent(event)) {
      return handleSubscriptionEvent(event);
    } else {
      useEventBus<any>().emit(createLiveEventType(event.module, event.name), event);
    }
  }

  /**
   * Handles subscription events based on the event type and details.
   *
   * Only the master holding the lock is responsible for subscribing to new topics and broadcasting the state.
   *
   * @param {LiveSubscriptionEvent} event - The subscription event to handle.
   * @return {void} This function does not return a value.
   */
  function handleSubscriptionEvent(event: LiveSubscriptionEvent) {
    if (event.state && !isMaster) this.state = event.state;
    else if (!isMaster) return;
    else if (event.type === 'global' && event.topic) _subscribeToGlobal(event.topic);
    else if (event.type === 'user' && event.topic) _subscribeToUser(event.topic);
    else if (event.type === 'profile' && event.pid) _subscribeToProfile(event.pid, event.topic);
    else if (event.type === 'content' && event.pid && event.cid)
      _subscribeToContent(event.pid, event.cid, event.topic);
  }

  function isSubscriptionEvent(evt: any): evt is LiveSubscriptionEvent {
    return 'scope' in evt;
  }

  function createLiveEventType(module: string, name: string) {
    return `live.${module}.${name}`;
  }

  function on<TEvent extends ILiveEvent = ILiveEvent>(
    module: string,
    topic: string,
    handler: (event: TEvent) => void
  ) {
    return useEventBus<any>().on(createLiveEventType(module, topic), handler);
  }

  function off<TEvent extends ILiveEvent = ILiveEvent>(
    module: string,
    topic: string,
    handler: (event: TEvent) => void
  ) {
    return useEventBus<any>().off(createLiveEventType(module, topic), handler);
  }

  return {
    init,
    on,
    off,
    addGlobalSubscription,
    addUserSubscription,
    addProfileSubscription,
    addContentSubscription,
  };
});
