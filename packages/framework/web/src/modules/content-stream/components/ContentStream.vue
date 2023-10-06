<script lang="ts" setup>
import { getContentStreamEntryComponent } from '@/modules/content-stream/components/content-stream-entry.registry';
import { nextTick, onMounted, onUnmounted, ref, Ref, watch, WatchStopHandle } from 'vue';
import {
  ContentModel,
  ContentStreamFilter,
  ContentUpdateStateLiveEvent,
} from '@lyvely/content-interface';
import { StreamDirection } from '@lyvely/streams-interface';
import { useLiveStore } from '@/modules/live/stores/live.store';
import { useProfileStore } from '@/modules/profiles/stores/profile.store';
import { storeToRefs } from 'pinia';
import { useContentStreamHistoryStore } from '@/modules/content-stream/stores/content-stream-history.store';
import { onBeforeRouteLeave } from 'vue-router';
import { useStream } from '@/modules/stream/composables/stream.composable';
import { useContentStreamService } from '@/modules/content-stream/services/content-stream.service';
import { useContentStore } from '@/modules/content/stores/content.store';
import { scrollToBottom } from '@/util/dom.util';
import { useContentStreamFilterStore } from '@/modules/content-stream/stores/content-stream-filter.store';

export interface IProps {
  batchSize?: number;
  scrollToHead?: boolean;
  infiniteScroll?: boolean;
}

const props = withDefaults(defineProps<IProps>(), {
  batchSize: 50,
  scrollToHead: true,
  infiniteScroll: true,
});

const { filter } = storeToRefs(useContentStreamFilterStore());
const streamRoot = ref<HTMLElement>() as Ref<HTMLElement>;
const { profile } = storeToRefs(useProfileStore());
const live = useLiveStore();

async function doScrollToHead(attempt = 0): Promise<void> {
  return new Promise((resolve) => {
    setTimeout(() => {
      nextTick(() => {
        scrollToBottom(streamRoot.value);
        if (attempt < 3 && streamRoot.value.scrollTop !== streamRoot.value.scrollHeight) {
          doScrollToHead(++attempt).then(resolve);
        } else {
          resolve();
        }
      });
    }, 100);
  });
}

const { getHistoryState, removeHistoryState, resetHistory } = useContentStreamHistoryStore();
const stream = useStream<ContentModel, ContentStreamFilter>(
  {
    root: streamRoot,
    filter: filter,
    batchSize: props.batchSize,
    direction: StreamDirection.BBT,
    scrollToHeadOnInit: props.scrollToHead,
    infiniteScroll: props.infiniteScroll ? { distance: 100 } : false,
    scrollToHead: doScrollToHead,
  },
  useContentStreamService(),
);

const { models, isInitialized } = stream;

async function initOrRestore() {
  const history = getHistoryState(filter.value.parentId);
  if (history) {
    await stream.restore(history);
    removeHistoryState(filter.value.parentId);
  } else {
    await stream.init();
  }
}

onBeforeRouteLeave((to) => {
  // TODO: this is a bit ugly..
  if (!to.name || !['content-details', 'stream'].includes(to.name as string)) {
    resetHistory();
  } else if (to.params.cid) {
    useContentStreamHistoryStore().setHistoryState(
      stream,
      filter.value.parentId,
      streamRoot.value.scrollTop,
    );
  }
});

function selectTag(tagId: string) {
  filter.value.addTagId(tagId);
}

function onContentUpdate(evt: ContentUpdateStateLiveEvent) {
  if (
    evt.pid === profile.value?.id &&
    evt.updatesAvailable &&
    filter.value.parentId === evt.parentId
  ) {
    stream.loadHead();
  }
}

const contentStore = useContentStore();
const onContentCreated = (content: ContentModel) => {
  // TODO: We need to filter by all active filters here
  if (filter.value.parentId === content.meta.parentId) {
    stream.addHead([content], true);
  }
};

let unWatchFilter: WatchStopHandle;

onMounted(() => {
  initOrRestore().then(() => {
    live.on('content', ContentUpdateStateLiveEvent.eventName, onContentUpdate);
    unWatchFilter = watch(filter, () => stream.reload(), { deep: true });
    contentStore.onContentCreated('*', onContentCreated);
  });
});

onUnmounted(() => {
  if (unWatchFilter) unWatchFilter();
  live.off('content', ContentUpdateStateLiveEvent.eventName, onContentUpdate);
  contentStore.offContentCreated('*', onContentCreated);
});
</script>

<template>
  <div
    id="contentStreamRoot"
    ref="streamRoot"
    v-mobile-scrollbar
    class="overflow-auto scrollbar-thin pt-2 md:pt-4 md:p-1 flex-grow">
    <slot name="before" :stream="stream"></slot>
    <div class="px-2 md:px-6">
      <template v-for="(model, index) in models" :key="model.id">
        <Component
          :is="getContentStreamEntryComponent(model)"
          :model="model"
          :stream="stream"
          :index="index"
          @select-tag="selectTag" />
      </template>
    </div>
  </div>
  <div v-if="!isInitialized" class="absolute bg-body w-full h-full bg-body z-50">
    <div class="flex items-center w-full h-full justify-center">
      <ly-loader />
    </div>
  </div>
</template>

<style scoped></style>
