<script lang="ts" setup>
import { MilestoneModel } from '@lyvely/milestones-interface';
import { ContentModel, IStream, ContentStreamEntry } from '@lyvely/web';
import { LyIcon, LyMarkdownView } from '@lyvely/ui';

export interface IProps {
  model: MilestoneModel;
  stream: IStream<ContentModel>;
  index: number;
}

const props = defineProps<IProps>();
</script>

<template>
  <content-stream-entry v-bind="props" :merge="true">
    <template #image>
      <div class="flex h-8 w-8 justify-center rounded-full border border-divide bg-main">
        <router-link :to="{ name: 'Milestones' }">
          <ly-icon name="target" class="h-3.5 text-main" />
        </router-link>
      </div>
    </template>

    <template #default>
      <h1 v-if="model.content.title?.length">{{ model.content.title }}</h1>
      <ly-markdown-view :md="model.content.text" />
    </template>
  </content-stream-entry>
</template>

<style scoped></style>
