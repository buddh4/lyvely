import { defineStore } from 'pinia';
import { ref, watch } from 'vue';
import {
  IWebNotification,
  NotificationUpdateStateLiveEvent,
  StreamDirection,
  NotificationSeenStateLiveEvent,
} from '@lyvely/common';
import { useNotificationService } from '@/modules/notifications/services/notifications.service';
import { useStream } from '@/modules/stream/composables/stream.composable';
import { useLiveStore } from '@/modules/live/stores/live.store';

export const useNotificationStore = defineStore('notifications', () => {
  const live = useLiveStore();
  const notificationService = useNotificationService();
  const showNotificationDrawer = ref(false);
  const hasUpdates = ref(false);
  const moduleId = 'notifications';

  const stream = useStream(
    {
      batchSize: 15,
      direction: StreamDirection.TTB,
    },
    notificationService,
  );

  live.on(moduleId, NotificationUpdateStateLiveEvent.eventName, handleNotificationUpdateStateEvent);
  live.on(moduleId, NotificationSeenStateLiveEvent.eventName, handleMarkedAsSeenEvent);

  function handleMarkedAsSeenEvent(evt: NotificationSeenStateLiveEvent) {
    const notification = stream.models.value.find((notification) => notification.id === evt.nid);
    if (notification && notification.seen !== evt.seen) {
      notification.seen = evt.seen;
    }
  }

  async function handleNotificationUpdateStateEvent(evt: NotificationUpdateStateLiveEvent) {
    hasUpdates.value = evt.updatesAvailable;

    if (showNotificationDrawer.value && hasUpdates.value) {
      await update();
    }
  }

  async function update() {
    const response = await stream.update();
    // we only show the indicator in case the drawer is not open
    // Todo: what to do if the drawer is hidden behind another one?
    hasUpdates.value = !!response?.models?.length && !showNotificationDrawer.value;
  }

  watch(showNotificationDrawer, (wasOpened) => {
    if (wasOpened && !stream.isInitialized()) {
      stream.next().then(() => {
        hasUpdates.value = false;
      });
    } else if (wasOpened && hasUpdates.value) {
      update();
    }
  });

  async function markAsSeen(notification: IWebNotification) {
    // We update the state prior the request, just for a better ux
    if (notification.seen) return;

    notification.seen = true;
    return notificationService.markAsSeen(notification.id);
  }

  const notifications = ref<IWebNotification[]>([]);

  async function test() {
    const result = useNotificationService().test();
    console.log(result);
  }

  return {
    stream,
    showNotificationDrawer,
    notifications,
    markAsSeen,
    hasUpdates,
    test,
  };
});
