import { defineStore } from 'pinia';
import { ref, watch } from 'vue';
import {
  IWebNotification,
  NotificationUpdateStateLiveEvent,
  NotificationSeenStateLiveEvent,
  StreamDirection,
  useNotificationClient,
} from '@lyvely/interface';
import { useStream } from '@/stream/stream.composable';
import { useLiveStore } from '@/live/stores/live.store';

export const useNotificationStore = defineStore('notifications', () => {
  const live = useLiveStore();
  const notificationClient = useNotificationClient();
  const showNotificationDrawer = ref(false);
  const hasUpdates = ref(false);
  const moduleId = 'notifications';

  const stream = useStream(
    {
      batchSize: 15,
      direction: StreamDirection.TTB,
    },
    notificationClient
  );

  live.on(moduleId, NotificationUpdateStateLiveEvent.eventName, handleNotificationUpdateStateEvent);
  live.on(moduleId, NotificationSeenStateLiveEvent.eventName, handleMarkedAsSeenEvent);

  function handleMarkedAsSeenEvent(evt: NotificationSeenStateLiveEvent) {
    const notification = stream.models.value.find((notification) => notification.id === evt.nid);
    if (notification && notification.seen !== evt.state) {
      notification.seen = evt.state;
    }
  }

  async function handleNotificationUpdateStateEvent(evt: NotificationUpdateStateLiveEvent) {
    hasUpdates.value = evt.updatesAvailable;

    if (showNotificationDrawer.value && hasUpdates.value) {
      await loadHead();
    }
  }

  async function loadEntry(nid: string) {
    return stream.loadEntry(nid);
  }

  async function loadTail() {
    await stream.loadTail();
  }

  async function loadHead() {
    const response = await stream.loadHead();
    // we only show the indicator in case the drawer is not open
    // Todo: what to do if the drawer is hidden behind another one?
    hasUpdates.value = !!response?.models?.length && !showNotificationDrawer.value;
  }

  watch(showNotificationDrawer, (wasOpened) => {
    if (wasOpened && !stream.isInitialized.value) {
      stream.loadTail().then(() => {
        hasUpdates.value = false;
      });
    } else if (wasOpened && hasUpdates.value) {
      loadHead();
    }
  });

  async function markAsSeen(notification: IWebNotification) {
    // We update the state prior the request, just for a better ux
    if (notification.seen) return;

    notification.seen = true;
    return notificationClient.markAsSeen(notification.id);
  }

  const notifications = ref<IWebNotification[]>([]);

  async function test() {
    const result = notificationClient.test();
    console.log(result);
  }

  return {
    stream,
    showNotificationDrawer,
    notifications,
    markAsSeen,
    hasUpdates,
    test,
    loadTail,
    loadEntry,
  };
});
