<script lang="ts" setup>
import ContentStreamFilterNavigation from '@/modules/content-stream/components/ContentStreamFilterNavigation.vue';
import ContentStreamEditor from '@/modules/content-stream/components/ContentStreamEditor.vue';
import { storeToRefs } from 'pinia';
import { getContentStreamEntryComponent } from '@/modules/content-stream/components/content-stream-entry.registry';
import { useCreateMessageStore } from '@/modules/messages/stores/message.store';
import { useContentStreamStore } from '@/modules/content-stream/stores/content-stream.store';
import { onMounted, onUnmounted, ref, nextTick } from 'vue';
import { useInfiniteScroll } from '@vueuse/core';
import { ContentModel } from '@lyvely/common';
import { DynamicScroller, DynamicScrollerItem } from 'vue-virtual-scroller';
import { hasOverflow } from '@/util/dom.util';

const contentStreamStore = useContentStreamStore();
const createMessageStore = useCreateMessageStore();
const { model } = storeToRefs(createMessageStore);
const stream = ref(contentStreamStore.stream);
const streamRoot = ref<HTMLElement | null>(null);

function submitMessage() {
  createMessageStore.submit();
}

async function loadNext() {
  const isScrollBottom = isScrolledToBottom();
  await stream.value.next();
  await nextTick(() => {
    if (isScrollBottom) scrollToBottom();
  });
}

function scrollToBottom() {
  streamRoot.value!.scrollTop = streamRoot.value!.scrollHeight;
}

function isScrolledToBottom() {
  const root = document.getElementById('contentStreamRoot') as HTMLElement;
  return root.scrollTop === root.scrollHeight - root.offsetHeight;
}

const isBottomScroll = ref(false);

stream.value.events.on('pre.update', () => {
  isBottomScroll.value = isScrolledToBottom();
  debugger;
});

stream.value.events.on('post.update', () => {
  console.log(isBottomScroll.value);
  nextTick(() => {
    if (isBottomScroll.value) scrollToBottom();
  });
});

onMounted(async () => {
  contentStreamStore.isActive = true;
  const s = stream.value;
  while (!hasOverflow(streamRoot.value!) && !s.state.isEnd && !s.nextStatus.isStatusError()) {
    await loadNext();
    await nextTick();
    scrollToBottom();
  }
});

onUnmounted(() => (contentStreamStore.isActive = false));

useInfiniteScroll(
  streamRoot,
  () => {
    loadNext();
  },
  { distance: 400, direction: 'top' },
);
</script>

<template>
  <div class="max-h-full flex items-stretch flex-col-reverse items-stretch p-0.5 pb-0 pt-1 md:px-6">
    <div class="p-4 rounded-t bg-body">
      <div class="mb-4">
        <content-stream-filter-navigation />
      </div>
      <content-stream-editor v-model="model.text" @submit="submitMessage" />
    </div>

    <div id="contentStreamRoot" ref="streamRoot" class="overflow-auto scrollbar-thin">
      <dynamic-scroller :items="stream.models" :min-item-size="100" class="h-full">
        <template
          #default="{
            item,
            index,
            active,
          }: {
            item: ContentModel,
            index: number,
            active: boolean,
          }">
          <dynamic-scroller-item :item="item" :active="active" :data-index="index">
            <Component
              :is="getContentStreamEntryComponent(item.type)"
              v-if="getContentStreamEntryComponent(item.type)"
              :model="item"
              :stream="stream"
              :index="index" />
          </dynamic-scroller-item>
        </template>
      </dynamic-scroller>
    </div>
  </div>
</template>

<style scoped></style>
