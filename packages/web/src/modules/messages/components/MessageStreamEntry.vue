<script lang="ts" setup>
import { ContentModel } from '@lyvely/common';
import ContentStreamEntry from '@/modules/content-stream/components/ContentStreamEntry.vue';
import { IStream } from '@/modules/stream/composables/stream.composable';

export interface IProps {
  model: ContentModel;
  stream: IStream<ContentModel>;
  index: number;
}

const props = defineProps<IProps>();
</script>

<template>
  <content-stream-entry v-bind="props" :merge="true">
    <div class="hover:bg-highlight px-3 py-0.5 rounded-2xl">
      {{ model.content.text }}
    </div>
  </content-stream-entry>
</template>
