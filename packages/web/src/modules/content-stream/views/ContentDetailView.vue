<script lang="ts" setup>
import ContentStreamFooter from '@/modules/content-stream/components/ContentStreamFooter.vue';
import ContentStream from '@/modules/content-stream/components/ContentStream.vue';
import { ContentModel, ContentStreamFilter } from '@lyvely/common';
import { useContentStreamService } from '@/modules/content-stream/services/content-stream.service';
import { useRouter } from 'vue-router';
import { ref, watch } from 'vue';
import { contentRoute } from '@/modules/content-stream/routes/route.utils';
import { useContentStreamFilterStore } from '@/modules/content-stream/stores/content-stream-filter.store';
import { getContentDetailsComponent } from '@/modules/content-stream/components/content-stream-entry.registry';
import { storeToRefs } from 'pinia';

const router = useRouter();
const streamService = useContentStreamService();
const content = ref<ContentModel>();
const { filter } = storeToRefs(useContentStreamFilterStore());

filter.value = new ContentStreamFilter({
  parent: router.currentRoute.value.params.cid as string,
});

watch(
  router.currentRoute,
  async (to) => {
    if (to.name === 'content-details' && to.params.cid) {
      const cid = to.params.cid as string;
      if (content.value?.id !== cid) {
        content.value = await streamService.loadEntry(cid);
        filter.value = new ContentStreamFilter({ parent: cid });
      }
    }
  },
  { immediate: true },
);

function back() {
  if (content.value!.meta.parentId) {
    router.push(contentRoute(content.value!.pid, content.value!.meta.parentId));
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
        class="flex flex-col mx-0 mt-0 md:mx-2 mb-4 border border-divide md:rounded divide-y">
        <div class="px-1 md:p-2 bg-main border-divide rounded-t w-full">
          <div class="flex items-center">
            <ly-button class="text-sm" @click="back">
              <ly-icon name="arrow-left" class="w-3 mr-2" /><span>{{ $t('common.back') }}</span>
            </ly-button>
            <div class="px-1.5 ml-auto inline">
              <ly-icon
                v-if="content.meta.archived"
                name="archive"
                :title="$t('common.archived')"
                class="w-4 text-warning ml-auto" />
            </div>
          </div>
        </div>
        <div class="border-divide">
          <component :is="getContentDetailsComponent(content)" :model="content" />
        </div>
      </div>
      <div v-else class="p-2 md:p-4 m-4 border border-divide bg-main rounded">
        <ly-loader />
      </div>
      <div v-if="!stream.state.value.isEnd" class="flex justify-center">
        <ly-button
          class="secondary text-xs"
          @click="stream.loadTail().then(() => stream.scrollToTail())"
          >{{ $t('common.load_more') }}</ly-button
        >
      </div>
    </template>
  </content-stream>
  <content-stream-footer v-if="content" />
</template>

<style scoped></style>
