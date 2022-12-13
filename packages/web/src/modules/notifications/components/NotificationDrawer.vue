<script lang="ts" setup>
import { storeToRefs } from 'pinia';
import { useNotificationStore } from '../stores/notifications.store';
import { useRouter } from 'vue-router';
import NotificationDrawerEntry from '@/modules/notifications/components/NotificationDrawerEntry.vue';
import { IWebNotification } from '@lyvely/common';
import { toVueRoute } from '@/modules/core/backend-route.transformer';
import LyButton from '@/modules/ui/components/button/StyledButton.vue';
const notificationStore = useNotificationStore();

const router = useRouter();
const { showNotificationDrawer } = storeToRefs(notificationStore);

function notificationClick(notification: IWebNotification) {
  // Make updateSeen request

  if (notification.route) {
    router.push(toVueRoute(notification.route));
  }
}

function test() {
  notificationStore.test();
}
</script>

<template>
  <ly-drawer
    id="notifications-drawer"
    v-model="showNotificationDrawer"
    title="notifications.drawer.title">
    <ul>
      <li
        v-for="notification in notificationStore.notifications"
        :key="notification.id"
        class="pb-2">
        <notification-drawer-entry
          :notification="notification"
          @click="notificationClick(notification)" />
      </li>
      <li class="pb-2">
        <ly-button class="primary" @click="test">Test</ly-button>
      </li>
    </ul>
  </ly-drawer>
</template>

<style scoped></style>
