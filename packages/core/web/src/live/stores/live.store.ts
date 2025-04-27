import { defineStore } from 'pinia';
import { useEventBus } from '@/core';
import {
  createApiUrl,
  ILiveEvent,
  API_LIVE_INIT,
  useLiveClient,
  LiveState,
  type ILiveState,
} from '@lyvely/interface';
import { useProfileStore } from '@/profiles';
import { v4 as uuidV4 } from 'uuid';

const tabId = uuidV4();

type LiveSubscriptionEvent = {
  command: 'subscribe' | 'unsubscribe' | 'update';
  subscription?: AnySubscriptionData;
  state?: ILiveState;
};

type LiveSubscriptionScope = 'global' | 'user' | 'profile' | 'content';

interface SubscriptionData {
  subId: string;
  topic?: string;
  tabId: string;
  scope: LiveSubscriptionScope;
}

interface GlobalSubscriptionData extends SubscriptionData {
  topic: string;
}

interface UserSubscriptionData extends SubscriptionData {
  topic: string;
}

interface ProfileSubscriptionData extends SubscriptionData {
  pid: string;
}

interface ContentSubscriptionData extends SubscriptionData {
  pid: string;
  cid: string;
}

type AnySubscriptionData =
  | GlobalSubscriptionData
  | UserSubscriptionData
  | ProfileSubscriptionData
  | ContentSubscriptionData;

// TODO: Reconnect on auth changes

export const useLiveStore = defineStore('live', () => {
  const channel = initBroadcastChannel();
  const client = useLiveClient();
  let isMaster = !isBroadcastEventsEnabled();
  const state = new LiveState();

  /**
   * On profile changes, we subscribe to the default topic of this profile if this is not a member profile, since we
   * are automatically subscribed to all member profile default topics.
   */
  useProfileStore().onSwitchProfile((newProfile, oldProfile) => {
    if (!newProfile.isMember()) {
      return addProfileSubscription(newProfile.id);
    }

    if (oldProfile && !oldProfile.isMember()) {
      return removeProfileSubscription(oldProfile.id);
    }
  });

  function addGlobalSubscription(topic: string) {
    return handleSubscriptionEvent({
      command: 'subscribe',
      subscription: {
        subId: LiveState.buildGlobalSubId(topic),
        scope: 'global',
        topic,
        tabId,
      },
    });
  }

  function removeGlobalSubscription(topic: string) {
    return handleSubscriptionEvent({
      command: 'unsubscribe',
      subscription: {
        subId: LiveState.buildGlobalSubId(topic),
        scope: 'global',
        topic,
        tabId,
      },
    });
  }

  function addUserSubscription(topic: string) {
    return handleSubscriptionEvent({
      command: 'subscribe',
      subscription: {
        subId: LiveState.buildUserSubId(topic),
        scope: 'user',
        topic,
        tabId,
      },
    });
  }

  function removeUserSubscription(topic: string) {
    return handleSubscriptionEvent({
      command: 'unsubscribe',
      subscription: {
        subId: LiveState.buildUserSubId(topic),
        scope: 'user',
        topic,
        tabId,
      },
    });
  }

  function addProfileSubscription(pid: string, topic?: string) {
    return handleSubscriptionEvent({
      command: 'subscribe',
      subscription: {
        subId: LiveState.buildProfileSubId(pid, topic),
        scope: 'profile',
        pid,
        topic,
        tabId,
      },
    });
  }

  function removeProfileSubscription(pid: string, topic?: string) {
    return handleSubscriptionEvent({
      command: 'unsubscribe',
      subscription: {
        subId: LiveState.buildProfileSubId(pid, topic),
        scope: 'profile',
        topic,
        pid,
        tabId,
      },
    });
  }

  function addContentSubscription(pid: string, cid: string, topic?: string) {
    return handleSubscriptionEvent({
      command: 'subscribe',
      subscription: {
        subId: LiveState.buildContentSubId(pid, cid, topic),
        scope: 'profile',
        pid,
        cid,
        topic,
        tabId,
      },
    });
  }

  function removeContentSubscription(pid: string, cid: string, topic?: string) {
    return handleSubscriptionEvent({
      command: 'unsubscribe',
      subscription: {
        subId: LiveState.buildContentSubId(pid, cid, topic),
        scope: 'profile',
        topic,
        pid,
        cid,
        tabId,
      },
    });
  }

  async function handleSubscriptionEvent(event: LiveSubscriptionEvent) {
    const { command, state, subscription } = event;
    if (command === 'update' && isMaster) return;
    if (command === 'update') {
      this.state = new LiveState(state);
      return;
    }
    if (!isMaster && channel) {
      channel.postMessage(event);
    } else if (command === 'subscribe' && subscription) {
      await subscribe(subscription);
    } else if (command === 'unsubscribe' && subscription) {
      await unsubscribe(subscription);
    }
  }

  async function subscribe(subscription: AnySubscriptionData) {
    const { subId, tabId } = subscription;
    state.addSubscription(tabId, subId);
    if (state.isSubscribedTo(subId)) return;
    await subscribeClient(subscription)
      .then(broadcastState)
      .catch((e) => console.error(e));
  }

  async function unsubscribe(subscription: AnySubscriptionData) {
    const { subId, tabId } = subscription;
    state.removeSubscription(tabId, subId);
    if (!state.isSubscribedTo(subId)) {
      await unsubscribeClient(subscription)
        .then(broadcastState)
        .catch((e) => console.error(e));
    }
  }

  async function subscribeClient(subscription: AnySubscriptionData) {
    switch (subscription.scope) {
      case 'global':
        return client.subscribeToGlobal(state.connectId, subscription.topic);
      case 'user':
        return client.subscribeToUser(state.connectId, subscription.topic);
    }
  }

  async function unsubscribeClient(subscription: AnySubscriptionData) {
    switch (subscription.scope) {
      case 'global':
        return client.unsubscribeFromGlobal(state.connectId, subscription.topic);
      case 'user':
        return client.unsubscribeFromUser(state.connectId, subscription.topic);
    }
  }

  function broadcastState() {
    if (!isMaster) return;
    channel?.postMessage({
      command: 'update',
      state: state.toPlainObject(),
    } satisfies LiveSubscriptionEvent);
  }

  function initBroadcastChannel() {
    if (!isBroadcastEventsEnabled()) return null;
    const channel = new BroadcastChannel('live_channel');
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

    liveEventSource = new EventSource(createApiUrl(API_LIVE_INIT(state.connectId)), {
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

  function isSubscriptionEvent(evt: any): evt is LiveSubscriptionEvent {
    return (
      (evt.command === 'update' && evt.sate) ||
      (evt.command === 'subscribe' && evt.subscription) ||
      (evt.command === 'unsubscribe' && evt.subscription)
    );
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
    removeGlobalSubscription,
    addUserSubscription,
    removeUserSubscription,
    addProfileSubscription,
    removeProfileSubscription,
    addContentSubscription,
    removeContentSubscription,
  };
});
