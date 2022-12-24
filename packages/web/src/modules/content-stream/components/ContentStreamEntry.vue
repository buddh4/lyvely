<script lang="ts" setup>
import { ContentModel } from '@lyvely/common';
import { computed } from 'vue';
import RelativeTime from '@/modules/calendar/components/RelativeTime.vue';

export interface IProps {
  model: ContentModel;
}

const props = defineProps<IProps>();
const name = computed(() => 'buddh4');
</script>

<template>
  <div>
    <div class="flex items-stretch w-full gap-2">
      <div class="flex justify-center w-9 pt-2">
        <slot name="image">
          <ly-user-avatar class="w-8 h-8 shadow" />
        </slot>
      </div>
      <div
        class="content-stream-entry-content relative rounded w-full bg-main p-3 shadow border border-divide">
        <div class="text-sm">
          <span class="font-bold mr-1">{{ name }}</span>
          <relative-time :ts="model.meta.streamSort"></relative-time>
        </div>
        <div class="cursor-pointer">
          <slot></slot>
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
