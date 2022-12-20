<script lang="ts" setup>
import { IWebNotification, getRelativeTime } from '@lyvely/common';
import { computed } from 'vue';
import { storeToRefs } from 'pinia';
import { useAuthStore } from '@/modules/auth/store/auth.store';

const { locale } = storeToRefs(useAuthStore());

export interface IProps {
  notification: IWebNotification;
}

const props = defineProps<IProps>();
const cssClass = computed(() => [
  'flex border-l-4 hover:bg-highlight cursor-pointer',
  { 'border-transparent': props.notification.seen },
  { 'hover:border-slate-200 dark:hover:border-slate-600': props.notification.seen },
  { 'border-pop': !props.notification.seen },
]);

const timeAgo = computed(() => {
  return getRelativeTime(props.notification.sortOrder - Date.now(), locale.value);
});
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
      <div class="font-bold">{{ notification.title }}</div>
      <div v-html="notification.body"></div>
      <span class="text-dimmed text-xs">{{ timeAgo }}</span>
    </div>
  </div>
</template>

<style scoped></style>
