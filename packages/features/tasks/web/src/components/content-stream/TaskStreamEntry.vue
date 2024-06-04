<script lang="ts" setup>
import { TaskModel } from '@lyvely/tasks-interface';
import { ContentModel, ContentStreamEntry, IStream } from '@lyvely/web';
import { LyIcon, LyMarkdownView } from '@lyvely/ui';

export interface IProps {
  model: TaskModel;
  stream: IStream<ContentModel>;
  index: number;
}

const props = defineProps<IProps>();
</script>

<template>
  <content-stream-entry v-bind="props" :merge="true">
    <template #image>
      <div class="flex h-8 w-8 justify-center rounded-full border border-divide bg-main">
        <router-link :to="{ name: 'Tasks' }">
          <ly-icon name="task" class="text-main" />
        </router-link>
      </div>
    </template>

    <template #default>
      <div>
        <h1>{{ model.content.title }}</h1>
        <ly-markdown-view :md="model.content.text" />
      </div>
    </template>
  </content-stream-entry>
</template>

<style scoped></style>
