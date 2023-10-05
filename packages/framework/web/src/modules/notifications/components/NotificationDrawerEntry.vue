<script lang="ts" setup>
import { IWebNotification } from '@lyvely/notifications-interface';
import { computed } from 'vue';
import { storeToRefs } from 'pinia';
import { useAuthStore } from '@/modules/auth/store/auth.store';
import RelativeTime from '@/modules/calendar/components/RelativeTime.vue';

export interface IProps {
  notification: IWebNotification;
}

const props = defineProps<IProps>();

const { locale } = storeToRefs(useAuthStore());

const cssClass = computed(() => [
  'flex border-l-4 hover:bg-highlight cursor-pointer',
  { 'border-transparent': props.notification.seen },
  { 'hover:border-slate-200 dark:hover:border-slate-600': props.notification.seen },
  { 'border-pop': !props.notification.seen },
]);
</script>

<template>
  <div :class="cssClass">
    <div class="p-2 w-12">
      <ly-avatar
        v-if="notification.userInfo"
        :guid="notification.userInfo.imageGuid"
        :name="notification.userInfo.name" />
      <ly-avatar
        v-else-if="notification.profileInfo"
        :guid="notification.profileInfo.imageGuid"
        :name="notification.profileInfo.name" />
    </div>
    <div class="flex flex-col p-2 pl-0 gap-1 text-sm w-full">
      <div class="line-clamp-2" v-html="notification.body"></div>
      <relative-time :ts="notification.sortOrder" />
    </div>
  </div>
</template>

<style scoped></style>
