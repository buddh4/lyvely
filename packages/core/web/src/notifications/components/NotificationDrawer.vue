<script lang="ts" setup>
import { storeToRefs } from 'pinia';
import { ref } from 'vue';
import { useNotificationStore } from '../stores/notifications.store';
import { useRouter } from 'vue-router';
import NotificationDrawerEntry from '@/notifications/components/NotificationDrawerEntry.vue';
import { DynamicScroller, DynamicScrollerItem } from 'vue-virtual-scroller';
import { IWebNotification } from '@lyvely/core-interface';
import { toVueRoute } from '@/profiles/routes/profile-route.util';

const notificationStore = useNotificationStore();
const { showNotificationDrawer } = storeToRefs(notificationStore);
const stream = ref(notificationStore.stream);

const router = useRouter();

async function notificationClick(notification: IWebNotification) {
  notificationStore.markAsSeen(notification);

  if (notification.route) {
    router.push(toVueRoute(notification.route));
  }
}

async function loadTail() {
  notificationStore.loadTail();
}

/*function test() {
  notificationStore.test();
}*/
</script>

<template>
  <ly-drawer
    id="notifications-drawer"
    v-model="showNotificationDrawer"
    title="notifications.drawer.title"
    @infinite-scroll="loadTail">
    <dynamic-scroller :items="stream.models" :min-item-size="80" class="h-full" page-mode>
      <template
        #default="{
          item,
          index,
          active,
        }: {
          item: IWebNotification,
          index: number,
          active: boolean,
        }">
        <dynamic-scroller-item :item="item" :active="active" :data-index="index">
          <notification-drawer-entry :notification="item" @click="notificationClick(item)" />
        </dynamic-scroller-item>
      </template>
    </dynamic-scroller>
    <!-- template #footer>
      <ly-button class="primary" @click="test">Test</ly-button>
    </template -->
  </ly-drawer>
</template>

<style scoped></style>