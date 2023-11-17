<script lang="ts" setup>
import { ContentModel } from '@lyvely/core-interface';
import ContentStreamEntry from './ContentStreamEntry.vue';
import { IStream } from '@/stream/composables/stream.composable';
import { LyMarkdownView } from '@lyvely/ui';

export interface IProps {
  model: ContentModel;
  stream: IStream<ContentModel>;
  index: number;
}

const props = defineProps<IProps>();
</script>

<template>
  <content-stream-entry v-bind="props" body-style="message" :merge="true" :message-width="true" />
</template>
