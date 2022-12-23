<script lang="ts" setup>
import { MessageModel, TaskModel } from '@lyvely/common';
import LyUserAvatar from '@/modules/users/components/UserAvatar.vue';
import RelativeTime from '@/modules/calendar/components/RelativeTime.vue';
import LyIcon from '@/modules/ui/components/icon/UIIcon.vue';

export interface IProps {
  model: TaskModel;
}

const props = defineProps<IProps>();
const name = 'buddh4';
</script>

<template>
  <div>
    <div class="flex items-stretch w-full gap-2">
      <div class="flex justify-center w-9 pt-2">
        <div class="flex justify-center rounded-full border border-divide w-8 h-8 bg-main">
          <ly-icon name="activity" />
        </div>
      </div>
      <div
        class="content-stream-entry-content relative rounded w-full bg-main p-3 shadow border border-divide">
        <div class="text-sm">
          <span class="font-bold mr-1">{{ name }}</span>
          <relative-time :ts="model.meta.streamSort"></relative-time>
        </div>
        <div>
          {{ model.content.title }}
          {{ model.content.text }}
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
/*.content-stream-entry-content::after,
.content-stream-entry-content::before {
  background-color: var(--color-divide);
  background-image: linear-gradient(var(--elements-main), var(--elements-main));
  position: absolute;
  top: 15px;
  right: 100%;
  left: -8px;
  display: block;
  width: 8px;
  height: 16px;
  pointer-events: none;
  content: ' ';
  clip-path: polygon(0 50%, 100% 0, 100% 100%);
}*/
</style>
