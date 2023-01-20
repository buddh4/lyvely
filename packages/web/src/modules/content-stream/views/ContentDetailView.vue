<script lang="ts" setup>
import ContentStreamFooter from '@/modules/content-stream/components/ContentStreamFooter.vue';
import ContentStream from '@/modules/content-stream/components/ContentStream.vue';
import { ContentModel, ContentStreamFilter } from '@lyvely/common';
import { useContentStreamService } from '@/modules/content-stream/services/content-stream.service';
import { onBeforeRouteUpdate, useRouter } from 'vue-router';
import { ref, watch, computed, onUnmounted, onUpdated } from 'vue';
import { contentRoute } from '@/modules/content-stream/routes/route.utils';
import ContentDetailStream from '@/modules/content-stream/components/ContentDetailStream.vue';

const router = useRouter();
const contentId = computed(() => router.currentRoute.value.params.cid as string);
const streamService = useContentStreamService();
const content = ref<ContentModel>();

async function updateEntry() {
  content.value = await streamService.loadEntry(contentId.value);
}

watch(
  router.currentRoute,
  async (to) => {
    if (to.name === 'content-details' && to.params.cid) {
      const cid = to.params.cid as string;
      if (content.value?.id !== cid) {
        await updateEntry();
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
  <content-detail-stream v-if="content" :key="content.id" :content="content" @back="back" />
</template>

<style scoped></style>
