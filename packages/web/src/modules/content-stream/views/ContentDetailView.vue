<script lang="ts" setup>
import ContentStreamFooter from '@/modules/content-stream/components/ContentStreamFooter.vue';
import ContentStream from '@/modules/content-stream/components/ContentStream.vue';
import { ContentModel, ContentStreamFilter } from '@lyvely/common';
import { useContentStreamService } from '@/modules/content-stream/services/content-stream.service';
import { useRouter } from 'vue-router';
import { ref, watch, computed } from 'vue';
import LyUserAvatar from '@/modules/users/components/UserAvatar.vue';
import RelativeTime from '@/modules/calendar/components/RelativeTime.vue';
import TextTrimmed from '@/modules/ui/components/text/TextTrimmed.vue';
import { IStream } from '@/modules/stream/composables/stream.composable';
import LyButton from '@/modules/ui/components/button/StyledButton.vue';
import { contentRoute } from '@/modules/content-stream/routes';

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
    if (to.name === 'ContentDetails' && to.params.cid) {
      return loadContent(to.params.cid as string);
    }
  },
  { immediate: true },
);

async function onContentCreated(content: ContentModel) {
  const stream = streamComponent.value!.stream;
  await stream.addUpdates([content]);
  await stream.scrollToStart();
}

function back() {
  if (content.value!.meta.parentId) {
    router.push(contentRoute(content.value!.pid, content.value!.meta.parentId));
  } else {
    router.push({ name: 'Stream' });
  }
}
</script>

<template>
  <div class="h-full flex flex-col items-stretch">
    <div class="max-h-full flex items-stretch flex-col h-full">
      <content-stream
        ref="streamComponent"
        :filter="filter"
        :scroll-to-start="false"
        :batch-size="100">
        <template #before>
          <div
            v-if="content"
            class="flex flex-col mx-0 mt-0 md:mx-2 md:mt-2 mb-4 border border-divide md:rounded divide-y">
            <div class="px-1 md:p-2 bg-main border-divide rounded-t w-full">
              <ly-button class="text-sm" @click="back">
                <ly-icon name="arrow-left" class="w-3 mr-2" /><span>{{ $t('common.back') }}</span>
              </ly-button>
            </div>
            <div class="p-2 md:p-4 bg-shadow border-divide w-full">
              <div class="flex items-center justify-items-stretch gap-2">
                <ly-user-avatar class="w-8 h-8" />
                <div class="flex flex-col">
                  <text-trimmed class="font-bold" :max="130" :text="content.getTitle()" />
                  <relative-time :ts="content.meta.createdAt.getTime()"></relative-time>
                </div>
              </div>
            </div>
            <div class="p-2 md:p-4 bg-main border-divide rounded-b">
              {{ content.content.text }}
            </div>
          </div>
          <div v-else class="p-2 md:p-4 m-4 border border-divide bg-main rounded">Loading...</div>
        </template>
      </content-stream>
      <content-stream-footer :parent-id="contentId" @content-created="onContentCreated" />
    </div>
  </div>
</template>

<style scoped></style>
