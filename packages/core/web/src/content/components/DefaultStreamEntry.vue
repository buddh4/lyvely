<script lang="ts" setup>
import { ContentModel } from '@lyvely/interface';
import ContentStreamEntry from './ContentStreamEntry.vue';
import { IStream } from '@/stream/stream.composable';

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
