import { defineStore } from 'pinia';
import { ref } from 'vue';
import { IWebNotification, StreamDirection } from '@lyvely/common';
import { useNotificationService } from '@/modules/notifications/services/notifications.service';
import { useStream } from '@/modules/stream/composables/stream.composable';

export const useNotificationStore = defineStore('notifications', () => {
  const showNotificationDrawer = ref(false);
  const stream = useStream(
    {
      batchSize: 15,
      direction: StreamDirection.TTB,
    },
    useNotificationService(),
  );

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
