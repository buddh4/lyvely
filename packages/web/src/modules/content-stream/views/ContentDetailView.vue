<script lang="ts" setup>
import ContentStreamMessageInput from '@/modules/content-stream/components/ContentStreamMessageInput.vue';
import ContentStream from '@/modules/content-stream/components/ContentStream.vue';
import { useStream } from '@/modules/stream/composables/stream.composable';
import { ContentModel, ContentStreamFilter, StreamDirection } from '@lyvely/common';
import { useContentStreamService } from '@/modules/content-stream/services/content-stream.service';
import { useRouter } from 'vue-router';
import { ref, watch, computed } from 'vue';

const router = useRouter();
const contentId = computed(() => router.currentRoute.value.params.cid as string);
const streamService = useContentStreamService();
const content = ref<ContentModel>();
const filter = ref(new ContentStreamFilter({ parent: contentId.value }));

async function loadContent(cid: string) {
  content.value = await streamService.loadEntry(cid);
  filter.value.parent = cid;
}

watch(
  router.currentRoute,
  async (to) => {
    if (to.name === 'ContentDetails' && to.params.cid) {
      return loadContent(to.params.cid as string);
    }
  },
  { immediate: true },
);
</script>

<template>
  <div class="h-full flex flex-col items-stretch">
    <div class="max-h-full flex items-stretch flex-col p-0.5 pb-0 pt-1 md:px-6">
      <content-stream :filter="filter">
        <template #before>
          <div v-if="content" class="p-4 m-4 border border-divide bg-main rounded">asdf</div>
          <div v-else class="p-4 m-4 border border-divide bg-main rounded">Loading...</div>
        </template>
      </content-stream>
      <content-stream-message-input />
    </div>
  </div>
</template>

<style scoped></style>
