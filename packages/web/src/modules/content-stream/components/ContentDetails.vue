<script lang="ts" setup>
import RelativeTime from '@/modules/calendar/components/RelativeTime.vue';
import TextTrimmed from '@/modules/ui/components/text/TextTrimmed.vue';
import { ContentModel } from '@lyvely/common';

export interface IProps {
  model: ContentModel;
}

defineProps<IProps>();
</script>

<template>
  <div class="p-2 md:p-4 bg-shadow border-divide w-full">
    <div class="flex items-center justify-items-stretch gap-2">
      <slot name="image">
        <ly-user-avatar class="w-8 h-8" />
      </slot>
      <div class="flex flex-col">
        <slot name="title">
          <text-trimmed class="font-bold" :max="130" :text="model.getTitle()" />
          <relative-time :ts="model.meta.createdAt.getTime()"></relative-time>
        </slot>
      </div>
    </div>
  </div>
  <div class="p-2 md:p-4 bg-main border-divide rounded-b">
    <slot name="body">
      {{ model.content.text }}
    </slot>
  </div>
</template>

<style scoped></style>
