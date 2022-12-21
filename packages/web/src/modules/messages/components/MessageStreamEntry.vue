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
    <div class="flex items-stretch w-full gap-3">
      <ly-user-avatar class="w-8 h-8 shadow mt-1" />
      <div
        class="content-stream-entry-content relative rounded w-full bg-main p-4 shadow border border-divide">
        <div class="text-sm mb-2">
          <span class="font-bold mr-1">{{ name }}</span>
          <relative-time :ts="model.meta.createdAt.getTime()"></relative-time>
        </div>
        <div>
          {{ model.content.text }}
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.content-stream-entry-content::after,
.content-stream-entry-content::before {
  background-color: var(--color-divide);
  background-image: linear-gradient(var(--elements-main), var(--elements-main));
  position: absolute;
  top: 11px;
  right: 100%;
  left: -8px;
  display: block;
  width: 8px;
  height: 16px;
  pointer-events: none;
  content: ' ';
  clip-path: polygon(0 50%, 100% 0, 100% 100%);
}
</style>
