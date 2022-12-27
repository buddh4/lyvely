<script lang="ts" setup>
import ContentStreamMessageInput from '@/modules/content-stream/components/ContentStreamMessageInput.vue';
import ContentStream from '@/modules/content-stream/components/ContentStream.vue';
import { ContentModel, ContentStreamFilter } from '@lyvely/common';
import { ref } from 'vue';
import { IStream } from '@/modules/stream/composables/stream.composable';

const filter = new ContentStreamFilter();
const streamComponent = ref<{ stream: IStream<ContentModel> }>();

function onContentCreated(content: ContentModel) {
  const stream = streamComponent.value!.stream;
  stream.scrollToStart();
}
</script>

<template>
  <div class="h-full flex flex-col-reverse items-stretch">
    <div class="max-h-full flex items-stretch flex-col-reverse items-stretch h-full">
      <content-stream-message-input @contentCreated="onContentCreated" />
      <content-stream ref="streamComponent" :filter="filter" />
    </div>
  </div>
</template>

<style scoped></style>
