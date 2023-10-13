<script lang="ts" setup>
import { SystemMessageModel } from '@lyvely/core-interface';
import { useAppConfigStore } from '@/app-config/store/app-config.store';
import ContentDetails from '@/content-stream/components/ContentDetails.vue';
import RelativeTime from '@/calendar/components/RelativeTime.vue';

export interface IProps {
  model: SystemMessageModel;
}

defineProps<IProps>();

const appName = useAppConfigStore().get('appName');
</script>

<template>
  <content-details :model="model">
    <template #image>
      <div class="flex justify-center rounded-full border border-divide w-8 h-8 bg-main">
        <ly-icon name="lyvely" class="text-pop" />
      </div>
    </template>
    <template #title>
      <slot name="title">
        <span class="font-bold">{{
          model.getTitle() ? $t(model.getTitle(), model.content.params || {}) : appName
        }}</span>
        <relative-time :ts="model.meta.createdAt.getTime()"></relative-time>
      </slot>
    </template>
    <template #body>
      <p v-if="model.content.text" class="my-4 text-sm">
        {{ $t(model.content.text, model.content.params || {}) }}
      </p>
    </template>
  </content-details>
</template>
