<script lang="ts" setup>
import ContentStreamFooter from '@/modules/content-stream/components/ContentStreamFooter.vue';
import ContentStream from '@/modules/content-stream/components/ContentStream.vue';
import { ContentModel, ContentStreamFilter } from '@lyvely/common';
import { ref } from 'vue';
import { IStream } from '@/modules/stream/composables/stream.composable';

const filter = new ContentStreamFilter();
const streamComponent = ref<{ stream: IStream<ContentModel> }>();

async function onContentCreated(content: ContentModel) {
  const stream = streamComponent.value!.stream;
  await stream.addHead([content]);
  await stream.scrollToStart();
}
</script>

<template>
  <content-stream ref="streamComponent" :filter="filter" />
  <content-stream-footer :filter="filter" @content-created="onContentCreated" />
</template>

<style scoped></style>
