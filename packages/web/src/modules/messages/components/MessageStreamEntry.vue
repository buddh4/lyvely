<script lang="ts" setup>
import { MessageModel } from '@lyvely/common';
import LyUserAvatar from '@/modules/users/components/UserAvatar.vue';
import RelativeTime from '@/modules/calendar/components/RelativeTime.vue';

export interface IProps {
  model: MessageModel;
}

const props = defineProps<IProps>();
const name = 'buddh4';
</script>

<template>
  <div>
    <div class="flex items-stretch w-full gap-2">
      <ly-user-avatar class="w-8 h-8 shadow" />
      <div class="rounded w-full bg-main p-2 shadow border border-divide">
        <div class="text-sm">
          <span class="font-bold mr-1">{{ name }}</span>
          <relative-time :ts="model.meta.createdAt.getTime()"></relative-time>
        </div>
        <div class="text-sm">
          {{ model.content.text }}
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped></style>
