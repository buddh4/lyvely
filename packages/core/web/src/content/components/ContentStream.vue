<script lang="ts" setup>
import { getContentStreamEntryComponent } from '../registries';
import { t } from '@/i18n';
import { computed, onMounted, onUnmounted, ref, Ref, watch, WatchStopHandle } from 'vue';
import {
  ContentModel,
  ContentRequestFilter,
  ContentUpdateStateLiveEvent,
  StreamDirection,
  useContentStreamClient,
} from '@lyvely/interface';
import { useLiveStore } from '@/live/stores/live.store';
import { useProfileStore } from '@/profiles/stores/profile.store';
import { storeToRefs } from 'pinia';
import { useContentStreamHistoryStore, useContentStreamFilter, useContentStore } from '../stores';
import { onBeforeRouteLeave } from 'vue-router';
import { useStream } from '@/stream/stream.composable';
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

const { filter } = useContentStreamFilter();
const streamRoot = ref<HTMLElement>() as Ref<HTMLElement>;
const { profile } = storeToRefs(useProfileStore());
const live = useLiveStore();

const { getHistoryState, removeHistoryState, resetHistory } = useContentStreamHistoryStore();
const stream = useStream<ContentModel, ContentRequestFilter>(
  {
    root: streamRoot,
    filter: filter,
    batchSize: props.batchSize,
    direction: StreamDirection.BBT,
    scrollToHeadOnInit: props.scrollToHead,
    infiniteScroll: props.infiniteScroll ? { distance: 250 } : false,
  },
  useContentStreamClient()
);

const { models, isReady, isLoading } = stream;

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
      streamRoot.value.scrollTop
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
  if (filter.value.test(content)) {
    stream.addHead([content], true);
  }
};

let unWatchFilter: WatchStopHandle;

const scrolled = ref(false);

const showStream = computed(() => {
  if (getHistoryState(filter.value.parentId)) return isReady.value;
  return scrolled.value;
});

onMounted(() => {
  // TODO: This is a mess unfortunately, we should replace the internal scrollToHead with the observer strategy.
  const history = getHistoryState(filter.value.parentId);
  if (!history && props.scrollToHead) {
    let observer = new MutationObserver((mutationsList) => {
      // If something changes in your div, this function will run.
      for (let mutation of mutationsList) {
        if (mutation.type === 'childList' || mutation.type === 'attributes') {
          setTimeout(() => {
            streamRoot.value.scrollTop = streamRoot.value.scrollHeight;
          });
        }
      }
    });

    observer.observe(streamRoot.value, { attributes: true, childList: true, subtree: true });

    watch(isReady, () => {
      setTimeout(() => {
        observer.disconnect();
        scrolled.value = true;
      }, 100);
    });

    // Make sure we disconnect
    setTimeout(() => {
      observer.disconnect();
      scrolled.value = true;
    }, 1000);
  } else {
    scrolled.value = true;
  }

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
  <div v-if="!showStream" class="absolute z-50 h-full w-full bg-body bg-opacity-25">
    <div class="flex h-full w-full items-center justify-center">
      <ly-loader />
    </div>
  </div>
  <div
    id="contentStreamRoot"
    ref="streamRoot"
    v-mobile-scrollbar
    data-id="content-stream-root"
    class="scrollbar-thin flex-grow overflow-y-auto overflow-x-hidden bg-body pt-2 md:p-1 md:pt-4">
    <div v-if="!error" class="h-full">
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
        <slot v-else-if="!isLoading" name="stream-empty" :stream="stream" :filter="filter"></slot>
      </div>
    </div>
    <div v-else class="absolute z-50 h-full w-full bg-body p-5">
      <ly-alert type="danger" class="justify-center">
        <div class="flex flex-col items-center justify-center gap-2">
          <div>{{ t(error) }}</div>
          <ly-button class="primary text-xs" text="common.reload" @click="reload" />
        </div>
      </ly-alert>
    </div>
  </div>
</template>

<style></style>
