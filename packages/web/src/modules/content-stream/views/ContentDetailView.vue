<script lang="ts" setup>
import ContentStreamFooter from '@/modules/content-stream/components/ContentStreamFooter.vue';
import ContentStream from '@/modules/content-stream/components/ContentStream.vue';
import { ContentModel, ContentStreamFilter } from '@lyvely/common';
import { useContentStreamService } from '@/modules/content-stream/services/content-stream.service';
import { useRouter } from 'vue-router';
import { ref, watch, computed } from 'vue';
import { IStream } from '@/modules/stream/composables/stream.composable';
import { contentRoute } from '@/modules/content-stream/routes';
import LyLoader from '@/modules/ui/components/loader/LoaderBlock.vue';
import { getContentDetailsComponent } from '@/modules/content-stream/components/content-stream-entry.registry';

const router = useRouter();
const contentId = computed(() => router.currentRoute.value.params.cid as string);
const streamService = useContentStreamService();
const content = ref<ContentModel>();
const filter = ref(new ContentStreamFilter({ parent: contentId.value }));
const streamComponent = ref<{ stream: IStream<ContentModel> }>();

async function loadContent(cid: string) {
  content.value = await streamService.loadEntry(cid);
  filter.value.parent = cid;
}

watch(
  router.currentRoute,
  async (to) => {
    if (to.name === 'content-details' && to.params.cid) {
      return loadContent(to.params.cid as string);
    }
  },
  { immediate: true },
);

async function onContentCreated(content: ContentModel) {
  const stream = streamComponent.value!.stream;
  await stream.addHead([content]);
  await stream.scrollToStart();
}

function back() {
  if (content.value!.meta.parentId) {
    router.push(contentRoute(content.value!.pid, content.value!.meta.parentId));
  } else {
    router.push({ name: 'stream' });
  }
}
</script>

<template>
  <content-stream ref="streamComponent" :filter="filter" :scroll-to-start="false" :batch-size="100">
    <template #before>
      <div
        v-if="content"
        class="flex flex-col mx-0 mt-0 md:mx-2 mb-4 border border-divide md:rounded divide-y">
        <div class="px-1 md:p-2 bg-main border-divide rounded-t w-full">
          <ly-button class="text-sm" @click="back">
            <ly-icon name="arrow-left" class="w-3 mr-2" /><span>{{ $t('common.back') }}</span>
          </ly-button>
        </div>
        <div class="border-divide">
          <component :is="getContentDetailsComponent(content.type)" :model="content" />
        </div>
      </div>
      <div v-else class="p-2 md:p-4 m-4 border border-divide bg-main rounded">
        <ly-loader />
      </div>
    </template>
  </content-stream>
  <content-stream-footer
    :parent-id="contentId"
    :filter="filter"
    @content-created="onContentCreated" />
</template>

<style scoped></style>
