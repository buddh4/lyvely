<script lang="ts" setup>
import { SystemMessageModel, ContentModel } from '@lyvely/interface';
import { ContentStreamEntry, StreamEntryLayout } from '@/content';
import { t } from '@/i18n';
import { IStream } from '@/stream/stream.composable';
import { useAppConfigStore } from '@/app-config/app-config.store';
import { LyMarkdownView } from '@lyvely/ui';

export interface IProps {
  model: SystemMessageModel;
  stream: IStream<ContentModel>;
  index: number;
}

const props = defineProps<IProps>();

const appName = useAppConfigStore().get('appName');
</script>

<template>
  <content-stream-entry
    v-bind="props"
    :layout="StreamEntryLayout.Message"
    icon="lyvely"
    icon-class="text-pop">
    <template #authorName>
      {{ appName }}
    </template>

    <template #default>
      <h1 v-if="model.content.title">
        {{ t(model.content.title, model.content.params || {}) }}
      </h1>
      <span v-if="model.content.text">
        <ly-markdown-view :md="t(model.content.text, model.content.params || {})" />
      </span>
    </template>
  </content-stream-entry>
</template>
