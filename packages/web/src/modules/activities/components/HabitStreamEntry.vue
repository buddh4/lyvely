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

    <div class="border border-divide p-4 rounded-xl bg-main inline-block">
      <b>{{ $t('activities.habits.stream_entry.text') }}:</b>
      {{ model.content.title }}
      {{ model.content.text }}
    </div>
  </content-stream-entry>
</template>

<style scoped></style>
