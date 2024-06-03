<script lang="ts" setup>
import { ContentModel } from '@lyvely/interface';
import { ContentStreamEntry } from '@/content';
import { LyMarkdownView } from '@lyvely/ui';
import { IStream } from '@/stream';

export interface IProps {
  model: ContentModel;
  stream: IStream<ContentModel>;
  index: number;
}

const props = defineProps<IProps>();
</script>

<template>
  <content-stream-entry
    v-bind="props"
    body-style="message"
    :merge="true"
    :message-width="true"
    :show-type="false">
    <div>
      <ly-markdown-view :md="model.content.text!" class="text-sm" :max-height="true" />
    </div>
  </content-stream-entry>
</template>
