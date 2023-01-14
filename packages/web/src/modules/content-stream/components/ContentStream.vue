<script lang="ts" setup>
import { getContentStreamEntryComponent } from '@/modules/content-stream/components/content-stream-entry.registry';
import { defineAsyncComponent, onMounted, onUnmounted, ref, Ref, watch } from 'vue';
import {
  ContentModel,
  ContentStreamFilter,
  ContentUpdateStateLiveEvent,
  Lazy,
  StreamDirection,
} from '@lyvely/common';
import { DynamicScroller, DynamicScrollerItem } from 'vue-virtual-scroller';
import { useStream } from '@/modules/stream/composables/stream.composable';
import { useContentStreamService } from '@/modules/content-stream/services/content-stream.service';
import { useLiveStore } from '@/modules/live/stores/live.store';
import { useProfileStore } from '@/modules/profiles/stores/profile.store';
import { storeToRefs } from 'pinia';
import { useContentStreamStore } from '@/modules/content-stream/stores/content-stream.store';
import { onBeforeRouteLeave } from 'vue-router';
import DefaultStreamEntry from '@/modules/content-stream/components/DefaultStreamEntry.vue';

export interface IProps {
  batchSize?: number;
  filter: ContentStreamFilter;
  scrollToStart?: boolean;
}

const props = withDefaults(defineProps<IProps>(), {
  batchSize: 50,
  scrollToStart: true,
});

const { profile } = storeToRefs(useProfileStore());
const streamRoot = ref<HTMLElement>() as Ref<HTMLElement>;
const scroller = ref() as Ref<DynamicScroller>;
const contentStreamStore = useContentStreamStore();
const filter = ref(props.filter);
const live = useLiveStore();

const stream = useStream<ContentModel, ContentStreamFilter>(
  { batchSize: props.batchSize, direction: StreamDirection.BBT },
  useContentStreamService(),
  filter.value,
);

const { models } = stream;

watch(filter, () => stream.reload(), { deep: true });

function onContentUpdate(evt: ContentUpdateStateLiveEvent) {
  if (evt.pid === profile.value?.id && evt.updatesAvailable) {
    stream.loadHead();
  }
}

onMounted(() => {
  const history = contentStreamStore.getHistoryState(filter.value.parent);
  if (!history?.stream) {
    stream.init({
      root: streamRoot.value,
      scrollToStart: props.scrollToStart,
      infiniteScroll: { distance: 100 },
    });
  } else {
    stream.restore({
      history: history.stream,
      root: streamRoot.value,
      infiniteScroll: { distance: 100 },
    });

    contentStreamStore.removeHistoryState(filter.value.parent);
    const index = models.value.findIndex((m) => m.id === history.state.cid);
    setTimeout(() => scroller.value.scrollToItem(index));
  }

  live.on('content', ContentUpdateStateLiveEvent.eventName, onContentUpdate);
});

onUnmounted(() => live.off('content', ContentUpdateStateLiveEvent.eventName, onContentUpdate));

onBeforeRouteLeave((to) => {
  if (!to.name || !['content-details', 'stream'].includes(to.name as string)) {
    contentStreamStore.reset();
  } else if (to.params.cid) {
    useContentStreamStore().setHistoryState(stream, filter.value.parent, to.params.cid as string);
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
    class="overflow-auto scrollbar-thin pt-2 md:pt-4 md:p-1 flex-grow">
    <dynamic-scroller ref="scroller" :items="models" :min-item-size="100" page-mode>
      <template #before>
        <slot name="before"></slot>
      </template>
      <template
        #default="{ item, index, active }: { item: ContentModel, index: number, active: boolean }">
        <dynamic-scroller-item :item="item" :active="active" :data-index="index">
          <div class="px-2 md:px-6">
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
