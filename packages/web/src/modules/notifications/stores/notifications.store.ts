import { defineStore } from 'pinia';
import { ref } from 'vue';
import {
  IWebNotification,
  NewNotificationLiveEvent,
  StreamDirection,
  NotificationMarkedAsSeenLiveEvent,
} from '@lyvely/common';
import { useNotificationService } from '@/modules/notifications/services/notifications.service';
import { useStream } from '@/modules/stream/composables/stream.composable';
import { useLiveStore } from '@/modules/live/stores/live.store';

export const useNotificationStore = defineStore('notifications', () => {
  const liveStore = useLiveStore();
  const notificationService = useNotificationService();
  const showNotificationDrawer = ref(false);
  const stream = useStream(
    {
      batchSize: 15,
      direction: StreamDirection.TTB,
    },
    notificationService,
  );

  liveStore.on('notifications', NewNotificationLiveEvent.eventName, () => {
    update();
  });

  liveStore.on(
    'notifications',
    NotificationMarkedAsSeenLiveEvent.eventName,
    (evt: NotificationMarkedAsSeenLiveEvent) => {
      const notification = stream.models.value.find((notification) => notification.id === evt.nid);
      if (notification && !notification.seen) {
        notification.seen = true;
      }
    },
  );

  async function update() {
    const response = await stream.update();
    if (!response?.models?.length) return;
    if (!showNotificationDrawer.value) {
      // show update indicator
    } else {
      // update lastNotificationCheck for user
      // set indicator false
      // scroll to top or show new updates badge
    }
  }

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
    test,
  };
});
