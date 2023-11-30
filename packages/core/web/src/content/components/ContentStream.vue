<script lang="ts" setup>
import { getContentStreamEntryComponent } from '../registries';
import { t } from '@/i18n';
import { nextTick, onMounted, onUnmounted, ref, Ref, watch, WatchStopHandle } from 'vue';
import {
  ContentModel,
  ContentStreamFilter,
  ContentUpdateStateLiveEvent,
  StreamDirection,
  useContentStreamClient,
} from '@lyvely/interface';
import { useLiveStore } from '@/live/stores/live.store';
import { useProfileStore } from '@/profiles/stores/profile.store';
import { storeToRefs } from 'pinia';
import {
  useContentStreamHistoryStore,
  useContentStreamFilterStore,
  useContentStore,
} from '../stores';
import { onBeforeRouteLeave } from 'vue-router';
import { useStream } from '@/stream/stream.composable';
import { scrollToBottom } from '@/core';
import DefaultStreamEntry from './DefaultStreamEntry.vue';

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
        if (!streamRoot.value) return;
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
  useContentStreamClient(),
);

const { models, isReady, isInitialized } = stream;

const error = ref<string>();

async function initOrRestore() {
  try {
    const history = getHistoryState(filter.value.parentId);
    if (history) {
      await stream.restore(history);
      removeHistoryState(filter.value.parentId);
    } else {
      await stream.init();
    }
  } catch (e) {
    error.value = 'content.stream.initError';
    console.error(e);
  }
}

function reload() {
  location.reload();
}

function getStreamEntryComponent(content: ContentModel) {
  return getContentStreamEntryComponent(content) || DefaultStreamEntry;
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
  <div v-if="!isReady" class="absolute w-full h-full bg-body z-50">
    <div class="flex items-center w-full h-full justify-center">
      <ly-loader />
    </div>
  </div>
  <div
    id="contentStreamRoot"
    ref="streamRoot"
    v-mobile-scrollbar
    data-id="content-stream-root"
    class="overflow-auto bg-body scrollbar-thin pt-2 md:pt-4 md:p-1 flex-grow">
    <div v-if="isInitialized" class="h-full">
      <slot name="before" :stream="stream"></slot>
      <div class="relative">
        <slot name="stream-begin" :stream="stream"></slot>
        <div v-if="models.length" class="px-2 md:px-6">
          <template v-for="(model, index) in models" :key="model.id">
            <Component
              :is="getStreamEntryComponent(model)"
              :model="model"
              :stream="stream"
              :index="index"
              @select-tag="selectTag" />
          </template>
        </div>
        <slot v-else name="stream-empty" :stream="stream"></slot>
      </div>
    </div>
    <div v-else-if="error" class="absolute w-full h-full bg-body z-50 p-5">
      <ly-alert type="danger" class="justify-center">
        <div class="flex flex-col gap-2 items-center justify-center">
          <div>{{ t(error) }}</div>
          <ly-button class="primary text-xs" text="common.reload" @click="reload" />
        </div>
      </ly-alert>
    </div>
  </div>
</template>

<style></style>
