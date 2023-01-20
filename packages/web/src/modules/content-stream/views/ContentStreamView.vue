<script lang="ts" setup>
import ContentStreamFooter from '@/modules/content-stream/components/ContentStreamFooter.vue';
import ContentStream from '@/modules/content-stream/components/ContentStream.vue';
import { ContentModel, ContentStreamFilter } from '@lyvely/common';
import { onUnmounted, ref } from 'vue';
import { IStream } from '@/modules/stream/composables/stream.composable';
import { useRouter } from 'vue-router';
import { useContentStore } from '@/modules/content/stores/content.store';

const router = useRouter();
const filter = ref(new ContentStreamFilter());
filter.value.fromQuery(router.currentRoute.value.query);

const streamComponent = ref<{ stream: IStream<ContentModel> }>();

const contentStore = useContentStore();
const onContentCreated = (content: ContentModel) => {
  streamComponent.value!.stream.addHead([content], true);
};
contentStore.onContentCreated('*', onContentCreated);
onUnmounted(() => contentStore.offContentCreated('*', onContentCreated));
</script>

<template>
  <content-stream ref="streamComponent" :filter="filter" :batch-size="40" />
  <content-stream-footer :filter="filter" />
</template>

<style scoped></style>
