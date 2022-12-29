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
    <div class="md:w-2/3">
      <div
        class="message-bubble inline-block hover:bg-highlight dark:hover:bg-highlight bg-main border border-divide px-4 py-1.5 rounded-3xl">
        <span>
          {{ model.content.text }}
        </span>
      </div>
    </div>
  </content-stream-entry>
</template>
