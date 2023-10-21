<script lang="ts" setup>
import {
  ContentStreamFooter,
  ContentStream,
  ContentDetails,
  ContentDetailsHeader,
} from '../components';
import { ContentModel, ContentStreamFilter } from '@lyvely/core-interface';
import { useContentStreamService, getContentDetailsComponent } from '../services';
import { useRouter } from 'vue-router';
import { computed, ref, watch } from 'vue';
import { useContentStreamFilterStore, useContentStore } from '../stores';
import { storeToRefs } from 'pinia';
import { contentRoute } from '../routes';
import { t } from '@/i18n';

const router = useRouter();
const streamService = useContentStreamService();
const content = ref<ContentModel>();
const { filter } = storeToRefs(useContentStreamFilterStore());
const contentStore = useContentStore();

filter.value = new ContentStreamFilter({
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
        content.value = await streamService.loadEntry(cid);
        filter.value = new ContentStreamFilter({ parentId: cid });
        contentStore.onContentUpdated('*', onContentUpdated);
      }
    }
  },
  { immediate: true },
);

function getDetailsComponent(content: ContentModel) {
  return getContentDetailsComponent(content) || ContentDetails;
}

const backButtonText = computed(() => {
  if (content.value.meta.parentId) {
    return t('content.stream.back-to-parent');
  } else {
    return t('content.stream.back-to-stream');
  }
});

function backToStream() {
  if (content.value.meta.parentId) {
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
        class="flex flex-col mx-0 mt-0 md:mx-2 mb-2 border border-divide md:rounded">
        <content-details-header :content="content" />
        <div class="border-divide">
          <component :is="getDetailsComponent(content)" :model="content" />
        </div>
      </div>
      <div v-else class="p-2 md:p-4 m-4 border border-divide bg-main rounded">
        <ly-loader />
      </div>
      <div class="flex justify-center gap-1 items-center w-full mb-2">
        <ly-button
          class="secondary uppercase text-xxs py-1 font-semibold text-secondary dark:text-secondary"
          @click="backToStream">
          {{ backButtonText }}
        </ly-button>
        <ly-button
          v-if="!stream.state.value.isEnd"
          class="secondary uppercase text-xxs py-1 font-semibold text-secondary dark:text-secondary"
          @click="stream.loadTail().then(() => stream.scrollToTail())"
          >{{ $t('common.load_more') }}</ly-button
        >
      </div>
    </template>
  </content-stream>
  <content-stream-footer v-if="content" :parent="content" />
</template>

<style scoped></style>
