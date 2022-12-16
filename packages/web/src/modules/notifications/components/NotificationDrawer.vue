<script lang="ts" setup>
import { storeToRefs } from 'pinia';
import { watch, toRefs, ref } from 'vue';
import { useNotificationStore } from '../stores/notifications.store';
import { useRouter } from 'vue-router';
import NotificationDrawerEntry from '@/modules/notifications/components/NotificationDrawerEntry.vue';
import { IWebNotification } from '@lyvely/common';
import { toVueRoute } from '@/modules/core/backend-route.transformer';

const notificationStore = useNotificationStore();
const { showNotificationDrawer } = storeToRefs(notificationStore);
const stream = ref(notificationStore.stream);

const router = useRouter();

function notificationClick(notification: IWebNotification) {
  // Make updateSeen request
  // TODO: mark seen in background
  notification.seen = true;

  if (notification.route) {
    router.push(toVueRoute(notification.route));
  }
}

function test() {
  notificationStore.test();
}

watch(showNotificationDrawer, () => {
  if (!stream.value.isInitialized()) {
    stream.value.next();
  }
});
</script>

<template>
  <ly-drawer
    id="notifications-drawer"
    v-model="showNotificationDrawer"
    title="notifications.drawer.title">
    <ul>
      <li v-for="notification in stream.models" :key="notification.id" class="pb-2">
        <notification-drawer-entry
          :notification="notification"
          @click="notificationClick(notification)" />
      </li>
      <li class="pb-2">
        <ly-button class="primary" @click="test">Test</ly-button>
      </li>
      <li v-if="stream.nextStatus.isStatusLoading()">loading...</li>
    </ul>
  </ly-drawer>
</template>

<style scoped></style>
