<script lang="ts" setup>
import { SystemMessageModel } from '@lyvely/core-interface';
import { useAppConfigStore } from '@/app-config';
import { ContentDetails } from '@/content';
import { RelativeTime } from '@/calendar';
import { LyMarkdownView } from '@lyvely/ui';
import { t } from '@/i18n';

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
        <ly-markdown-view :md="t(model.content.text, model.content.params || {})" class="text-sm" />
      </p>
    </template>
  </content-details>
</template>
