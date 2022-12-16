import { defineStore } from 'pinia';
import { ref } from 'vue';
import { IWebNotification, NewNotificationLiveEvent, StreamDirection } from '@lyvely/common';
import { useNotificationService } from '@/modules/notifications/services/notifications.service';
import { useStream } from '@/modules/stream/composables/stream.composable';
import { useLiveStore } from '@/modules/live/stores/live.store';

export const useNotificationStore = defineStore('notifications', () => {
  const liveStore = useLiveStore();
  const showNotificationDrawer = ref(false);
  const stream = useStream(
    {
      batchSize: 15,
      direction: StreamDirection.TTB,
    },
    useNotificationService(),
  );

  liveStore.on('notifications', NewNotificationLiveEvent.eventName, () => {
    update();
  });

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

  const notifications = ref<IWebNotification[]>([]);

  async function test() {
    const result = useNotificationService().test();
    console.log(result);
  }

  return {
    stream,
    showNotificationDrawer,
    notifications,
    test,
  };
});
