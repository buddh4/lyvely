<script lang="ts" setup>
import { JournalModel } from '@lyvely/journals-interface';
import { ContentModel, IStream, ContentStreamEntry } from '@lyvely/web';
import { LyIcon, LyMarkdownView } from '@lyvely/ui';

export interface IProps {
  model: JournalModel;
  stream: IStream<ContentModel>;
  index: number;
}

const props = defineProps<IProps>();
</script>

<template>
  <content-stream-entry v-bind="props">
    <template #image>
      <div class="flex h-8 w-8 justify-center rounded-full border border-divide bg-main">
        <router-link :to="{ name: 'Journals' }">
          <ly-icon name="activity" class="text-main" />
        </router-link>
      </div>
    </template>

    <template #default>
      <div>
        <h1 v-if="model.content.title?.length">{{ model.content.title }}</h1>
        <ly-markdown-view :md="model.content.text" />
      </div>
    </template>
  </content-stream-entry>
</template>

<style scoped></style>
