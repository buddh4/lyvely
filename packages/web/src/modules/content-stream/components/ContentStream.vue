<script lang="ts" setup>
import { getContentStreamEntryComponent } from '@/modules/content-stream/components/content-stream-entry.registry';
import { onMounted, onUnmounted, ref, Ref, watch, computed } from 'vue';
import {
  ContentModel,
  ContentStreamFilter,
  ContentUpdateStateLiveEvent,
  StreamDirection,
} from '@lyvely/common';
import { DynamicScroller, DynamicScrollerItem } from 'vue-virtual-scroller';
import { useStream } from '@/modules/stream/composables/stream.composable';
import { useContentStreamService } from '@/modules/content-stream/services/content-stream.service';
import { useLiveStore } from '@/modules/live/stores/live.store';
import { useProfileStore } from '@/modules/profiles/stores/profile.store';
import { storeToRefs } from 'pinia';
import { useContentStreamHistoryStore } from '@/modules/content-stream/stores/content-stream-history.store';
import { onBeforeRouteLeave } from 'vue-router';
import { useContentStreamStore } from '@/modules/content-stream/stores/content-stream.store';

export interface IProps {
  batchSize?: number;
  scrollToStart?: boolean;
}

const props = withDefaults(defineProps<IProps>(), {
  batchSize: 50,
  scrollToStart: true,
});

const { profile } = storeToRefs(useProfileStore());
const streamRoot = ref<HTMLElement>() as Ref<HTMLElement>;
const scroller = ref() as Ref<typeof DynamicScroller>;
const live = useLiveStore();
const isInitialized = ref(false);

const { getHistoryState, removeHistoryState, resetHistory } = useContentStreamHistoryStore();
const { reload, loadHead, init, restore } = useContentStreamStore();
const { models, filter } = storeToRefs(useContentStreamStore());

watch(filter, () => reload(), { deep: true });

function onContentUpdate(evt: ContentUpdateStateLiveEvent) {
  if (evt.pid === profile.value?.id && evt.updatesAvailable) {
    loadHead();
  }
}

onMounted(() => {
  const history = getHistoryState(filter.value.parent);
  isInitialized.value = false;
  if (!history?.stream) {
    init({
      root: streamRoot.value,
      scrollToStart: props.scrollToStart,
      infiniteScroll: { distance: 100 },
    }).then(() => (isInitialized.value = true));
  } else {
    restore({
      history: history.stream,
      root: streamRoot.value,
      infiniteScroll: { distance: 100 },
    }).then(() => (isInitialized.value = true));

    removeHistoryState(filter.value.parent);
    const index = models.value.findIndex((m) => m.id === history.state.cid);
    setTimeout(() => scroller.value.scrollToItem(index));
  }

  live.on('content', ContentUpdateStateLiveEvent.eventName, onContentUpdate);
});

onUnmounted(() => live.off('content', ContentUpdateStateLiveEvent.eventName, onContentUpdate));

onBeforeRouteLeave((to) => {
  if (!to.name || !['content-details', 'stream'].includes(to.name as string)) {
    resetHistory();
  } else if (to.params.cid) {
    useContentStreamHistoryStore().setHistoryState(
      stream,
      filter.value.parent,
      to.params.cid as string,
    );
  }
});

defineExpose({ stream });

function selectTag(tagId: string) {
  filter.value.addTagId(tagId);
}
</script>

<template>
  <div
    id="contentStreamRoot"
    ref="streamRoot"
    class="overflow-auto scrollbar-thin pt-2 md:pt-4 md:p-1 flex-grow relative">
    <dynamic-scroller ref="scroller" :items="models" :min-item-size="50" :buffer="300" page-mode>
      <template #before>
        <slot name="before"></slot>
      </template>
      <template
        #default="{ item, index, active }: { item: ContentModel, index: number, active: boolean }">
        <dynamic-scroller-item :item="item" :active="active" :data-index="index">
          <div class="px-2 md:px-6">
            {{ index === undefined ? 'dfasfasdf' : '' }}
            <Component
              :is="getContentStreamEntryComponent(item)"
              :model="item"
              :stream="stream"
              :index="index"
              @select-tag="selectTag" />
          </div>
        </dynamic-scroller-item>
      </template>
    </dynamic-scroller>
  </div>
</template>

<style scoped></style>
