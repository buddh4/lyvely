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
  await stream.addUpdates([content]);
  await stream.scrollToStart();
}
</script>

<template>
  <div class="h-full flex flex-col-reverse items-stretch">
    <div class="max-h-full flex items-stretch flex-col-reverse items-stretch h-full">
      <content-stream-footer @content-created="onContentCreated" />
      <content-stream ref="streamComponent" :filter="filter" />
    </div>
  </div>
</template>

<style scoped></style>
