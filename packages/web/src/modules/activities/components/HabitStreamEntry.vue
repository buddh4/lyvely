<script lang="ts" setup>
import { ContentModel, TaskModel } from '@lyvely/common';
import ContentStreamEntry from '@/modules/content-stream/components/ContentStreamEntry.vue';
import { IStream } from '@/modules/stream/composables/stream.composable';

export interface IProps {
  model: TaskModel;
  stream: IStream<ContentModel>;
  index: number;
}

const props = defineProps<IProps>();
</script>

<template>
  <content-stream-entry v-bind="props">
    <template #image>
      <div class="flex justify-center rounded-full border border-divide w-8 h-8 bg-main">
        <ly-icon name="activity" />
      </div>
    </template>
    {{ model.content.title }}
    {{ model.content.text }}
  </content-stream-entry>
</template>

<style scoped></style>
