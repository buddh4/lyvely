<script lang="ts" setup>
import { storeToRefs } from 'pinia';
import { ref, computed } from 'vue';
import { useNotificationStore } from '../stores/notifications.store';
import { useRouter } from 'vue-router';
import NotificationDrawerEntry from '@/notifications/components/NotificationDrawerEntry.vue';
import { IWebNotification } from '@lyvely/interface';
import { urlRoute } from '@/profiles';
import { isDevelopEnvironment } from '@/core';

const notificationStore = useNotificationStore();
const { showNotificationDrawer, hasUpdates } = storeToRefs(notificationStore);
const stream = ref(notificationStore.stream);

const router = useRouter();

async function notificationClick(notification: IWebNotification) {
  notificationStore.markAsSeen(notification);

  if (notification.route) {
    router.push(urlRoute(notification.route));
  }
}

async function loadTail() {
  notificationStore.loadTail();
}

const notificationDrawerButtonClass = computed(() => {
  return [
    'relative border rounded-xl inline-flex items-center justify-center h-10 w-11',
    { 'border-divide': showNotificationDrawer.value },
    { 'border-transparent': !showNotificationDrawer.value },
  ];
});

function test() {
  notificationStore.test();
}
</script>

<template>
  <div>
    <ly-button
      :class="notificationDrawerButtonClass"
      @click="showNotificationDrawer = !showNotificationDrawer">
      <ly-icon name="bell" class="w-3.5" />
      <ly-update-indicator v-if="hasUpdates" />
    </ly-button>

    <ly-drawer
      id="notifications-drawer"
      v-model="showNotificationDrawer"
      title="notifications.drawer.title"
      @infinite-scroll="loadTail">
      <div class="h-full">
        <notification-drawer-entry
          v-for="item in stream.models"
          :key="item.id"
          :notification="item"
          @click="notificationClick(item)" />
      </div>

      <template v-if="isDevelopEnvironment()" #footer>
        <ly-button class="primary" @click="test">Test</ly-button>
      </template>
    </ly-drawer>
  </div>
</template>

<style scoped></style>
