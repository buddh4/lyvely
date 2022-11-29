<script lang="ts" setup>
import { IWebNotification } from '@lyvely/common';
import { computed } from 'vue';

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
</script>

<template>
  <div :class="cssClass">
    <div class="p-2 w-12">
      <ly-avatar v-if="notification.source" :guid="notification.source.guid" :name="notification.source.name" />
    </div>
    <div class="flex flex-col p-2 pl-0 gap-1 text-sm w-full">
      <div class="font-bold">{{ notification.title }}</div>
      <div v-html="notification.body"></div>
    </div>
  </div>
</template>

<style scoped></style>
