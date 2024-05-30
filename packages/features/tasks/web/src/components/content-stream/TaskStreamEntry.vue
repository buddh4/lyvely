<script lang="ts" setup>
import { TaskModel } from '@lyvely/tasks-interface';
import { ContentModel, ContentStreamEntry, IStream } from '@lyvely/web';
import { LyIcon } from '@lyvely/ui';

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
        <div class="flex items-center gap-1">
          <span>{{ model.content.title }}</span>
        </div>
        <p v-if="model.content.text?.length" class="text-sm text-dimmed">
          {{ model.content.text }}
        </p>
      </div>
    </template>
  </content-stream-entry>
</template>

<style scoped></style>
