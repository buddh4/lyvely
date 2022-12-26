<script lang="ts" setup>
import { getContentStreamEntryComponent } from '@/modules/content-stream/components/content-stream-entry.registry';
import { onMounted, onUnmounted, ref, Ref } from 'vue';
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

export interface IProps {
  batchSize?: number;
  filter?: ContentStreamFilter;
}

const { profile } = storeToRefs(useProfileStore());

const props = withDefaults(defineProps<IProps>(), {
  batchSize: 25,
  filter: undefined,
});

function onContentUpdate(evt: ContentUpdateStateLiveEvent) {
  if (evt.pid === profile.value?.id) {
    stream.value.update();
  }
}

const live = useLiveStore();
live.on('content', ContentUpdateStateLiveEvent.eventName, onContentUpdate);

const stream = ref(
  useStream<ContentModel, ContentStreamFilter>(
    { batchSize: props.batchSize, direction: StreamDirection.BBT },
    useContentStreamService(),
    props.filter || new ContentStreamFilter(),
  ),
);

const streamRoot = ref<HTMLElement>() as Ref<HTMLElement>;

async function initStream() {
  return stream.value.init({
    root: streamRoot.value,
    infiniteScroll: { distance: 100 },
  });
}

onMounted(initStream);
onUnmounted(() => live.off('content', ContentUpdateStateLiveEvent.eventName, onContentUpdate));
</script>

<template>
  <div id="contentStreamRoot" ref="streamRoot" class="overflow-auto scrollbar-thin">
    <dynamic-scroller :items="stream.models" :min-item-size="100">
      <template #before>
        <slot name="before"></slot>
      </template>
      <template
        #default="{ item, index, active }: { item: ContentModel, index: number, active: boolean }">
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
</template>

<style scoped></style>
