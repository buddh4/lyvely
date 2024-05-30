<script lang="ts" setup>
import {
  ContentStreamFooter,
  ContentStream,
  ContentDetails,
  ContentDetailsHeader,
} from '../components';
import { ContentModel, ContentRequestFilter, useContentStreamClient } from '@lyvely/interface';
import { getContentDetailsComponent } from '../registries';
import { useRouter } from 'vue-router';
import { computed, ref, watch } from 'vue';
import { useContentStreamFilter, useContentStore } from '../stores';
import { contentRoute } from '../routes/content-route.helper';
import { t } from '@/i18n';

const router = useRouter();
const streamClient = useContentStreamClient();
const content = ref<ContentModel>();
const { filter } = useContentStreamFilter();
const contentStore = useContentStore();

filter.value = new ContentRequestFilter({
  parentId: router.currentRoute.value.params.cid as string,
});

function onContentUpdated(updatedContent: ContentModel) {
  if (updatedContent.id === content.value?.id) {
    content.value = updatedContent;
  }
}

watch(
  router.currentRoute,
  async (to) => {
    if (to.name === 'content-details' && to.params.cid) {
      const cid = to.params.cid as string;
      if (content.value?.id !== cid) {
        content.value = await streamClient.loadEntry(cid);
        filter.value = new ContentRequestFilter({ parentId: cid });
        contentStore.onContentUpdated('*', onContentUpdated);
      }
    }
  },
  { immediate: true }
);

function getDetailsComponent(content: ContentModel) {
  return getContentDetailsComponent(content) || ContentDetails;
}

const backButtonText = computed(() => {
  if (content.value?.meta.parentId) {
    return t('content.stream.back-to-parent');
  } else {
    return t('content.stream.back-to-stream');
  }
});

function backToStream() {
  if (content.value?.meta.parentId) {
    router.push(contentRoute(content.value.pid, content.value.meta.parentId));
  } else {
    router.push({ name: 'stream' });
  }
}
</script>

<template>
  <content-stream
    v-if="content"
    :key="content.id"
    :scroll-to-head="false"
    :infinite-scroll="false"
    :batch-size="100">
    <template #before="{ stream }">
      <div
        v-if="content"
        class="mx-0 mb-2 mt-0 flex flex-col border border-divide md:mx-2 md:rounded">
        <content-details-header :content="content" />
        <div class="border-divide">
          <component :is="getDetailsComponent(content)" :model="content" />
        </div>
      </div>
      <div v-else class="m-4 rounded border border-divide bg-main p-2 md:p-4">
        <ly-loader />
      </div>
      <div class="mb-2 flex w-full items-center justify-center gap-1">
        <ly-button
          class="secondary py-1 text-xxs font-semibold uppercase text-secondary dark:text-secondary"
          @click="backToStream">
          {{ backButtonText }}
        </ly-button>
        <ly-button
          v-if="!stream.state.value.isEnd"
          class="secondary py-1 text-xxs font-semibold uppercase text-secondary dark:text-secondary"
          @click="stream.loadTail().then(() => stream.scrollToTail())"
          >{{ t('common.load_more') }}</ly-button
        >
      </div>
    </template>
  </content-stream>
  <content-stream-footer v-if="content" :parent="content" />
</template>

<style scoped></style>
